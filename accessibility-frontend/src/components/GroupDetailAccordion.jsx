import { useState } from 'react';

export default function GroupDetailAccordion({ group, data }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 6, marginBottom: 16, padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ textTransform: 'capitalize' }}>{group} Group</h3>
        <button onClick={() => setOpen((o) => !o)}>{open ? 'Hide' : 'Show'}</button>
      </div>
      {open && (
        <>
          <div style={{ marginBottom: 12 }}>
            <strong>Failed Checks:</strong>
            {data.failedChecks.length === 0 ? (
              <div>None 🎉</div>
            ) : (
              data.failedChecks.map((c, i) => (
                <div key={i} style={{ marginTop: 8, padding: 8, background: '#ffe6e6', borderRadius: 4 }}>
                  <div>
                    <strong>{c.rule}</strong> <span style={{ fontStyle: 'italic' }}>[{c.impact}]</span>
                  </div>
                  <div>{c.description}</div>
                  {c.html.map((h, idx) => (
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
            )}
          </div>
          <div>
            <strong>Passed Checks:</strong>
            {data.passedChecks.length === 0 ? (
              <div>None</div>
            ) : (
              data.passedChecks.map((c, i) => (
                <div key={i} style={{ marginTop: 8, padding: 8, background: '#e6ffe6', borderRadius: 4 }}>
                  <div>
                    <strong>{c.rule}</strong>
                  </div>
                  <div>{c.description}</div>
                  {c.html.map((h, idx) => (
                    <pre
                      key={idx}
                      style={{
                        background: '#f9f9f9',
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
            )}
          </div>
        </>
      )}
    </div>
  );
}
