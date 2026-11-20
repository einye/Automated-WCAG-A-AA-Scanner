## Accessibility Checker RCC

A full-stack web application for auditing websites against WCAG 2.1/2.2 without CLI tools or developer pipelines, built for non-technical stakeholders, small teams, educators, and developers alike.

Engine: axe-core v4.x · Version: 1.0.0

## The Problem

As digital services become essential for education, employment, and government, inaccessible websites exclude millions of users with disabilities. Existing tools like axe-core and pa11y are powerful but intimidating for non-developers. This project bridges that gap with a web-based UI that requires zero installation or technical expertise.

## Core Capabilities

| Capability | Description |
|---|---|
| URL Scanning | Enter any URL; the tool crawls internal links (depth 1) up to a configurable page limit and runs axe-core on each. |
| HTML Upload | Upload a `.html` file for local scanning. |
| Disability-Group Scoring | Violations are classified into Visual, Motor, and Cognitive groups with weighted severity scoring. |
| AI Code Remediation | Failed checks can be sent to an AI model (via OpenRouter) for automatic code-fix suggestions. |
| PDF Reports | Generate and download professional A4 PDF reports of the full audit. |
| Chrome Extension | Scan the currently-loaded authenticated page directly from the browser. |
| Persistent Storage | Scan results are stored in a local SQLite database for historical reference. |

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 7, Tailwind CSS 3, Lucide Icons |
| **Backend** | Node.js, Express 5, CommonJS modules |
| **Scanner** | Puppeteer 24 (headless Chromium), axe-core 4.10 |
| **PDF Generation** | Puppeteer (HTML template → `page.pdf()`) |
| **Database** | SQLite 3 (via `sqlite3` npm package) |
| **AI Remediation** | OpenRouter API (Nvidia Nemotron 3 Nano / Google Gemma 3 4B) |
| **Extension** | Chrome Manifest V3, `chrome.scripting`, `chrome.storage` |
| **Orchestration** | `concurrently` (parallel server + client) |

## Architecture

| Client Layer | Server Layer | Services / External |
| :--- | :--- | :--- |
| React SPA `──/api──▶` | Express API `:3000` `──▶` | `axeScanner` `──▶` Puppeteer + axe-core |
| Chrome Ext `──/api──▶` | Scan Controller `──▶` | `scoringEngine` |
| | AI Controller `──▶` | `reportBuilder` `──▶` Puppeteer PDF |
| | | `aiRemediation` `──▶` OpenRouter |
| | | SQLite DB |

- Monorepo - a single root package.json orchestrates both server/ and client/ via concurrently.

- API Proxy - Vite dev server proxies /api and /reports to localhost:3000.

- Headless browser reuse - Puppeteer runs axe-core audits and renders HTML-to-PDF reports.

- Stateless extension bridge - the Chrome extension captures DOM HTML, uploads it, stores results server-side in memory, and redirects to the frontend dashboard.

## How Scoring Works (Summary)

- The scoring engine (server/services/scoringEngine.js) transforms raw axe-core results into weighted scores across three disability groups, plus an overall compliance score.

- Total weights are tallied from the full rule map, every mapped rule contributes its weight to each of its target groups. This establishes a constant denominator.

- Violations deduct their rule weight from the affected group(s). Rules in multiple groups deduct from each group.

- Per-group score = round(((total − failed) / total) × 100).

- Overall score = average of the three group scores.

- Weights: 3 = High / critical barrier · 2 = Medium / significant · 1 = Low / minor.

### Score interpretation (used in UI and PDFs):

| Range | Rating | Color |
| :--- | :--- | :--- |
| **90–100%** | Excellent | 🟢 Green |
| **70–89%** | Needs Attention | 🟡 Yellow |
| **< 70%** | Poor | 🔴 Red |

Note: Only rules present in ruleMap.js are scored. Unmapped axe-core rules are silently ignored. When a rule is defined multiple times in the map, the last definition wins (JavaScript object key semantics).

## API Reference

All endpoints are prefixed with /api. Backend runs on port 3000.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/scan-url` | Scan a live URL + crawl internal links |
| `POST` | `/api/scan-html` | Scan an uploaded HTML file |
| `GET` | `/api/download-pdf?url=` | Re-scan URL and generate downloadable PDF |
| `POST` | `/api/extension-scan` | Store extension scan results in memory |
| `GET` | `/api/extension-results` | Retrieve stored extension scan results |
| `POST` | `/api/ai-fix` | Request AI-generated code fix for a violation |

### Endpoint details
- POST /api/scan-url — body: { "url": "https://example.com", "maxPages": 5 } (maxPages clamped 1–50, default 5). Returns an array of page reports including overallScore, scores, groups, manualReview, and raw axe results.

- POST /api/ai-fix — body: { "ruleId", "htmlSnippet", "failureSummary" }. Returns { fixedHtml, explanation, modelUsed }. Tries the primary model, falls back to the backup on failure.

## Getting Started

### Prerequisites

Node.js ≥ 18

npm ≥ 9

A Chromium-compatible browser (Puppeteer downloads one automatically)

### Installation
```bash
git clone https://github.com/einye/Automated-WCAG-A-AA-Scanner
cd accessibility-checker-rcc
npm install --prefix client && npm install --prefix server
cd server
npm start
```
**This launches:**

Server on http://localhost:3000 (Express API + static reports)

Client on http://localhost:5173 (Vite dev server with API proxy)

Open http://localhost:5173 in your browser.

#### Optional: AI Remediation
```bash
cp server/.env.example server/.env
# Add your OpenRouter API key (free at https://openrouter.ai)
```

#### Optional: Chrome Extension

- Open chrome://extensions/

- Enable Developer mode

- Click Load unpacked and select the extension/ directory

- Navigate to any page and click the extension icon to scan

- The extension scans pages you're already authenticated to, the server never sees credentials, only the rendered HTML.

### Key Configuration

| Setting | Default | Location |
| :--- | :--- | :--- |
| Server port | `3000` | `app.js` |
| Client dev port | `5173` | Vite default |
| Max pages (API) | `5` (clamped `1–50`) | `scanController.js` |
| Page timeout (initial) | `60s` | `axeScanner.js` |
| Page timeout (sub-pages) | `30s` | `axeScanner.js` |
| Request timeout | `5 min` | `app.js` |
| PDF generation timeout | `2 min` | `reportBuilder.js` |
| DB file path | `./auditReports.db` | `db.js` |
| AI primary model | `nvidia/nemotron-3-nano-30b-a3b:free` | `aiRemediationService.js` |
| AI backup model | `google/gemma-3-4b-it:free` | `aiRemediationService.js` |

#### Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `OPENROUTER_API_KEY` | For AI fixes | OpenRouter API key |