import { useState } from 'react';

export default function ManualReviewSection({ manualReview }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: '1px solid #999', padding: 14, borderRadius: 6, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Manual Review Needed</h2>
        <button onClick={() => setOpen((o) => !o)}>{open ? 'Hide' : 'Show'}</button>
      </div>

      {open && (
        <div style={{ marginTop: 12 }}>
          {manualReview && manualReview.length > 0 ? (
            manualReview.map((item, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 12,
                  padding: 8,
                  background: '#fff7e6',
                  borderRadius: 4,
                }}
              >
                <div>
                  <strong>{item.rule}</strong>
                </div>
                <div>{item.description}</div>
                {item.html &&
                  item.html.map((h, idx) => (
                    <pre
                      key={idx}
                      style={{
                        background: '#f4f4f4',
                        padding: 6,
                        overflowX: 'auto',
                        borderRadius: 4,
                      }}
                    >
                      {h}
                    </pre>
                  ))}
              </div>
            ))
          ) : (
            <div>
              <p>No incomplete rules flagged. Still consider manual checks for:</p>
              <ul>
                <li>Keyboard traps or dynamic content</li>
                <li>Focus order and navigation consistency</li>
                <li>Cognitive load (clear labels, predictable layout)</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
