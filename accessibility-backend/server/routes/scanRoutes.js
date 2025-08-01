// server/routes/scanRoutes.js
const express = require('express');
const router = express.Router();
const { scanURL, scanHTML } = require('../controllers/scanController');
const { downloadPDF } = require('../controllers/scanController');

// POST /api/scan-url
router.post('/scan-url', scanURL);

// POST /api/scan-html
router.post('/scan-html', scanHTML);

router.get('/download-pdf', downloadPDF);

module.exports = router;
