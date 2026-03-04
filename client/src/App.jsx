import { useState } from 'react';
import InputPanel from './components/InputPanel';
import ScoreSummary from './components/ScoreSummary';
import GroupDetailAccordion from './components/GroupDetailAccordion';
import ManualReviewSection from './components/ManualReviewSection';
import PdfDownload from './components/PdfDownload';

function App() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runUrlScan = async (url, maxPages) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, maxPages }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Scan failed');
      const data = await res.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
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
      const res = await fetch('/api/scan-html', {
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
    const count = validReports || 1;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ♿ Accessibility Audit Tool
          </h1>
          <p className="text-gray-600">
            Powered by axe-core • Analyze WCAG compliance across visual, motor, and cognitive criteria
          </p>
        </header>

        <InputPanel onUrlSubmit={runUrlScan} onFileSubmit={runHtmlUpload} />

        {loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800"></div>
            <span className="font-medium">Scanning... this can take a few seconds.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6">
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        )}

        {reports ? (
          reports.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg">
              No results found. Try scanning again.
            </div>
          ) : (
            <>
              <ScoreSummary
                overall={averages.overall}
                groupScores={averages.groups}
                isAverage={reports.length > 1}
              />

              {[...reports].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0)).map((report, idx) => {//Descending order of scores
                console.log(`Rendering report ${idx}:`, report);
                return report && report.scores && report.groups ? (
                  <div
                    key={idx}
                    className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-md"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                      🌐 Page: {report.url || 'Uploaded HTML'}
                    </h2>
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
                  <div key={idx} className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6">
                    Invalid report data for page {idx + 1}
                  </div>
                );
              })}

              <PdfDownload report={reports[0]} />
            </>
          )
        ) : (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-500 text-lg">
              👆 Enter a URL or upload an HTML file to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
