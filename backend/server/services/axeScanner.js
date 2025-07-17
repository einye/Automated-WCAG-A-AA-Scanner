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
  await page.goto(url, { waitUntil: 'networkidle2' });

  const axeResults = await runAxe(page);
  await browser.close();

  const classification = classifyResults(axeResults.violations);

  return {
    url,
    results: axeResults,
    ...classification
  };
};

exports.scanHTML = async (html) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });

  const axeResults = await runAxe(page);
  await browser.close();

  const classification = classifyResults(axeResults.violations);

  return {
    fromHTML: true,
    results: axeResults,
    ...classification
  };
};
