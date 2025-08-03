import { useState } from 'react';
import InputPanel from './components/InputPanel';
import ScoreSummary from './components/ScoreSummary';
import GroupDetailAccordion from './components/GroupDetailAccordion';
import ManualReviewSection from './components/ManualReviewSection';
import PdfDownload from './components/PdfDownload';

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runUrlScan = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Scan failed');
      const data = await res.json();
      setReport(data);
    } catch (e) {
      setError(e.message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const runHtmlUpload = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('htmlFile', file);
      const res = await fetch('http://localhost:3000/api/scan-html', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Scan failed');
      const data = await res.json();
      setReport(data);
    } catch (e) {
      setError(e.message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <h1>Accessibility Audit</h1>
      <InputPanel onUrlSubmit={runUrlScan} onFileSubmit={runHtmlUpload} />
      {loading && <p>Scanning... this can take a few seconds.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {report && (
        <>
          <ScoreSummary overall={report.overallScore} groupScores={report.scores} />
          {Object.entries(report.groups || {}).map(([group, data]) => (
            <GroupDetailAccordion key={group} group={group} data={data} />
          ))}
          <ManualReviewSection manualReview={report.manualReview || []} />
          <PdfDownload report={report} />
        </>
      )}
    </div>
  );
}

export default App;
