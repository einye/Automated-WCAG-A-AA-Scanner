// server/db.js
const sqlite3 = require('sqlite3').verbose();
let db;

function initDB() {
  db = new sqlite3.Database('./auditReports.db', (err) => {
    if (err) console.error('DB Error:', err);
    else {
      console.log('SQLite DB connected');
      db.run(`
        CREATE TABLE IF NOT EXISTS reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          url TEXT,
          report TEXT,
          timestamp TEXT
        )
      `);
    }
  });
}

function saveReport(url, reportJSON) {
  const timestamp = new Date().toISOString();
  const report = JSON.stringify(reportJSON);

  db.run(
    `INSERT INTO reports (url, report, timestamp) VALUES (?, ?, ?)`,
    [url, report, timestamp],
    (err) => {
      if (err) console.error('Insert Error:', err);
    }
  );
}

function getLatestReportByURL(url, callback) {
  db.get(
    `SELECT report FROM reports WHERE url = ? ORDER BY timestamp DESC LIMIT 1`,
    [url],
    (err, row) => {
      if (err) callback(err, null);
      else callback(null, row ? JSON.parse(row.report) : null);
    }
  );
}

module.exports = { initDB, saveReport, getLatestReportByURL };
