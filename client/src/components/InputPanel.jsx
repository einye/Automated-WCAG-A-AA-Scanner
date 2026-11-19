import { useState } from 'react';
import { Info, ExternalLink, ChevronDown, AlertTriangle } from 'lucide-react';

export default function InputPanel({ onUrlSubmit, onFileSubmit }) {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [maxPages, setMaxPages] = useState(5);

  const handleUrl = (e) => {
    e.preventDefault();
    if (url) onUrlSubmit(url, maxPages);
  };

  const handleFile = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const submitFile = (e) => {
    e.preventDefault();
    if (file) onFileSubmit(file);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Informational Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex gap-3">
        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700 leading-relaxed">
          <p className="mb-2">
            This tool uses <strong>axe-core</strong>, the industry-leading accessibility testing engine, to analyze web pages
            for WCAG compliance issues. It evaluates visual, motor, and cognitive accessibility criteria to help you build
            more inclusive web experiences.
          </p>
          <div className="flex flex-wrap gap-4 mt-3">
            <a
              href="https://www.deque.com/axe/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-medium transition-colors"
            >
              Learn about axe-core
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-medium transition-colors"
            >
              WCAG Guidelines
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://www.deque.com/axe/devtools/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-medium transition-colors"
            >
              axe DevTools
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Input Forms */}
      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={handleUrl} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">URL to Scan</span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </label>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Number of pages to scan
            </label>
            <select
              value={maxPages}
              onChange={(e) => setMaxPages(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            >
              {[1, 3, 5, 10, 15, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'page' : 'pages'}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Scan URL
          </button>
        </form>

        <form onSubmit={submitFile} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700 mb-2 block">Upload HTML File</span>
            <input
              type="file"
              accept=".html"
              onChange={handleFile}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
            />
          </label>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Scan HTML
          </button>
        </form>
      </div>
    </div>
  );
}
