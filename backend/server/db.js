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
          url TEXT PRIMARY KEY,
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
    `INSERT OR REPLACE INTO reports (url, report, timestamp) VALUES (?, ?, ?)`,
    [url, report, timestamp],
    (err) => err && console.error('Insert Error:', err)
  );
}

function getReport(url, callback) {
  db.get(`SELECT report FROM reports WHERE url = ?`, [url], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row ? JSON.parse(row.report) : null);
    }
  });
}

module.exports = { initDB, saveReport, getReport };
