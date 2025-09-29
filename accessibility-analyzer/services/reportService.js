import { v4 as uuidv4 } from 'uuid';
import puppeteer from 'puppeteer';
import { disabilityMap } from '../config/disabilityMap.js';

// --- Part 1: Data Processing ---

function processAxeResults(rawAxeResults) {
  const report = {
    reportId: uuidv4(),
    metadata: {
      url: rawAxeResults[0]?.url || 'N/A',
      timestamp: new Date().toISOString(),
      axeVersion: rawAxeResults[0]?.testEngine?.version,
      scannedPages: rawAxeResults.length,
    },
    scores: {
      overall: 0,
      cognitive: 0,
      motor: 0,
      visual: 0,
    },
    groups: {
      cognitive: { violations: [], passes: [], incomplete: [] },
      motor: { violations: [], passes: [], incomplete: [] },
      visual: { violations: [], passes: [], incomplete: [] },
    },
  };

  const disabilityGroups = ['cognitive', 'motor', 'visual'];

  // Combine results from all scanned pages
  const allViolations = rawAxeResults.flatMap(r => r.violations);
  const allPasses = rawAxeResults.flatMap(r => r.passes);
  const allIncomplete = rawAxeResults.flatMap(r => r.incomplete);

  // Helper to process a set of rules (violations, passes, etc.)
  const processRules = (rules, type) => {
    for (const rule of rules) {
      const mapping = disabilityMap[rule.id];
      if (!mapping) continue;

      disabilityGroups.forEach(group => {
        if (mapping[group] && mapping[group].weight > 1) { // We only consider impactful rules for the report
          report.groups[group][type].push({
            id: rule.id,
            impact: rule.impact,
            description: rule.description,
            helpUrl: rule.helpUrl,
            nodes: rule.nodes.map(n => ({ html: n.html, failureSummary: n.failureSummary })),
          });
        }
      });
    }
  };

  processRules(allViolations, 'violations');
  processRules(allPasses, 'passes');
  processRules(allIncomplete, 'incomplete');

  // --- Scoring Logic ---
  disabilityGroups.forEach(group => {
    const totalPossibleImpact = Object.values(disabilityMap)
      .reduce((acc, rule) => acc + (rule[group]?.weight || 0), 0);
      
    const totalViolationsImpact = report.groups[group].violations
      .reduce((acc, v) => acc + (disabilityMap[v.id]?.[group]?.weight || 0), 0);
      
    const score = totalPossibleImpact > 0 ? ((totalPossibleImpact - totalViolationsImpact) / totalPossibleImpact) * 100 : 100;
    report.scores[group] = Math.round(score);
  });

  report.scores.overall = Math.round((report.scores.cognitive + report.scores.motor + report.scores.visual) / 3);

  return report;
}

// --- Part 2: HTML & PDF Generation ---

function generateHtml(reportData) {
  // Helper to create sections for violations, passes, and manual review
  const createSection = (title, items) => {
    if (items.length === 0) return '';
    return `
      <h3>${title}</h3>
      ${items.map(item => `
        <div class="item">
          <p><strong>Rule:</strong> ${item.id} (${item.impact})</p>
          <p>${item.description}</p>
          ${item.nodes.map(node => `<pre><code>${escapeHtml(node.html)}</code></pre>`).join('')}
        </div>
      `).join('')}
    `;
  };
  
  const escapeHtml = (unsafe) => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Accessibility Report</title>
      <style>
        body { font-family: sans-serif; margin: 2em; color: #333; }
        h1, h2, h3 { color: #1a1a1a; }
        .header { border-bottom: 2px solid #eee; padding-bottom: 1em; margin-bottom: 2em; }
        .scores { display: flex; justify-content: space-around; text-align: center; margin: 2em 0; }
        .score-card { padding: 1em; border: 1px solid #ddd; border-radius: 8px; width: 20%; }
        .score-card h3 { margin: 0; }
        .score-card .score { font-size: 2.5em; font-weight: bold; }
        .group { margin-bottom: 3em; border-top: 1px solid #ddd; padding-top: 1em; }
        .item { border: 1px solid #eee; border-radius: 5px; padding: 1em; margin-bottom: 1em; }
        pre { background-color: #f4f4f4; padding: 1em; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
        code { font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Accessibility Report</h1>
        <p><strong>URL Scanned:</strong> ${reportData.metadata.url}</p>
        <p><strong>Scan Date:</strong> ${new Date(reportData.metadata.timestamp).toLocaleString()}</p>
        <p><strong>Pages Scanned:</strong> ${reportData.metadata.scannedPages}</p>
      </div>
      
      <h2>Overall Score</h2>
      <div class="scores">
        <div class="score-card">
          <h3>Overall</h3>
          <p class="score">${reportData.scores.overall}%</p>
        </div>
      </div>
      
      <h2>Scores by Disability Group</h2>
      <div class="scores">
        <div class="score-card"><h3>Cognitive</h3><p class="score">${reportData.scores.cognitive}%</p></div>
        <div class="score-card"><h3>Motor</h3><p class="score">${reportData.scores.motor}%</p></div>
        <div class="score-card"><h3>Visual</h3><p class="score">${reportData.scores.visual}%</p></div>
      </div>

      ${Object.keys(reportData.groups).map(groupKey => `
        <div class="group">
          <h2>${groupKey.charAt(0).toUpperCase() + groupKey.slice(1)} Impairment Details</h2>
          ${createSection('Failed Checks', reportData.groups[groupKey].violations)}
          ${createSection('Passed Checks', reportData.groups[groupKey].passes)}
          ${createSection('Manual Review Required', reportData.groups[groupKey].incomplete)}
        </div>
      `).join('')}
    </body>
    </html>
  `;
}

/**
 * Main function to generate the final PDF report.
 * @param {Array<object>} rawAxeResults - An array of raw JSON objects from axe-core.
 * @returns {Promise<Buffer>} A buffer containing the generated PDF file.
 */
export async function generateReport(rawAxeResults) {
  if (!rawAxeResults || rawAxeResults.length === 0) {
    throw new Error('No accessibility results to report.');
  }

  // 1. Process the raw data
  const reportData = processAxeResults(rawAxeResults);

  // 2. Generate HTML from the processed data
  const htmlContent = generateHtml(reportData);

  // 3. Use Puppeteer to convert HTML to PDF
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return pdfBuffer;
}