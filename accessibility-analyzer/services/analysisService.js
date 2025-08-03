import puppeteer from 'puppeteer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Find the path to axe.min.js within your node_modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const axeCorePath = path.resolve(__dirname, '..', 'node_modules/axe-core/axe.min.js');
const axeScript = fs.readFileSync(axeCorePath, 'utf-8');

/**
 * Runs an axe scan on a single Puppeteer page.
 * @param {import('puppeteer').Page} page - The Puppeteer page to test.
 * @returns {Promise<object>} The axe results object.
 */
async function getAxeResults(page) {
  await page.evaluate(axeScript); // Inject axe-core into the page
  // Run axe and return the results
  const results = await page.evaluate(() => axe.run());
  return results;
}

/**
 * Analyzes a given URL and any internal links (depth 1).
 * @param {string} url - The URL to analyze.
 * @returns {Promise<Array<object>>} An array of axe results for each page scanned.
 */
export async function analyzeUrl(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const allResults = [];

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    const mainPageResults = await getAxeResults(page);
    allResults.push(mainPageResults);

    // --- Crawler Logic (Depth 1) ---
    const pageOrigin = new URL(url).origin;
    const internalLinks = await page.$$eval('a', (links, origin) =>
      links
        .map(link => link.href) // Get the href
        .filter(href => href.startsWith(origin)) // Keep only links from the same origin
        .filter((href, index, self) => self.indexOf(href) === index) // Get unique links
    , pageOrigin);

    for (const link of internalLinks) {
        if (link !== url) { // Don't re-scan the original page
            console.log(`Crawling to: ${link}`);
            await page.goto(link, { waitUntil: 'networkidle2' });
            const linkResults = await getAxeResults(page);
            allResults.push(linkResults);
        }
    }

  } finally {
    await browser.close();
  }
  return allResults;
}

/**
 * Analyzes an HTML file buffer.
 * @param {Buffer} fileBuffer - The buffer containing the HTML file content.
 * @returns {Promise<Array<object>>} An array containing the single axe result object.
 */
export async function analyzeFile(fileBuffer) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  try {
    // Use setContent to load the HTML from the buffer
    await page.setContent(fileBuffer.toString('utf-8'), { waitUntil: 'networkidle0' });
    const results = await getAxeResults(page);
    return [results]; // Return as an array to keep data structure consistent
  } finally {
    await browser.close();
  }
}