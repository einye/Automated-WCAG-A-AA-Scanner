// server/controllers/scanController.js
const fs = require('fs');
const path = require('path');
const axeScanner = require('../services/axeScanner');
const { saveReport, getLatestReportByURL } = require('../db');
const { generatePDFReport } = require('../services/reportBuilder');

exports.scanURL = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const result = await axeScanner.scanPage(url); //Now an array
    //saveReport(url, result);
    result.forEach(result => saveReport(result.url, result));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scan failed', message: err.message });
  }
};

exports.scanHTML = async (req, res) => {
  const filePath = req.file.path;

  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const result = await axeScanner.scanHTML(html);

    // Generate PDF
    const pdfPath = await generatePDFReport(result);

    // Return result with PDF link
    res.json({
      ...result,
      pdfDownload: `/reports/${path.basename(pdfPath)}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'HTML scan failed' });
  } finally {
    fs.unlink(filePath, () => {});
  }
};


exports.downloadPDF = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  /*getLatestReportByURL(url, async (err, report) => {
    if (err || !report) {
      return res.status(404).json({ error: 'No report found for that URL' });
    }

    try {
      const pdfPath = await generatePDFReport({ url, ...report });
      res.download(pdfPath, 'accessibility-report.pdf');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });*/
  try {
    const results = await axeScanner.scanPage(url);
    const pdfPath = await generatePDFReport({ urls: results.map(r => r.url), reports: results, scannedAt: new Date().toISOString() });
    res.download(pdfPath, 'accessibility-report.pdf');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
