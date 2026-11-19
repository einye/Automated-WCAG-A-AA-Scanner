// server/services/aiRemediationService.js

// Switch models - PRIMARY_MODEL / BACKUP_MODEL 
// openrouter/auto - picks the best available free model automatically.

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Primary free model — best overall reasoning & 1M context window
const PRIMARY_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

// Backup free model — auto-routes to any currently available free model
const BACKUP_MODEL = 'openrouter/free';

 //Build the prompt

function buildPrompt(ruleId, htmlSnippet, failureSummary) {
  return `You are an expert web accessibility engineer specialising in WCAG 2.1 compliance.

A page has a failing axe-core accessibility check. Your job is to produce a corrected version of the HTML snippet that fixes the issue, and briefly explain what you changed and why.

---
Rule ID: ${ruleId}
Failure summary: ${failureSummary}
Offending HTML:
\`\`\`html
${htmlSnippet}
\`\`\`
---

Respond ONLY with valid JSON in exactly this structure (no markdown fences, no extra text):
{
  "fixedHtml": "<the corrected HTML snippet here>",
  "explanation": "One or two sentences explaining what was changed and why it fixes the accessibility issue."
}`;
}

/**
 * Call OpenRouter with a given model and returns parsed { fixedHtml, explanation }.
 * Throws on non-2xx responses or JSON parse failures.
 */
async function callOpenRouter(model, prompt) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://accessibility-checker-rcc',   // Recommended by OpenRouter
      'X-OpenRouterTitle': 'Accessibility Checker RCC',                // Shown in OpenRouter dashboard
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,   // Low temperature for deterministic, accurate fixes
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter responded with ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const rawContent = data?.choices?.[0]?.message?.content;
  if (!rawContent) throw new Error('Empty response from model');

  // Strip accidental markdown fences before parsing
  const cleaned = rawContent
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}

/**
 * Main export — tries the primary model, falls back to the backup on failure.
 * Returns { fixedHtml, explanation, modelUsed }.
 */
async function getAIFix(ruleId, htmlSnippet, failureSummary) {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    throw new Error(
      'OPENROUTER_API_KEY is not set or is invalid. ' +
      'Set a valid API key in server/.env. ' +
      'Get a free key at https://openrouter.ai'
    );
  }

  const prompt = buildPrompt(ruleId, htmlSnippet, failureSummary);

  // Attempt primary model
  try {
    console.log(`[AI Fix] Trying primary model: ${PRIMARY_MODEL}`);
    const result = await callOpenRouter(PRIMARY_MODEL, prompt);
    return { ...result, modelUsed: PRIMARY_MODEL };
  } catch (primaryErr) {
    console.warn(`[AI Fix] Primary model failed (${primaryErr.message}). Falling back to ${BACKUP_MODEL}...`);
  }

  // Fallback to backup model
  try {
    const result = await callOpenRouter(BACKUP_MODEL, prompt);
    return { ...result, modelUsed: BACKUP_MODEL };
  } catch (backupErr) {
    throw new Error(`Both models failed. Backup error: ${backupErr.message}`);
  }
}

module.exports = { getAIFix };
