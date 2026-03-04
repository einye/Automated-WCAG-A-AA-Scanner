import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export default function ManualReviewSection({ manualReview }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-amber-200 bg-amber-50 rounded-lg mb-6 shadow-sm overflow-hidden">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-amber-100 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <h2 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Manual Review Needed
        </h2>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-200 rounded-md transition-colors">
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
        <div className="p-4 pt-0">
          {manualReview && manualReview.length > 0 ? (
            <div className="space-y-3">
              {manualReview.map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-amber-200 rounded-lg p-4"
                >
                  <strong className="text-amber-900 block mb-1">{item.rule}</strong>
                  <div className="text-sm text-amber-800 mb-2">{item.description}</div>
                  {item.helpUrl && (
                    <div className="mb-3">
                      <a
                        href={item.helpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2"
                      >
                        Learn more about this rule
                      </a>
                    </div>
                  )}
                  {item.html &&
                    item.html.map((h, idx) => (
                      <pre
                        key={idx}
                        className="bg-gray-50 border border-amber-200 p-3 overflow-x-auto rounded text-xs text-gray-700 mb-2 last:mb-0"
                      >
                        {h}
                      </pre>
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 font-medium mb-3">
                No incomplete rules flagged. Still consider manual checks for:
              </p>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Keyboard traps or dynamic content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Focus order and navigation consistency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Cognitive load (clear labels, predictable layout)</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
