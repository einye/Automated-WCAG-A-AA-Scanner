export default function PdfDownload({ report }) {
  const isUrlReport = !!report.url;
  const downloadUrl = isUrlReport
    ? `http://localhost:3000/api/download-pdf?url=${encodeURIComponent(report.url)}`
    : report.pdfDownload; // from HTML upload

  return (
    <div style={{ marginTop: 20 }}>
      <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
        <button style={{ padding: '8px 16px' }}>Download PDF Report</button>
      </a>
    </div>
  );
}
