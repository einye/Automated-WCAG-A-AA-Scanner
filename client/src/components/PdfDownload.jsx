import { Download } from 'lucide-react';

export default function PdfDownload({ report }) {
  const isUrlReport = !!report.url;
  const downloadUrl = isUrlReport
    ? `http://localhost:3000/api/download-pdf?url=${encodeURIComponent(report.url)}`
    : report.pdfDownload;

  return (
    <div className="mt-6">
      <a 
        href={downloadUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        <Download className="w-5 h-5" />
        Download PDF Report
      </a>
    </div>
  );
}
