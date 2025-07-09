// audit.js
const puppeteer = require('puppeteer');
const axeCore = require('axe-core');

const DISABILITY_MAP = {
  'color-contrast': ['visual'],
  'image-alt': ['visual'],
  'label': ['visual', 'cognitive'],
  'html-has-lang': ['visual', 'cognitive'],
  'aria-roles': ['screen reader'],
  'aria-valid-attr': ['screen reader'],
  'keyboard': ['motor'],
  'focusable-content': ['motor'],
  // fallback:
  'default': ['general']
};

/**
 * Maps an Axe violation object to a more simplified and categorized format.
 * @param {object} violation - The Axe violation object.
 * @returns {object} The mapped violation object.
 */
function mapViolation(violation) {
  const nodes = violation.nodes.map(node => node.target.join(', '));
  const id = violation.id;
  const disabilities = DISABILITY_MAP[id] || DISABILITY_MAP['default'];

  return {
    id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    disabilities,
    elementsAffected: nodes
  };
}

/**
 * Summarizes a list of mapped violations by impact level.
 * @param {Array<object>} violations - An array of mapped violation objects.
 * @returns {object} The summary object.
 */
function summarizeViolations(violations) {
  const summary = {
    total: violations.length,
    byImpact: {}
  };

  for (const v of violations) {
    summary.byImpact[v.impact] = (summary.byImpact[v.impact] || 0) + 1;
  }

  return summary;
}

/**
 * Runs an accessibility audit on a given URL using Puppeteer and axe-core.
 * @param {string} targetUrl - The URL to audit.
 * @returns {Promise<object>} An object containing the summary and detailed violations.
 */
async function runAxeAudit(targetUrl) {
  const browser = await puppeteer.launch({
    headless: 'new', // for modern Chromium versions
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await page.addScriptTag({ path: require.resolve('axe-core') });

    const results = await page.evaluate(async () => {
      return await axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      });
    });

    const mapped = results.violations.map(mapViolation);
    const summary = summarizeViolations(mapped);

    return {
      summary,
      violations: mapped
    };
  } catch (error) {
    console.error(`Error during audit of ${targetUrl}:`, error);
    throw new Error(`Failed to audit URL: ${targetUrl}. ${error.message}`);
  } finally {
    await browser.close();
  }
}

module.exports = { runAxeAudit };