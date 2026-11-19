// server/controllers/scanController.js
const fs = require('fs');
const path = require('path');
const axeScanner = require('../services/axeScanner');
const { saveReport, getLatestReportByURL } = require('../db');
const { generatePDFReport } = require('../services/reportBuilder');

exports.scanURL = async (req, res) => {
  const { url, maxPages } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  // Validate maxPages: integer between 1 and 50, default 5
  const pageLimit = Math.max(1, Math.min(50, parseInt(maxPages, 10) || 5));

  try {
    const result = await axeScanner.scanPage(url, pageLimit); //Now an array
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
    fs.unlink(filePath, () => { });
  }
};


exports.downloadPDF = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  
  // Set longer timeout for PDF download
  res.setTimeout(300000); // 5 minutes
  
  try {
    const results = await axeScanner.scanPage(url);
    const pdfPath = await generatePDFReport({ urls: results.map(r => r.url), reports: results, scannedAt: new Date().toISOString() });
    res.download(pdfPath, 'accessibility-report.pdf');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

let latestExtensionScan = null;

exports.storeExtensionResults = async (req, res) => {
  try {
    latestExtensionScan = req.body;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to store extension scan results' });
  }
};

exports.getExtensionResults = async (req, res) => {
  try {
    if (!latestExtensionScan) {
      return res.status(404).json({ error: 'No extension scan results found' });
    }
    res.json(latestExtensionScan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve extension scan results' });
  }
};
