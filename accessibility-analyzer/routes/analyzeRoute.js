import express from 'express';
import multer from 'multer';
import { analyzeUrl, analyzeFile } from '../services/analysisService.js';
import { generateReport } from '../services/reportService.js';

const router = express.Router();

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the POST route. 'htmlfile' is the field name for the uploaded file.
router.post('/', upload.single('htmlfile'), async (req, res) => {
  try {
    let rawAxeResults;

    if (req.file) {
      // --- Handle File Upload ---
      console.log('Received file for analysis...');
      rawAxeResults = await analyzeFile(req.file.buffer);
    } else if (req.body.url) {
      // --- Handle URL ---
      console.log(`Received URL for analysis: ${req.body.url}`);
      rawAxeResults = await analyzeUrl(req.body.url);
    } else {
      // --- Handle Invalid Input ---
      return res.status(400).json({ error: 'Request must contain either a URL or an HTML file.' });
    }

    // Pass the raw results to the report service for processing
    const finalReport = await generateReport(rawAxeResults);

    res.status(200).json(finalReport);

  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ error: 'An error occurred during the analysis.', details: error.message });
  }
});

export default router;