export default function ScoreSummary({ overall, groupScores, isAverage = false }) {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-white shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {isAverage ? '📊 Average Summary (Across Pages)' : '📈 Summary'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border-2 ${getScoreColor(overall)}`}>
          <div className="text-sm font-medium mb-1">Overall Score</div>
          <div className="text-3xl font-bold">{overall}%</div>
        </div>
        <div className={`p-4 rounded-lg border-2 ${getScoreColor(groupScores.visual)}`}>
          <div className="text-sm font-medium mb-1">👁️ Visual</div>
          <div className="text-3xl font-bold">{groupScores.visual}%</div>
        </div>
        <div className={`p-4 rounded-lg border-2 ${getScoreColor(groupScores.motor)}`}>
          <div className="text-sm font-medium mb-1">🖱️ Motor</div>
          <div className="text-3xl font-bold">{groupScores.motor}%</div>
        </div>
        <div className={`p-4 rounded-lg border-2 ${getScoreColor(groupScores.cognitive)}`}>
          <div className="text-sm font-medium mb-1">🧠 Cognitive</div>
          <div className="text-3xl font-bold">{groupScores.cognitive}%</div>
        </div>
      </div>
    </div>
  );
}
