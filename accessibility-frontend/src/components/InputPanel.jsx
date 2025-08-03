import { useState } from 'react';

export default function InputPanel({ onUrlSubmit, onFileSubmit }) {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);

  const handleUrl = (e) => {
    e.preventDefault();
    if (url) onUrlSubmit(url);
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
    <div style={{ display: 'flex', gap: 40, marginBottom: 20 }}>
      <form onSubmit={handleUrl} style={{ flex: 1 }}>
        <label>
          URL to scan:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <button type="submit" style={{ marginTop: 8, padding: '6px 12px' }}>
          Scan URL
        </button>
      </form>
      <form onSubmit={submitFile} style={{ flex: 1 }}>
        <label>
          Upload HTML:
          <input type="file" accept=".html" onChange={handleFile} style={{ display: 'block', marginTop: 4 }} />
        </label>
        <button type="submit" style={{ marginTop: 8, padding: '6px 12px' }}>
          Scan HTML
        </button>
      </form>
    </div>
  );
}
