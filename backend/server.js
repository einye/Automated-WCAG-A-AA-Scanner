// server.js
const express = require('express');
const cors = require('cors');
const { runAxeAudit } = require('./audit');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/audit', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const results = await runAxeAudit(url);
    res.json({ violations: results.violations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to audit URL' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 WCAG audit server running at http://localhost:${PORT}`);
});
