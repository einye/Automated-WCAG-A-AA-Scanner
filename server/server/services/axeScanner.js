// server/services/axeScanner.js
const puppeteer = require('puppeteer');
const axe = require('axe-core');
const { classifyResults } = require('./scoringEngine');
const urlModule = require('url');

async function runAxe(page) {
  await page.addScriptTag({ path: require.resolve('axe-core') });
  return await page.evaluate(async () => await axe.run());
}

// Helper to normalize URLs for comparison
function normalizeUrl(url) {
  try {
    const parsed = new urlModule.URL(url);
    // Remove fragment and common tracking query params (e.g., utm_, ref)
    parsed.hash = '';
    const params = parsed.searchParams;
    for (const key of params.keys()) {
      if (key.startsWith('utm_') || key === 'ref') {
        params.delete(key);
      }
    }
    // Remove trailing slash for consistency
    parsed.pathname = parsed.pathname.replace(/\/$/, '');
    return parsed.toString();
  } catch (e) {
    console.error(`Invalid URL: ${url}`, e);
    return url; // Fallback to original
  }
}

// Helper to extract internal links from a page
async function extractInternalLinks(page, baseUrl, maxLinks) {
  const baseOrigin = new urlModule.URL(baseUrl).origin;
  const links = await page.evaluate((baseOrigin) => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    return anchors
      .map(a => a.href)
      .filter(href => {
        if (!href.startsWith('http')) return false; // Absolute HTTP/HTTPS only
        try {
          const linkUrl = new URL(href);
          return linkUrl.origin === baseOrigin && !linkUrl.hash; // Same origin, no fragments
        } catch {
          return false; // Invalid URLs
        }
      });
  }, baseOrigin);

  // Normalize and deduplicate links
  const seen = new Set();
  const uniqueLinks = [];
  for (const link of links) {
    const normalized = normalizeUrl(link);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      uniqueLinks.push(link); // Keep original URL for scanning
    }
    if (maxLinks && uniqueLinks.length >= maxLinks) break; // Limit internal links
  }
  return uniqueLinks;
}

exports.scanPage = async (url, maxPages = 20) => {
  const browser = await puppeteer.launch({ headless: true });
  const results = [];
  const visited = new Set([normalizeUrl(url)]); // Track visited URLs, start with initial

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
    const internalLinks = await extractInternalLinks(page, url, maxPages);
    for (const link of internalLinks) {
      const normalizedLink = normalizeUrl(link);
      if (visited.has(normalizedLink)) continue; // Skip duplicates
      visited.add(normalizedLink);

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
      if (results.length >= maxPages) break; // Enforce total limit
    }
  } finally {
    await browser.close();
  }

  return results;
};

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