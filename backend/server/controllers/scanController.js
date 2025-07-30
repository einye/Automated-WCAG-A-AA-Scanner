// server/controllers/scanController.js
const fs = require('fs');
const path = require('path');
const axeScanner = require('../services/axeScanner');
const { saveReport, getReport } = require('../db');
const { generatePDFReport } = require('../services/reportBuilder')

exports.scanURL = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  getReport(url, async (err, existingReport) => {
    if (err) return res.status(500).json({ error: 'DB read error' });
    if (existingReport) return res.json({ fromCache: true, ...existingReport });

    try {
      const result = await axeScanner.scanPage(url);
      saveReport(url, result);
      res.json({ fromCache: false, ...result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Scan failed', req: req.body });
    }
  });
};

exports.scanHTML = async (req, res) => {
  const filePath = req.file.path;

  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const result = await axeScanner.scanHTML(html);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'HTML Scan failed' });
  } finally {
    fs.unlink(filePath, () => {}); // Clean up uploaded file
  }
};

exports.downloadPDF = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  getReport(url, async (err, report) => {
    if (err || !report) return res.status(404).json({ error: 'No report found for that URL' });

    try {
      const pdfPath = await generatePDFReport({ url, ...report });
      res.download(pdfPath, 'accessibility-report.pdf');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });
};

