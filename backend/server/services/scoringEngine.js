// server/services/scoringEngine.js
const ruleMap = require('../utils/ruleMap');

function classifyResults(violations) {
  const groups = {
    visual: { total: 0, failed: 0, failedChecks: [], manualTips: [] },
    motor: { total: 0, failed: 0, failedChecks: [], manualTips: [] },
    deaf: { total: 0, failed: 0, failedChecks: [], manualTips: [] }
  };

  // Tally auto-checks
  for (const [rule, data] of Object.entries(ruleMap)) {
    if (!data.manualOnly) {
      for (const group of data.groups) {
        groups[group].total += data.weight;
      }
    }
  }

  // Apply violations
  for (const v of violations) {
    const rule = v.id;
    if (!ruleMap[rule]) continue;
    const { groups: affectedGroups, weight } = ruleMap[rule];

    for (const group of affectedGroups) {
      groups[group].failed += weight;
      groups[group].failedChecks.push({
        rule,
        description: v.description,
        impact: v.impact,
        html: v.nodes.map(n => n.html)
      });
    }
  }

  // Add manual tips (static)
  for (const [manualRule, data] of Object.entries(ruleMap)) {
    if (data.manualOnly) {
      for (const group of data.groups) {
        groups[group].manualTips.push({
          rule: manualRule,
          tip: `Manual check required for: ${manualRule.replace('_manual_', '').replace(/_/g, ' ')}`
        });
      }
    }
  }

  // Compute scores
  const scores = {};
  let totalScore = 0;
  for (const [group, data] of Object.entries(groups)) {
    const passed = data.total - data.failed;
    const percent = data.total ? Math.max(0, Math.round((passed / data.total) * 100)) : 100;
    scores[group] = percent;
    totalScore += percent;
  }

  const overallScore = Math.round(totalScore / 3);

  return {
    scores,
    overallScore,
    groups
  };
}

module.exports = { classifyResults };
