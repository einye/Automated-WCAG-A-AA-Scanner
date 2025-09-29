import puppeteer from 'puppeteer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const axeCorePath = path.resolve(__dirname, '..', 'node_modules/axe-core/axe.min.js');
const axeScript = fs.readFileSync(axeCorePath, 'utf-8');

// Function to run axe on a single page
async function getAxeResults(page, url) {
  await page.evaluate(axeScript);
  const results = await page.evaluate(() => axe.run());
  results.url = url; // Add the URL to the results for context
  return results;
}

/**
 * Analyzes a given URL and up to 9 other internal links.
 * @param {string} url - The URL to analyze.
 * @returns {Promise<Array<object>>} An array of axe results.
 */
export async function analyzeUrl(url) {
  const CRAWL_LIMIT = 10; // Set the total page limit
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const allResults = [];
  const scannedUrls = new Set();

  try {
    // 1. Analyze the initial URL
    console.log(`Scanning initial page: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });
    const mainPageResults = await getAxeResults(page, url);
    allResults.push(mainPageResults);
    scannedUrls.add(url);

    // 2. Find internal links
    const pageOrigin = new URL(url).origin;
    const internalLinks = await page.$$eval('a', (links, origin) =>
      links
        .map(link => link.href)
        .filter(href => href.startsWith(origin))
        .filter((href, index, self) => self.indexOf(href) === index)
    , pageOrigin);

    // 3. Scan internal links up to the limit
    for (const link of internalLinks) {
      if (allResults.length >= CRAWL_LIMIT) {
        console.log('Crawl limit reached.');
        break; // Stop if we've hit the limit
      }
      if (!scannedUrls.has(link)) {
        console.log(`Crawling to: ${link}`);
        await page.goto(link, { waitUntil: 'networkidle2' });
        const linkResults = await getAxeResults(page, link);
        allResults.push(linkResults);
        scannedUrls.add(link);
      }
    }
  } finally {
    await browser.close();
  }
  return allResults;
}

// The analyzeFile function remains the same
export async function analyzeFile(fileBuffer) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  try {
    await page.setContent(fileBuffer.toString('utf-8'), { waitUntil: 'networkidle0' });
    const results = await getAxeResults(page, 'Uploaded File');
    return [results];
  } finally {
    await browser.close();
  }
}