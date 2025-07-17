// server/services/reportBuilder.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDFReport(data, outputPath = null) {
  const {
    url,
    overallScore,
    scores,
    groups,
    fromHTML = false
  } = data;

  const timestamp = new Date().toISOString();
  const title = fromHTML ? 'Uploaded HTML Report' : `Accessibility Report for ${url}`;

  // Generate basic HTML
  const html = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1, h2 { color: #333; }
        .group { margin-top: 20px; }
        .rule { margin: 10px 0; }
        code { background: #eee; padding: 2px 4px; }
        .low { color: #e74c3c; }
        .med { color: #f39c12; }
        .high { color: #27ae60; }
        .html-sample { background: #f4f4f4; padding: 6px; font-family: monospace; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p><strong>Date:</strong> ${timestamp}</p>
      ${!fromHTML ? `<p><strong>URL:</strong> ${url}</p>` : ""}
      <p><strong>Overall Accessibility Score:</strong> ${overallScore}%</p>

      <h2>Scores by Disability Group</h2>
      <ul>
        <li>Visual Impairment: ${scores.visual}%</li>
        <li>Motor Impairment: ${scores.motor}%</li>
        <li>Deaf Users: ${scores.deaf}%</li>
      </ul>

      <h2>Failed Automated Checks</h2>
      ${Object.entries(groups).map(([group, data]) => `
        <div class="group">
          <h3>${capitalize(group)} Group</h3>
          ${data.failedChecks.length === 0 ? '<p>No failed checks.</p>' : ''}
          ${data.failedChecks.map(check => `
            <div class="rule">
              <strong>${check.rule}</strong> (${check.impact || 'none'})<br/>
              <em>${check.description}</em><br/>
              ${check.html.map(h => `<div class="html-sample">&lt;${escapeHTML(h)}&gt;</div>`).join('')}
            </div>
          `).join('')}
        </div>
      `).join('')}

      <h2>Manual Checks to Consider</h2>
      ${Object.entries(groups).map(([group, data]) => `
        <div class="group">
          <h3>${capitalize(group)} Group</h3>
          <ul>
            ${data.manualTips.map(t => `<li>${t.tip}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </body>
    </html>
  `;

  // Ensure output folder exists
    const reportsDir = path.join(__dirname, '../../public/reports');
    if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    }

  // Create temporary file if path not provided
  //const filePath = outputPath || path.join(__dirname, '../../public/reports', `report-${Date.now()}.pdf`);

    // Ensure output directory exists

    // Create file path
    const filePath = outputPath || path.join(reportsDir, `report-${Date.now()}.pdf`);


  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({ path: filePath, format: 'A4' });
  await browser.close();

  return filePath;
}

// Helpers
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHTML(str) {
  return str.replace(/[<>&]/g, (tag) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;'
  }[tag]));
}

module.exports = { generatePDFReport };
