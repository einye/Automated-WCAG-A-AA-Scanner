// server/app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const scanRoutes = require('./routes/scanRoutes');
const { initDB } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File uploads
const upload = multer({ dest: path.join(__dirname, '../uploads/') });
app.use('/reports', express.static(path.join(__dirname, '../public/reports')));
app.use('/api', upload.single('htmlFile'), scanRoutes);

// Start DB
initDB();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
