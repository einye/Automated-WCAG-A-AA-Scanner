// components/ScoreSummary.jsx
export default function ScoreSummary({ overall, groupScores, isAverage = false }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 6, marginBottom: 20 }}>
      <h2>{isAverage ? 'Average Summary (Across Pages)' : 'Summary'}</h2>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <strong>Overall Score:</strong> {overall}%
        </div>
        <div>
          <strong>Visual:</strong> {groupScores.visual}%
        </div>
        <div>
          <strong>Motor:</strong> {groupScores.motor}%
        </div>
        <div>
          <strong>Cognitive:</strong> {groupScores.cognitive}%
        </div>
      </div>
    </div>
  );
}