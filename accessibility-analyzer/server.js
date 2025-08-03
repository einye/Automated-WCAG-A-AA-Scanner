// server.js
import express from 'express';
import cors from 'cors';
import analyzeRoute from './routes/analyzeRoute.js';

// ---- Server Setup ----
const app = express();
const PORT = process.env.PORT || 5001;

// ---- Middleware ----
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON body data

// ---- Routes ----
app.get('/', (req, res) => {
  res.send('Accessibility Analyzer API is running...');
});

app.use('/api/analyze', analyzeRoute); // Our main analysis route

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});