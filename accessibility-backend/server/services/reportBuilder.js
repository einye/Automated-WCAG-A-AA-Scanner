// server/services/reportBuilder.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDFReport(data, outputPath = null) {
  const {
    url,
    scannedAt,
    overallScore,
    scores,
    groups,
    manualReview = [],
    fromHTML = false
  } = data;

  const groupNames = ['visual', 'motor', 'cognitive'];
    for (const g of groupNames) {
        if (!groups[g]) {
            groups[g] = {
            passedChecks: [],
            failedChecks: [],
            total: 0,
            passed: 0,
            failed: 0
            };
        }
    }

  const title = fromHTML ? 'Uploaded HTML Report' : `Accessibility Report for ${url}`;
  const reportsDir = path.join(__dirname, '../../public/reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const filePath = outputPath || path.join(reportsDir, `report-${Date.now()}.pdf`);

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1, h2, h3 { color: #333; }
          ul { padding-left: 20px; }
          .group { margin-top: 30px; }
          .rule { margin-bottom: 10px; }
          .html-sample { background: #f9f9f9; padding: 6px; font-family: monospace; white-space: pre-wrap; border: 1px solid #ccc; margin-top: 4px; }
          .score { font-size: 1.1em; margin-bottom: 8px; }
          .section-title { border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px; }
          .passed-checks { color: #2e7d32; }
          .failed-checks { color: #c62828; }
          .impact { font-weight: bold; text-transform: capitalize; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p><strong>Date:</strong> ${new Date(scannedAt).toLocaleString()}</p>
        ${!fromHTML ? `<p><strong>URL:</strong> ${url}</p>` : ""}
        <p><strong>Overall Accessibility Score:</strong> ${overallScore}%</p>

        <h2 class="section-title">Scores by Disability Group</h2>
        <ul>
          <li>👁️ Visual: ${scores.visual}%</li>
          <li>🖐️ Motor: ${scores.motor}%</li>
          <li>🧠 Cognitive: ${scores.cognitive}%</li>
        </ul>

        ${Object.entries(groups).map(([group, g]) => `
          <div class="group">
            <h2>${capitalize(group)} Group</h2>

            <div class="failed-checks">
              <h3>❌ Failed Checks</h3>
              ${g.failedChecks.length === 0 ? '<p>None 🎉</p>' : g.failedChecks.map(check => `
                <div class="rule">
                  <div><strong>${check.rule}</strong> <span class="impact">[${check.impact}]</span></div>
                  <div><em>${escapeHTML(check.description)}</em></div>
                  ${check.html.map(h => `<div class="html-sample">${escapeHTML(h)}</div>`).join('')}
                </div>
              `).join('')}
            </div>

            <div class="passed-checks">
              <h3>✅ Passed Checks</h3>
              ${g.passedChecks.length === 0 ? '<p>None</p>' : g.passedChecks.map(check => `
                <div class="rule">
                  <div><strong>${check.rule}</strong></div>
                  <div><em>${escapeHTML(check.description)}</em></div>
                  ${check.html.map(h => `<div class="html-sample">${escapeHTML(h)}</div>`).join('')}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <div class="group">
          <h2>🔍 Manual Review Needed</h2>
          ${manualReview.length > 0
            ? manualReview.map(item => `
                <div class="rule">
                  <div><strong>${item.rule}</strong></div>
                  <div><em>${escapeHTML(item.description)}</em></div>
                  ${item.html.map(h => `<div class="html-sample">${escapeHTML(h)}</div>`).join('')}
                </div>
              `).join('')
            : `<p>No incomplete rules were flagged, but some accessibility issues may still require manual review. Consider testing:</p>
              <ul>
                <li>⏳ Keyboard traps or inaccessible dynamic content</li>
                <li>🎞️ Video/audio captions, transcripts, timing controls</li>
                <li>↔️ Logical tab/focus order</li>
                <li>🧠 Cognitive load and consistent navigation</li>
              </ul>`
          }
        </div>
        <hr>
        <p style="text-align: center;">END OF REPORT</p>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({ path: filePath, format: 'A4', printBackground: true, margin: { top: '40px', bottom: '40px', left: '30px', right: '30px' },});
  await browser.close();

  return filePath;
}

// Helpers
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHTML(str) {
  return str.replace(/[<>&]/g, tag => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;'
  }[tag]));
}

module.exports = { generatePDFReport };
