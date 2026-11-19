// server/services/reportBuilder.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDFReport(data, outputPath = null) {
  const {
    urls,
    reports,
    scannedAt,
    fromHTML = false
  } = data;

  // Normalize to array if single report
  const reportArray = Array.isArray(reports) ? reports : [data];

  const groupNames = ['visual', 'motor', 'cognitive'];
  reportArray.forEach(report => {
    for (const g of groupNames) {
      if (!report.groups[g]) {
        report.groups[g] = {
          passedChecks: [],
          failedChecks: [],
          total: 0,
          passed: 0,
          failed: 0
        };
      }
    }
  });

  const title = fromHTML ? 'Uploaded HTML Compliance Report' : `Multi-Page Accessibility Report`;
  const reportsDir = path.join(__dirname, '../../public/reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const filePath = outputPath || path.join(reportsDir, `report-${Date.now()}.pdf`);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1f2937;
            line-height: 1.5;
            padding: 30px;
            background: #ffffff;
          }
          a {
            color: #3b82f6;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          
          /* Header Card */
          .hero-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: #ffffff;
            padding: 40px 30px;
            border-radius: 16px;
            margin-bottom: 35px;
            position: relative;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .hero-header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.025em;
          }
          .hero-header p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 25px;
            border-t: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 20px;
          }
          .meta-item span {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            opacity: 0.7;
          }
          .meta-item strong {
            display: block;
            font-size: 16px;
            font-weight: 600;
          }

          /* Score Badges & Colors */
          .score-card {
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            border: 1px solid #e5e7eb;
          }
          .score-value {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 4px;
          }
          .score-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          /* Themes */
          .bg-green { background-color: #ecfdf5; border-color: #a7f3d0; color: #047857; }
          .bg-yellow { background-color: #fffbeb; border-color: #fde68a; color: #b45309; }
          .bg-red { background-color: #fef2f2; border-color: #fecaca; color: #b91c1c; }
          .bg-blue { background-color: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
          
          /* Grids */
          .scores-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 35px;
          }

          /* General Sections */
          .section-title {
            font-size: 20px;
            font-weight: 700;
            margin: 40px 0 20px 0;
            color: #111827;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 8px;
          }
          .page-container {
            margin-bottom: 50px;
          }
          .page-header {
            font-size: 22px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #3b82f6;
          }

          /* Disability Group blocks */
          .group-block {
            background: #f9fafb;
            border: 1px solid #f3f4f6;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
          }
          .group-title {
            font-size: 18px;
            font-weight: 700;
            margin: 0 0 20px 0;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 8px;
            text-transform: capitalize;
          }
          
          /* Checks styling */
          .checks-container {
            margin-top: 15px;
          }
          .checks-title {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 12px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e5e7eb;
          }
          .checks-title.failed { color: #b91c1c; }
          .checks-title.passed { color: #047857; }

          .rule-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          .rule-card.failed-rule {
            border-left: 4px solid #ef4444;
          }
          .rule-card.passed-rule {
            border-left: 4px solid #10b981;
          }
          .rule-card.manual-rule {
            border-left: 4px solid #f59e0b;
          }
          
          .rule-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 6px;
          }
          .rule-name {
            font-weight: 700;
            font-size: 14px;
            color: #111827;
          }
          .impact-badge {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 2px 8px;
            border-radius: 9999px;
          }
          .impact-critical { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
          .impact-serious { background: #fff7ed; color: #9a3412; border: 1px solid #fed7aa; }
          .impact-moderate { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
          .impact-minor { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }

          .rule-desc {
            font-size: 13px;
            color: #4b5563;
            margin-bottom: 8px;
          }
          
          .html-snippet {
            background: #1e293b;
            color: #38bdf8;
            padding: 10px;
            border-radius: 6px;
            font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 11px;
            white-space: pre-wrap;
            word-break: break-all;
            margin-top: 8px;
          }
          
          /* Footer */
          .report-footer {
            margin-top: 50px;
            border-t: 1px solid #e5e7eb;
            padding-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
          }

          /* Print Optimizations */
          @media print {
            body {
              padding: 0;
            }
            .page-break {
              page-break-before: always;
            }
            .group-block {
              page-break-inside: avoid;
            }
            .rule-card {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <!-- Header Hero -->
        <div class="hero-header">
          <h1>${title}</h1>
          <p>Automated WCAG 2.1/2.2 accessibility engine.</p>
          <div class="meta-grid">
            <div class="meta-item">
              <span>Audit Date</span>
              <strong>${new Date(scannedAt).toLocaleString()}</strong>
            </div>
            <div class="meta-item">
              <span>Scanned Pages</span>
              <strong>${reportArray.length} Page(s)</strong>
            </div>
            <div class="meta-item">
              <span>Engine Version</span>
              <strong>axe-core v4.x</strong>
            </div>
          </div>
        </div>

        ${reportArray.map((report, idx) => {
          const { url, overallScore, scores, groups, manualReview = [] } = report;
          
          // Theme helper
          const getThemeClass = (score) => {
            if (score >= 90) return 'bg-green';
            if (score >= 70) return 'bg-yellow';
            return 'bg-red';
          };

          const emojis = {
            visual: '',
            motor: '',
            cognitive: ''
          };

          return `
            <div class="page-container ${idx > 0 ? 'page-break' : ''}">
              <div class="page-header">
                Page ${idx + 1}: ${escapeHTML(url || 'Uploaded HTML')}
              </div>

              <!-- Page Scores Grid -->
              <div class="scores-grid">
                <div class="score-card ${getThemeClass(overallScore)}">
                  <div class="score-value">${overallScore}%</div>
                  <div class="score-label">Overall Compliance</div>
                </div>
                <div class="score-card ${getThemeClass(scores.visual)}">
                  <div class="score-value">${scores.visual}%</div>
                  <div class="score-label">Visual</div>
                </div>
                <div class="score-card ${getThemeClass(scores.motor)}">
                  <div class="score-value">${scores.motor}%</div>
                  <div class="score-label">Motor</div>
                </div>
                <div class="score-card ${getThemeClass(scores.cognitive)}">
                  <div class="score-value">${scores.cognitive}%</div>
                  <div class="score-label">Cognitive</div>
                </div>
              </div>

              <div class="section-title">Disability Group Breakdowns</div>

              ${Object.entries(groups).map(([group, g]) => `
                <div class="group-block">
                  <h3 class="group-title">
                      ${group} Accessibility
                    </h3>

                  <!-- Failed Checks -->
                    <div class="checks-container">
                    <div class="checks-title failed">Failed Checks (${g.failedChecks.length})</div>
                    ${g.failedChecks.length === 0 
                      ? '<p style="font-size: 13px; color: #047857; margin-bottom: 20px;">None — All checks passed successfully!</p>' 
                      : g.failedChecks.map(check => `
                        <div class="rule-card failed-rule">
                          <div class="rule-header">
                            <span class="rule-name">${check.rule}</span>
                            <span class="impact-badge ${
                              check.impact === 'critical' ? 'impact-critical' :
                              check.impact === 'serious' ? 'impact-serious' :
                              check.impact === 'moderate' ? 'impact-moderate' : 'impact-minor'
                            }">${check.impact || 'moderate'}</span>
                          </div>
                          <div class="rule-desc">${escapeHTML(check.description)}</div>
                          ${check.helpUrl ? `<div style="font-size: 11px; margin-bottom: 8px;"><a href="${check.helpUrl}" target="_blank">Learn more about this rule &rarr;</a></div>` : ''}
                          ${check.html.map(h => `<div class="html-snippet">${escapeHTML(h)}</div>`).join('')}
                        </div>
                      `).join('')
                    }
                  </div>

                  <!-- Passed Checks -->
                  <div class="checks-container" style="margin-top: 25px;">
                    <div class="checks-title passed">Passed Checks (${g.passedChecks.length})</div>
                    ${g.passedChecks.length === 0 
                      ? '<p style="font-size: 13px; color: #6b7280;">No passed checks in this category.</p>' 
                      : g.passedChecks.map(check => `
                        <div class="rule-card passed-rule">
                          <div class="rule-header">
                            <span class="rule-name">${check.rule}</span>
                          </div>
                          <div class="rule-desc">${escapeHTML(check.description)}</div>
                          ${check.helpUrl ? `<div style="font-size: 11px; margin-bottom: 8px;"><a href="${check.helpUrl}" target="_blank">Learn more about this rule &rarr;</a></div>` : ''}
                          ${check.html.map(h => `<div class="html-snippet">${escapeHTML(h)}</div>`).join('')}
                        </div>
                      `).join('')
                    }
                  </div>
                </div>
              `).join('')}

              <!-- Manual Review -->
              <div class="group-block" style="border-left: 4px solid #f59e0b; background-color: #fffbeb;">
                <h3 class="group-title" style="color: #b45309;">
                  Manual Review Required
                </h3>
                <p style="font-size: 13px; color: #b45309; margin-bottom: 15px;">
                  The following items cannot be fully automated and require manual evaluation by a QA engineer or developer.
                </p>

                <div class="checks-container">
                  ${manualReview.length > 0
                    ? manualReview.map(item => `
                        <div class="rule-card manual-rule">
                          <div class="rule-header">
                            <span class="rule-name">${item.rule}</span>
                          </div>
                          <div class="rule-desc">${escapeHTML(item.description)}</div>
                          ${item.helpUrl ? `<div style="font-size: 11px; margin-bottom: 8px;"><a href="${item.helpUrl}" target="_blank">Learn more about this rule &rarr;</a></div>` : ''}
                          ${item.html.map(h => `<div class="html-snippet">${escapeHTML(h)}</div>`).join('')}
                        </div>
                      `).join('')
                    : `
                      <ul style="font-size: 13px; color: #4b5563; padding-left: 20px; margin: 0;">
                        <li style="margin-bottom: 5px;">Keyboard trapping and interactive component focus indices</li>
                        <li style="margin-bottom: 5px;">Captions, descriptors, and transcripts for visual/auditory media files</li>
                        <li style="margin-bottom: 5px;">Natural and logical tab order of navigation nodes</li>
                        <li style="margin-bottom: 5px;">Readability levels and consistent page navigation architecture</li>
                      </ul>
                    `
                  }
                </div>
              </div>
            </div>
          `;
        }).join('')}

        <div class="report-footer">
          <p>This document is a formal accessibility compliance artifact generated with the help of axe-core.</p>
          <p><strong>&copy; ${new Date().getFullYear()} Accessibility Audit. All Rights Reserved.</strong></p>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({ 
    headless: true,
    timeout: 120000 // 2 minutes for browser launch
  });
  const page = await browser.newPage();
  
  // Set longer timeout for page operations
  page.setDefaultTimeout(120000); // 2 minutes
  page.setDefaultNavigationTimeout(120000);
  
  await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.pdf({ 
    path: filePath, 
    format: 'A4', 
    printBackground: true, 
    margin: { top: '40px', bottom: '40px', left: '30px', right: '30px' },
    timeout: 120000
  });
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