// server/routes/scanRoutes.js
const express = require('express');
const router = express.Router();
const { scanURL, scanHTML, downloadPDF, storeExtensionResults, getExtensionResults } = require('../controllers/scanController');
const { suggestFix } = require('../controllers/aiController');

// POST /api/scan-url
router.post('/scan-url', scanURL);

// POST /api/scan-html
router.post('/scan-html', scanHTML);

router.get('/download-pdf', downloadPDF);

// POST /api/extension-scan
router.post('/extension-scan', storeExtensionResults);

// GET /api/extension-results
router.get('/extension-results', getExtensionResults);

// POST /api/ai-fix — AI remediation via OpenRouter
router.post('/ai-fix', suggestFix);

module.exports = router;
