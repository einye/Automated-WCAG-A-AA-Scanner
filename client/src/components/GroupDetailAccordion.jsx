import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function GroupDetailAccordion({ group, data }) {
  const [open, setOpen] = useState(false);
  // Per-check AI fix state: { [checkIndex]: { status: 'idle'|'loading'|'success'|'error', fixedHtml, explanation, modelUsed, error } }
  const [aiFixes, setAiFixes] = useState({});
  // Per-check copy confirmation state
  const [copied, setCopied] = useState({});

  const [failedOpen, setFailedOpen] = useState(false);
  const [passedOpen, setPassedOpen] = useState(false);
  
  // Track expanded code snippets: { [checkType-checkIndex]: true/false }
  const [expandedCode, setExpandedCode] = useState({});

  const groupEmojis = {
    visual: '',
    motor: '',
    cognitive: '',
  };

  const requestAIFix = async (check, index) => {
    setAiFixes((prev) => ({ ...prev, [index]: { status: 'loading' } }));

    try {
      const res = await fetch('/api/ai-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleId: check.rule,
          htmlSnippet: check.html[0] || '',
          failureSummary: check.description,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'AI fix request failed');

      setAiFixes((prev) => ({
        ...prev,
        [index]: {
          status: 'success',
          fixedHtml: data.fixedHtml,
          explanation: data.explanation,
          modelUsed: data.modelUsed,
        },
      }));
    } catch (err) {
      setAiFixes((prev) => ({
        ...prev,
        [index]: { status: 'error', error: err.message },
      }));
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [index]: false })), 2000);
    });
  };

  const toggleCodeExpanded = (key) => {
    setExpandedCode((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm overflow-hidden">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <h3 className="text-lg font-semibold text-gray-800 capitalize flex items-center gap-2">
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
        <div className="p-4 pt-0 space-y-4">
          {/* Failed Checks Accordion */}
          <div className="border border-red-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setFailedOpen(!failedOpen)}
              className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-900 flex items-center gap-1.5">Failed Checks</span>
                <span className="bg-red-200 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {data.failedChecks.length}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-red-700 transition-transform duration-200 ${failedOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {failedOpen && (
              <div className="p-4 border-t border-red-100 space-y-4">
                {data.failedChecks.length === 0 ? (
                  <div className="text-green-700 bg-green-50 px-4 py-3 rounded-md border border-green-200">
                    None — All checks passed!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.failedChecks.map((c, i) => {
                      const fix = aiFixes[i] || { status: 'idle' };
                      return (
                        <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-4">
                          {/* Rule header */}
                          <div className="flex items-start justify-between mb-2 gap-2 flex-wrap">
                            <strong className="text-red-900">{c.rule}</strong>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-medium px-2 py-1 rounded bg-red-200 text-red-800 uppercase">
                                {c.impact}
                              </span>
                              {/* AI Suggested Fix button */}
                              <button
                                id={`ai-fix-btn-${group}-${i}`}
                                onClick={() => requestAIFix(c, i)}
                                disabled={fix.status === 'loading' || fix.status === 'success'}
                                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200
                                  ${fix.status === 'success'
                                    ? 'bg-purple-100 text-purple-700 border border-purple-300 cursor-default'
                                    : fix.status === 'loading'
                                    ? 'bg-purple-50 text-purple-400 border border-purple-200 cursor-not-allowed'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md'
                                  }`}
                              >
                                {fix.status === 'loading' ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Generating…
                                  </>
                                ) : fix.status === 'success' ? (
                                  <>
                                    <Sparkles className="w-3 h-3" />
                                    Fix Ready
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3 h-3" />
                                    AI Suggested Fix
                                  </>
                                )}
                              </button>
                            </div>
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

                          {/* Offending HTML snippets */}
                          {c.html && c.html.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-red-100">
                              <button
                                onClick={() => toggleCodeExpanded(`failed-${i}`)}
                                className="flex items-center gap-2 text-xs font-medium text-red-700 hover:text-red-900 transition-colors mb-3"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    expandedCode[`failed-${i}`] ? 'rotate-180' : ''
                                  }`}
                                />
                                {expandedCode[`failed-${i}`] ? 'Hide Code' : 'Show Code'} ({c.html.length})
                              </button>
                              {expandedCode[`failed-${i}`] && (
                                <div className="space-y-2">
                                  {c.html.map((h, idx) => (
                                    <pre
                                      key={idx}
                                      className="bg-gray-900 text-gray-100 border border-red-300 p-3 overflow-x-auto rounded text-xs leading-relaxed"
                                    >
                                      {h}
                                    </pre>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* ── AI Fix Panel ── */}
                          {fix.status === 'error' && (
                            <div className="mt-3 flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-sm text-orange-800">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span><strong>AI error:</strong> {fix.error}</span>
                            </div>
                          )}

                          {fix.status === 'success' && (
                            <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 overflow-hidden">
                              {/* Panel header */}
                              <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-100 border-b border-purple-200">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-semibold text-purple-800">AI Suggested Fix</span>
                                {fix.modelUsed && (
                                  <span className="ml-auto text-xs text-purple-500 font-mono">
                                    via {fix.modelUsed.split('/').pop()}
                                  </span>
                                )}
                              </div>

                              {/* Explanation */}
                              <div className="px-4 py-3 text-sm text-purple-900 leading-relaxed border-b border-purple-100">
                                {fix.explanation}
                              </div>

                              {/* Fixed HTML code block */}
                              <div className="relative">
                                <pre className="p-4 overflow-x-auto text-xs {/* text-gray-800 */} bg-gray-900 text-green-300 leading-relaxed">
                                  {fix.fixedHtml}
                                </pre>
                                <button
                                  id={`copy-btn-${group}-${i}`}
                                  onClick={() => handleCopy(fix.fixedHtml, i)}
                                  className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
                                >
                                  {copied[i] ? (
                                    <>
                                      <Check className="w-3 h-3 text-green-400" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      Copy Code
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Passed Checks Accordion */}
          <div className="border border-green-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setPassedOpen(!passedOpen)}
              className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 transition-colors text-left"
            >
                <div className="flex items-center gap-2">
                <span className="font-semibold text-green-900 flex items-center gap-1.5">Passed Checks</span>
                <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {data.passedChecks.length}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-green-700 transition-transform duration-200 ${passedOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {passedOpen && (
              <div className="p-4 border-t border-green-100 space-y-4">
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
                        {/* Offending HTML snippets */}
                        {c.html && c.html.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-green-100">
                            <button
                              onClick={() => toggleCodeExpanded(`passed-${i}`)}
                              className="flex items-center gap-2 text-xs font-medium text-green-700 hover:text-green-900 transition-colors mb-3"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  expandedCode[`passed-${i}`] ? 'rotate-180' : ''
                                }`}
                              />
                              {expandedCode[`passed-${i}`] ? 'Hide Code' : 'Show Code'} ({c.html.length})
                            </button>
                            {expandedCode[`passed-${i}`] && (
                              <div className="space-y-2">
                                {c.html.map((h, idx) => (
                                  <pre
                                    key={idx}
                                    className="bg-gray-900 text-gray-100 border border-green-300 p-3 overflow-x-auto rounded text-xs leading-relaxed"
                                  >
                                    {h}
                                  </pre>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
