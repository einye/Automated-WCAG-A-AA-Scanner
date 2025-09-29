// server/services/axeScanner.js
const puppeteer = require('puppeteer');
const axe = require('axe-core');
const { classifyResults } = require('./scoringEngine');
const urlModule = require('url'); // For parsing URLs

async function runAxe(page) {
  await page.addScriptTag({ path: require.resolve('axe-core') });
  return await page.evaluate(async () => await axe.run());
}

// Helper to extract internal links from a page
async function extractInternalLinks(page, baseUrl) {
  const baseOrigin = new urlModule.URL(baseUrl).origin;
  return await page.evaluate((baseOrigin) => {
    const links = Array.from(document.querySelectorAll('a[href]'));
    return links
      .map(a => a.href)
      .filter(href => {
        if (!href.startsWith('http')) return false; // Absolute HTTP/HTTPS only
        const linkUrl = new URL(href);
        return linkUrl.origin === baseOrigin && !linkUrl.hash; // Same origin, no fragments
      })
      .slice(0, 9); // Limit to 9 for total 10 pages
  }, baseOrigin);
}

exports.scanPage = async (url) => {
  // Now returns an array of results (multi-page)
  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  try {
    // Scan initial page
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    const axeResults = await runAxe(page);
    const scoring = classifyResults(axeResults);
    results.push({
      url,
      scannedAt: new Date().toISOString(),
      results: axeResults,
      ...scoring
    });

    // Extract and scan internal links (depth 1)
    const internalLinks = await extractInternalLinks(page, url);
    for (const link of internalLinks) {
      const subPage = await browser.newPage();
      try {
        await subPage.goto(link, { waitUntil: 'networkidle2', timeout: 30000 });
        const subAxeResults = await runAxe(subPage);
        const subScoring = classifyResults(subAxeResults);
        results.push({
          url: link,
          scannedAt: new Date().toISOString(),
          results: subAxeResults,
          ...subScoring
        });
      } catch (subErr) {
        console.error(`Failed to scan ${link}:`, subErr.message);
      } finally {
        await subPage.close();
      }
      if (results.length >= 10) break; // Enforce total limit
    }
  } finally {
    await browser.close();
  }

  return results;
};

/*exports.scanPage = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const axeResults = await runAxe(page);
    const scoring = classifyResults(axeResults); // includes incomplete now

    return {
      url,
      scannedAt: new Date().toISOString(),
      results: axeResults, // raw results (optional to keep)
      ...scoring
    };
  } finally {
    await browser.close();
  }
};*/

exports.scanHTML = async (html) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: 'load' });

    const axeResults = await runAxe(page);
    const scoring = classifyResults(axeResults);

    return {
      fromHTML: true,
      scannedAt: new Date().toISOString(),
      results: axeResults,
      ...scoring
    };
  } finally {
    await browser.close();
  }
};
