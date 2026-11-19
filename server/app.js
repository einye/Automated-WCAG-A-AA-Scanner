// server/app.js
const path = require('path');
const fs = require('fs');

// Load .env from server/.env using absolute path resolution
const envPath = path.resolve(__dirname, './.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log(`✓ Loaded .env from: ${envPath}`);
  if (process.env.OPENROUTER_API_KEY) {
    console.log('✓ OPENROUTER_API_KEY is configured');
  } else {
    console.warn('⚠ OPENROUTER_API_KEY is not set in .env file');
  }
} else {
  console.warn(`⚠ .env file not found at: ${envPath}`);
  console.warn('   Create server/.env with OPENROUTER_API_KEY=your_key');
}

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const scanRoutes = require('./routes/scanRoutes');
const { initDB } = require('./db');

const app = express();
const PORT = 3000;

// Set timeout for all requests to 5 minutes (300s) for heavy PDF operations
app.use((req, res, next) => {
  req.setTimeout(300000);
  res.setTimeout(300000);
  next();
});

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// File uploads
const upload = multer({ dest: path.join(__dirname, '../uploads/') });
app.use('/reports', express.static(path.join(__dirname, '../public/reports')));
app.use('/api', upload.single('htmlFile'), scanRoutes);

// Start DB
initDB();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
