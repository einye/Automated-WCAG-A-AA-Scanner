<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

  - [**Automated Accessibility Checker (RCC)**](#automated-accessibility-checker-rcc)
- [Features](#features)
- [Problem Background & Project Rationale](#problem-background--project-rationale)
- [Project Objectives](#project-objectives)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
    - [Available Scripts (Root)](#available-scripts-root)
- [How It Works](#how-it-works)
  - [Scanning Pipeline](#scanning-pipeline)
  - [Scoring Engine](#scoring-engine)
    - [Score Interpretation](#score-interpretation)
  - [Rule Map](#rule-map)
    - [Weight Scale](#weight-scale)
    - [Complete Rule Table](#complete-rule-table)
      - [Visual Impairment Rules](#visual-impairment-rules)
      - [Motor Impairment Rules](#motor-impairment-rules)
      - [Cognitive Impairment Rules](#cognitive-impairment-rules)
  - [PDF Report Generation](#pdf-report-generation)
- [API Reference](#api-reference)
  - [\`POST /api/scan-url\`](#post-apiscan-url)
  - [\`POST /api/scan-html\`](#post-apiscan-html)
  - [\`GET /api/download-pdf?url=\<encoded-url\>\`](#get-apidownload-pdfurlencoded-url)
    - [Query Parameters](#query-parameters)
- [Frontend Components](#frontend-components)
  - [\`App.jsx\` --- Main Application](#appjsx-----main-application)
  - [\`ScoreSummary.jsx\` --- Score Cards](#scoresummaryjsx-----score-cards)
  - [\`GroupDetailAccordion.jsx\` --- Group Details](#groupdetailaccordionjsx-----group-details)
  - [\`ManualReviewSection.jsx\` --- Manual Review](#manualreviewsectionjsx-----manual-review)
  - [\`PdfDownload.jsx\` --- PDF Download Button](#pdfdownloadjsx-----pdf-download-button)
- [Database](#database)
  - [Schema](#schema)
    - [Operations](#operations)
- [Configuration](#configuration)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---
**Automated Accessibility Checker (RCC)**
---
# Features

**URL Scanning** - Enter any URL and the tool crawls the page plus
internal links (depth 1) up to a user-selected maximum number of pages
(default: 10), configurable via advanced settings on the landing page.
Runs axe-core on each.

**HTML File Upload -** Upload a \`.html\` file directly for local
scanning.

**Disability-Group Scoring -** Violations are classified into Visual,
Motor, and Cognitive groups with weighted severity scoring.

**Overall Accessibility Score -** An aggregate percentage score across
all disability groups.

**Multi-Page Averages -** When multiple pages are scanned, averaged
scores are computed across all pages.

**Sorted Page Results** - Multi-page scan results are displayed in
descending order by overall accessibility score.

**Detailed Violation Reports** - Each failed check includes the rule ID,
description, impact severity, offending HTML snippets, and a \"Learn
more\" link to Deque University.

**Manual Review Guidance** - Items that axe-core couldn\'t determine
automatically are flagged for human review.

**PDF Report Download** - Generate and download a formatted PDF report
of the full audit.

**Persistent Storage** - Scan results are stored in a local SQLite
database for historical reference.

# Problem Background & Project Rationale

As digital services become essential for education, employment, and
government in Kenya, inaccessible websites exclude millions of citizens
with disabilities. WCAG 2.2 provides the global standard, yet most small
websites and student projects remain non-compliant due to lack of
simple, free tools.

Existing CLI tools (axe-core, pa11y) are powerful but intimidating for
non-developers. This project directly addresses that gap by delivering a
web app that requires zero installation or technical expertise---perfect
for our users.

# Project Objectives 

-   Enable non-technical users to audit websites.

-   Group results by real-world disability categories (visual, motor,
    cognitive, auditory, etc.).

-   Provide clear percentage scores, WCAG/Section 508 references,
    remediation support, and failed html elements.

-   Generate professional PDF reports suitable for evaluation, reporting
    or client delivery.

-   Support use-cases: HTML uploads, URL scans for live projects, and
    limited crawls for small portfolios.

# Tech Stack
  ---------------- ------------------------------------------------------
  Frontend -          React 19, Vite 7, Tailwind CSS 3, Lucide Icons

  Backend    -      Node.js, Express 5

  Scanner    -      Puppeteer (headless Chrome), axe-core

  PDF        -      Puppeteer (HTML-to-PDF rendering)

  Database   -      SQLite 3 (via sqlite3 npm package)

  -----------------------------------------------------------------------

# Getting Started

## Prerequisites

Node.js ≥ 18

Npm ≥ 9

A Chromium-compatible browser (Puppeteer downloads one automatically)

## Installation

Clone the repository

> git clone \<repository-url\>
>
> cd accessibility-checker-rcc

Install all dependencies (root, server, and client)

> npm run install:all

## Running the Application

**Start both client and server concurrently**

> npm start

This runs:

Server on \`http://localhost:3000\` (Express API + static reports)

Client on \`http://localhost:5173\` (Vite dev server with proxy to
backend)

Open your browser at http://localhost:5173 to use the app.

**Alternative: Run Separately**

Terminal 1 --- Start the server

> npm run server

Terminal 2 --- Start the client

> npm run client

### Available Scripts (Root)

| Script          | Command                              | Description                |
|-----------------|--------------------------------------|----------------------------|
| npm start       | concurrently "npm run server" "npm run client" | Run both server and client |
| npm run server  | npm start --prefix server            | Start Express server only  |
| npm run client  | npm run dev --prefix client          | Start Vite dev server only |
| npm run install:all | Install root + server + client deps | One-command full install   |
| npm run dev     | Alias for npm start                  | Convenience alias          |
  -----------------------------------------------------------------------


# How It Works

## Scanning Pipeline

When a user submits a URL or uploads an HTML file, the following
pipeline executes:

**URL Scanning Details**

1\. Launch Puppeteer - Opens a headless Chromium instance.

2\. Navigate to the target URL - Waits for network idle
(\`networkidle2\`).

3\. Inject axe-core - Adds the axe-core script tag into the page.

4\. Run \`axe.run()\` - Executes the full accessibility audit
in-browser.

5\. Extract internal links - Finds all \`\<a href\>\` elements on the
same origin, deduplicates them (URL normalization strips fragments,
tracking params like \`utm\_\*\`, and trailing slashes).

6\. Crawl linked pages - Scans additional internal pages up to the
user-selected maximum (default: 10 total pages), configurable via
advanced settings on the landing page.

7\. Score each page - Passes raw axe results through the Scoring Engine.

8\. Return results - Array of per-page reports with scores and violation
details.

9\. Sort results - Orders the array of page reports in descending order
by overall accessibility score.

**HTML Upload Scanning**

1\. Read uploaded file - The HTML file content is loaded from the
temporary upload.

2\. Set as page content - Puppeteer renders the HTML in a headless
browser.

3\. Run axe-core - Same audit process as URL scanning.

4\. Score & return - Single report with scores. A PDF is also generated
automatically.

## Scoring Engine

File: \`server/server/services/scoringEngine.js\`

The Scoring Engine takes raw axe-core results and produces weighted
accessibility scores for three disability groups: Visual, Motor, and
Cognitive.

**Step-by-step:**

1\. Initialize groups - Each group (\`visual\`, \`motor\`,
\`cognitive\`) starts with \`{ total: 0, passed: 0, failed: 0,
failedChecks: \[\], passedChecks: \[\] }\`.

2\. Tally total weights - Iterates over every rule in the \`ruleMap\`
and sums the weight for each group that rule belongs to. This
establishes the \*\*maximum possible score\*\* per group.

3\. Process violations - For each axe-core violation, looks up the rule
in \`ruleMap\`. If found, adds the rule\'s weight to the group\'s
\`failed\` counter and records the check details (rule ID, description,
help URL, impact severity, offending HTML).

4\. Process passes - Same as violations but adds to the \`passed\`
counter.

5\. Calculate percentage scores - For each group:

>    passed_weight = total_weight - failed_weight
>
>    score = round((passed_weight / total_weight) \* 100)
>
>    If a group has no rules (\`total = 0\`), it scores 100%.

6\. Overall score - The simple average of the three group percentages:

   overallScore = round((visual_score + motor_score + cognitive_score) /
3)

7\. Manual review - Items from axe-core\'s \`incomplete\` array (checks
that couldn\'t be determined automatically) are collected separately.

### Score Interpretation

| Score    | Meaning                              |
|----------|--------------------------------------|
| 90–100%  | Excellent — minimal issues           |
| 70–89%   | Needs attention — some violations    |
| < 70%    | Poor — significant accessibility gaps|

These thresholds are used in the UI to color-code score cards (green /
yellow / red).

## Rule Map

File: \`server/server/utils/ruleMap.js\`

The Rule Map is a dictionary that maps axe-core rule IDs to disability
groups and assigns a severity weight (1--3). Only rules present in this
map are included in scoring - any axe-core rules not listed here are
ignored by the scoring engine.

### Weight Scale

| Weight | Severity | Description                                   |
|--------|----------|-----------------------------------------------|
| 3      | High     | Critical barrier — blocks entire user groups  |
| 2      | Medium   | Significant issue — degrades usability        |
| 1      | Low      | Minor issue — inconvenient but not blocking   |

### Complete Rule Table

#### Visual Impairment Rules

| Rule ID               | Weight | Description                                      |
|-----------------------|--------|--------------------------------------------------|
| color-contrast        | 3      | Text must have sufficient color contrast ratio   |
| image-alt             | 3      | Images must have alternative text                |
| label                 | 3      | Form inputs must have labels                     |
| object-alt            | 2      | <object> elements must have alt text             |
| input-image-alt       | 2      | Image inputs must have alt text                  |
| document-title        | 2      | Pages must have a <title>                        |
| html-has-lang         | 2      | <html> must have a lang attribute                |
| heading-order         | 2      | Heading levels should increase by one            |
| aria-allowed-attr     | 1      | ARIA attributes must be valid for the element role |
| aria-valid-attr-value | 1      | ARIA attribute values must be valid              |
| aria-valid-attr       | 1      | ARIA attributes must be valid                    |

#### Motor Impairment Rules

| Rule ID                    | Weight | Description                                      |
|----------------------------|--------|--------------------------------------------------|
| focus-visible              | 3      | Focus indicator must be visible for keyboard users |
| tabindex                   | 2      | Tab order should be logical                      |
| landmark-one-main          | 2      | Page must have one <main> landmark               |
| button-name                | 2      | Buttons must have accessible names               |
| link-name                  | 2      | Links must have discernible text                 |
| bypass                     | 1      | Page must have a way to skip repetitive content  |
| region                     | 1      | Content should be in landmark regions            |
| form-field-multiple-labels | 1      | Form fields should not have multiple labels      |

#### Cognitive Impairment Rules

| Rule ID                  | Weight | Description                                      |
|--------------------------|--------|--------------------------------------------------|
| duplicate-id             | 2      | Element IDs must be unique                       |
| page-has-heading-one     | 2      | Page must have a level-one heading               |
| landmark-unique          | 2      | Landmarks must have unique roles or labels       |
| autocomplete-valid       | 2      | Autocomplete attributes must be valid            |
| aria-roles               | 1      | ARIA roles must be valid                         |
| html-lang-valid          | 1      | lang attribute must have a valid value           |
| aria-required-children   | 1      | ARIA parent roles must have required children    |
| aria-required-parent     | 1      | ARIA child roles must have required parents      |

**Scoring Example**

Suppose the \`ruleMap\` has a total visual weight of 22 (sum of all
visual rule weights). If \`color-contrast\` (weight 3) and \`image-alt\`
(weight 3) fail:

> failed_weight  = 3 + 3 = 6
>
> passed_weight  = 22 - 6 = 16
>
> visual_score   = round((16 / 22) \* 100) = 73%

## PDF Report Generation 

File: \`server/server/services/reportBuilder.js\`

The Report Builder generates formatted A4 PDF reports using Puppeteer:

> 1\. Builds an HTML template containing all scan results, scores, and
> violation details.
>
> 2\. Renders the HTML in a headless browser using
> \`page.setContent()\`.
>
> 3\. Exports to PDF via \`page.pdf()\` with A4 format and proper
> margins.
>
> 4\. Saves the PDF to \`server/public/reports/\` with a timestamped
> filename.

The PDF includes:

> \- Report title and scan date
>
> \- Per-page overall scores and group breakdowns
>
> \- Failed checks with rule names, impact levels, descriptions, help
> links, and HTML snippets
>
> \- Passed checks with the same detail
>
> \- Manual review recommendations

# API Reference

All endpoints are prefixed with \`/api\`. The backend runs on port 3000.

## \`POST /api/scan-url\`

Scan a live URL (and its internal links).

**Request Body**:

json

{

  \"url\": \"https://example.com\"

}

**Response:** Array of page reports

json

\[

  {

    \"url\": \"https://example.com\",

    \"scannedAt\": \"2026-02-21T12:00:00.000Z\",

    \"overallScore\": 85,

    \"scores\": {

      \"visual\": 90,

      \"motor\": 80,

      \"cognitive\": 85

    },

    \"groups\": {

      \"visual\": {

        \"total\": 22,

        \"passed\": 19,

        \"failed\": 3,

        \"failedChecks\": \[ \... \],

        \"passedChecks\": \[ \... \]

      },

      \"motor\": { \... },

      \"cognitive\": { \... }

    },

    \"manualReview\": \[ \... \],

    \"results\": { \... }

  }

\]

## \`POST /api/scan-html\`

Scan an uploaded HTML file.

**Request:** \`multipart/form-data\` with field name \`htmlFile\`

**Response:** Single report object (same structure as above, plus
\`pdfDownload\` path)

json

{

  \"fromHTML\": true,

  \"scannedAt\": \"2026-02-21T12:00:00.000Z\",

  \"overallScore\": 92,

  \"scores\": { \... },

  \"groups\": { \... },

  \"manualReview\": \[ \... \],

  \"pdfDownload\": \"/reports/report-1740142800000.pdf\"

}

## \`GET /api/download-pdf?url=\<encoded-url\>\` 

Re-scans the given URL and generates a downloadable PDF report.

### Query Parameters

| Param | Type   | Description              |
|-------|--------|--------------------------|
| url   | string | URL to scan and report on|

**Response:** PDF file download (\`accessibility-report.pdf\`)

# Frontend Components 

## \`App.jsx\` --- Main Application 

The root component manages global state (\`reports\`, \`loading\`,
\`error\`), orchestrates scan requests, computes multi-page score
averages, and sorts multi-page results in descending order by overall
score before rendering child components.

\`InputPanel.jsx\` --- Input Forms

Two side-by-side forms:

-   URL Input - Text field + \"Scan URL\" button

-   HTML Upload - File picker (\`.html\` only) + \"Scan HTML\" button

Also includes an informational banner with links to axe-core, WCAG
guidelines, and axe DevTools.

Advanced Settings - optional panel on the landing page allowing users to
customize scan options, currently includes: Selection of maximum pages
to scan for URL inputs (if more internal links are available).

## \`ScoreSummary.jsx\` --- Score Cards

Displays four color-coded score cards in a grid:

-   Overall Score, Visual, Motor, Cognitive

-   Color thresholds: ≥90% green, ≥70% yellow, \<70% red

-   When multiple pages are scanned, shows averaged scores.

## \`GroupDetailAccordion.jsx\` --- Group Details 

An expandable accordion for each disability group showing:

-   Failed Checks - Red cards with rule ID, impact badge, description,
    \"Learn more\" link, and offending HTML snippets

-   Passed Checks - Green cards with the same detail

## \`ManualReviewSection.jsx\` --- Manual Review 

An expandable amber-colored accordion listing:

-   Incomplete checks from axe-core that need human verification

-   If no incomplete items exist, shows general manual testing
    recommendations (keyboard traps, focus order, cognitive load).

## \`PdfDownload.jsx\` --- PDF Download Button

A green download button that:

-   For URL scans: triggers \`/api/download-pdf?url=\...\` to re-scan
    and download

-   For HTML uploads: links directly to the already-generated PDF file

# Database

File: \`server/server/db.js\`

SQLite database stored at \`server/auditReports.db\`.

## Schema

sql

CREATE TABLE IF NOT EXISTS reports (

  id        INTEGER PRIMARY KEY AUTOINCREMENT,

  url       TEXT,

  report    TEXT,      \-- JSON-stringified full report

  timestamp TEXT       \-- ISO 8601 timestamp

);

### Operations

| Function                      | Description                                             |
|-------------------------------|---------------------------------------------------------|
| initDB()                      | Opens/creates the database and ensures the reports table exists |
| saveReport(url, obj)          | Inserts a new report (JSON-stringified) with timestamp  |
| getLatestReportByURL(url, cb) | Retrieves the most recent report for a given URL        |

# Configuration

| Setting                  | Location                         | Default                                      |
|--------------------------|----------------------------------|----------------------------------------------|
| Server port              | server/server/app.js             | 3000                                         |
| Client dev port          | Vite default                     | 5173                                         |
| API proxy                | client/vite.config.js            | /api → localhost:3000                        |
| Upload directory         | server/server/app.js             | server/uploads/                              |
| Reports directory        | server/services/reportBuilder.js | server/public/reports/                       |
| Max pages crawled        | server/services/axeScanner.js    | 10 (user-configurable via advanced settings) |
| Page timeout (initial)   | axeScanner.js                    | 60000ms                                      |
| Page timeout (sub-pages) | axeScanner.js                    | 30000ms                                      |
| DB file path             | server/server/db.js              | ./auditReports.db                            |
