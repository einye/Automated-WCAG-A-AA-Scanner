// server/controllers/aiController.js
const { getAIFix } = require('../services/aiRemediationService');

exports.suggestFix = async (req, res) => {
  const { ruleId, htmlSnippet, failureSummary } = req.body;

  if (!ruleId || !htmlSnippet || !failureSummary) {
    return res.status(400).json({
      error: 'Missing required fields: ruleId, htmlSnippet, failureSummary',
    });
  }

  try {
    const { fixedHtml, explanation, modelUsed } = await getAIFix(
      ruleId,
      htmlSnippet,
      failureSummary
    );

    return res.json({ fixedHtml, explanation, modelUsed });
  } catch (err) {
    console.error('[AI Fix] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
