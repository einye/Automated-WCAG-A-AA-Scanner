// server/services/axeScanner.js
const puppeteer = require('puppeteer');
const axe = require('axe-core');
const { classifyResults } = require('./scoringEngine');

async function runAxe(page) {
  await page.addScriptTag({ path: require.resolve('axe-core') });
  return await page.evaluate(async () => await axe.run());
}

exports.scanPage = async (url) => {
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
