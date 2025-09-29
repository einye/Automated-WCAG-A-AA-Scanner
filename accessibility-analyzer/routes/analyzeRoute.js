import express from 'express';
import multer from 'multer';
import { analyzeUrl, analyzeFile } from '../services/analysisService.js';
import { generateReport } from '../services/reportService.js';
import { v4 as uuidv4 } from 'uuid';


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('htmlfile'), async (req, res) => {
  try {
    let rawAxeResults;

    if (req.file) {
      console.log('Received file for analysis...');
      rawAxeResults = await analyzeFile(req.file.buffer);
    } else if (req.body.url) {
      console.log(`Received URL for analysis: ${req.body.url}`);
      rawAxeResults = await analyzeUrl(req.body.url);
    } else {
      return res.status(400).json({ error: 'Request must contain either a URL or an HTML file.' });
    }

    // Generate the report as a PDF buffer
    const pdfBuffer = await generateReport(rawAxeResults);

    // Set headers to trigger a file download
    const fileName = `accessibility-report-${uuidv4()}.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/pdf');

    // Send the PDF buffer as the response
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ error: 'An error occurred during the analysis.', details: error.message });
  }
});

export default router;