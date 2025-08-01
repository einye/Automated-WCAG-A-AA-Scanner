const ruleMap = require('../utils/ruleMap');

function classifyResults(axeResults) {
  const violations = axeResults.violations || [];
  const passes = axeResults.passes || [];
  const incomplete = axeResults.incomplete || [];

  // Init group scores (excluding 'deaf')
  const groups = {
    visual: createGroupObject(),
    motor: createGroupObject(),
    cognitive: createGroupObject(),
  };

  // 1. Tally rule weights
  for (const [ruleId, data] of Object.entries(ruleMap)) {
    const { groups: targetGroups, weight } = data;
    for (const group of targetGroups) {
      groups[group].total += weight;
    }
  }

  // 2. Handle violations
  for (const v of violations) {
    const rule = v.id;
    if (!ruleMap[rule]) continue;
    const { groups: affectedGroups, weight } = ruleMap[rule];

    for (const group of affectedGroups) {
      groups[group].failed += weight;
      groups[group].failedChecks.push({
        rule,
        description: v.description,
        impact: v.impact || 'unknown',
        html: v.nodes.map(n => n.html),
      });
    }
  }

  // 3. Handle passes
  for (const p of passes) {
    const rule = p.id;
    if (!ruleMap[rule]) continue;
    const { groups: affectedGroups, weight } = ruleMap[rule];

    for (const group of affectedGroups) {
      groups[group].passed += weight;
      groups[group].passedChecks.push({
        rule,
        description: p.description,
        html: p.nodes.map(n => n.html),
      });
    }
  }

  // 4. Calculate scores
  const scores = {};
  let totalScore = 0;
  let groupCount = 0;

  for (const [group, data] of Object.entries(groups)) {
    const passed = data.total - data.failed;
    const percent = data.total > 0 ? Math.round((passed / data.total) * 100) : 100;
    scores[group] = percent;
    totalScore += percent;
    groupCount++;
  }

  const overallScore = groupCount > 0 ? Math.round(totalScore / groupCount) : 100;

  // 5. Process manual review items (incomplete)
  const manualReview = incomplete.map(r => ({
    rule: r.id,
    description: r.description,
    html: r.nodes.map(n => n.html),
  }));

  const expectedGroups = ['visual', 'motor', 'cognitive'];
    for (const group of expectedGroups) {
        if (!groups[group]) {
            groups[group] = createGroupObject();
        }
    }

  return {
    scores,
    overallScore,
    groups,
    manualReview
  };
}

// Helper factory for score tracking per group
function createGroupObject() {
  return {
    total: 0,
    passed: 0,
    failed: 0,
    failedChecks: [],
    passedChecks: [],
  };
}

module.exports = { classifyResults };
