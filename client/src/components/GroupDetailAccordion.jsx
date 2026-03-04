import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function GroupDetailAccordion({ group, data }) {
  const [open, setOpen] = useState(false);

  const groupEmojis = {
    visual: '👁️',
    motor: '🖱️',
    cognitive: '🧠'
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm overflow-hidden">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <h3 className="text-lg font-semibold text-gray-800 capitalize flex items-center gap-2">
          <span>{groupEmojis[group] || '📋'}</span>
          {group} Group
        </h3>
        <button
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          {open ? (
            <>
              Hide <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {open && (
        <div className="p-4 pt-0 space-y-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">❌ Failed Checks</h4>
            {data.failedChecks.length === 0 ? (
              <div className="text-green-700 bg-green-50 px-4 py-3 rounded-md border border-green-200">
                None 🎉 All checks passed!
              </div>
            ) : (
              <div className="space-y-3">
                {data.failedChecks.map((c, i) => (
                  <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <strong className="text-red-900">{c.rule}</strong>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-red-200 text-red-800 uppercase">
                        {c.impact}
                      </span>
                    </div>
                    <div className="text-sm text-red-800 mb-2">{c.description}</div>
                    {c.helpUrl && (
                      <div className="mb-3">
                        <a
                          href={c.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-red-700 hover:text-red-900 underline underline-offset-2"
                        >
                          Learn more about this rule
                        </a>
                      </div>
                    )}
                    {c.html.map((h, idx) => (
                      <pre
                        key={idx}
                        className="bg-white border border-red-200 p-3 overflow-x-auto rounded text-xs text-gray-700 mb-2 last:mb-0"
                      >
                        {h}
                      </pre>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">✅ Passed Checks</h4>
            {data.passedChecks.length === 0 ? (
              <div className="text-gray-600 bg-gray-50 px-4 py-3 rounded-md border border-gray-200">
                No passed checks to display
              </div>
            ) : (
              <div className="space-y-3">
                {data.passedChecks.map((c, i) => (
                  <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <strong className="text-green-900 block mb-1">{c.rule}</strong>
                    <div className="text-sm text-green-800 mb-2">{c.description}</div>
                    {c.helpUrl && (
                      <div className="mb-3">
                        <a
                          href={c.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-green-700 hover:text-green-900 underline underline-offset-2"
                        >
                          Learn more about this rule
                        </a>
                      </div>
                    )}
                    {c.html.map((h, idx) => (
                      <pre
                        key={idx}
                        className="bg-white border border-green-200 p-3 overflow-x-auto rounded text-xs text-gray-700 mb-2 last:mb-0"
                      >
                        {h}
                      </pre>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
