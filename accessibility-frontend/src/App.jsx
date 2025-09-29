// App.jsx
import { useState } from 'react';
import InputPanel from './components/InputPanel';
import ScoreSummary from './components/ScoreSummary';
import GroupDetailAccordion from './components/GroupDetailAccordion';
import ManualReviewSection from './components/ManualReviewSection';
import PdfDownload from './components/PdfDownload';

function App() {
  const [reports, setReports] = useState(null); // Array of reports
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
      console.log('API Response:', JSON.stringify(data, null, 2)); // Detailed log
      setReports(Array.isArray(data) ? data : [data]);
    } catch (e) {
      console.error('Scan Error:', e);
      setError(e.message);
      setReports(null);
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
      console.log('HTML Scan Response:', JSON.stringify(data, null, 2));
      setReports([data]);
    } catch (e) {
      console.error('HTML Scan Error:', e);
      setError(e.message);
      setReports(null);
    } finally {
      setLoading(false);
    }
  };

  // Compute global averages
  const computeAverages = (reports) => {
    if (!reports || !Array.isArray(reports) || reports.length === 0) {
      return { overall: 0, groups: { visual: 0, motor: 0, cognitive: 0 } };
    }
    const totals = { overall: 0, visual: 0, motor: 0, cognitive: 0 };
    let validReports = 0;
    reports.forEach(r => {
      if (r && r.overallScore != null && r.scores && r.scores.visual != null) {
        totals.overall += r.overallScore || 0;
        totals.visual += r.scores.visual || 0;
        totals.motor += r.scores.motor || 0;
        totals.cognitive += r.scores.cognitive || 0;
        validReports++;
      }
    });
    const count = validReports || 1; // Avoid division by zero
    return {
      overall: Math.round(totals.overall / count),
      groups: {
        visual: Math.round(totals.visual / count),
        motor: Math.round(totals.motor / count),
        cognitive: Math.round(totals.cognitive / count),
      },
    };
  };

  const averages = computeAverages(reports);
  console.log('Computed Averages:', averages); // Debug: Log averages
  console.log('Reports State:', reports); // Debug: Log reports state

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <h1>Accessibility Audit</h1>
      <InputPanel onUrlSubmit={runUrlScan} onFileSubmit={runHtmlUpload} />
      {loading && <p>Scanning... this can take a few seconds.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {reports ? (
        reports.length === 0 ? (
          <p>No results found. Try scanning again.</p>
        ) : (
          <>
            <ScoreSummary overall={averages.overall} groupScores={averages.groups} isAverage={reports.length > 1} />
            {reports.map((report, idx) => {
              console.log(`Rendering report ${idx}:`, report); // Debug: Log each report
              return report && report.scores && report.groups ? (
                <div key={idx} style={{ marginBottom: 40, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
                  <h2>Page: {report.url || 'Uploaded HTML'}</h2>
                  <ScoreSummary
                    overall={report.overallScore}
                    groupScores={report.scores}
                    isAverage={false}
                  />
                  {Object.entries(report.groups || {}).map(([group, data]) => (
                    <GroupDetailAccordion key={`${idx}-${group}`} group={group} data={data} />
                  ))}
                  <ManualReviewSection manualReview={report.manualReview || []} />
                </div>
              ) : (
                <p key={idx}>Invalid report data for page {idx + 1}</p>
              );
            })}
            <PdfDownload report={reports[0]} />
          </>
        )
      ) : (
        <p>No reports loaded yet.</p>
      )}
    </div>
  );
}

export default App;