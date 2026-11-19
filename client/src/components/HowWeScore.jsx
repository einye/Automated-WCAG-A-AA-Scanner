import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Info, Calculator, Layers, BookOpen } from 'lucide-react';

export default function HowWeScore() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-8 py-10 text-white relative">
          <a 
            href="/" 
            className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </a>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            How Our Scoring Engine Works
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            We use a rigorous, weight-based methodology built on top of the industry-standard <strong>axe-core</strong> library to evaluate the accessibility of your digital content across specific disability categories.
          </p>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 space-y-12">
          
          {/* Base Algorithm */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Calculator className="w-6 h-6 text-blue-600 mr-3" />
              The Scoring Formula
            </h2>
            <div className="prose text-gray-600 max-w-none">
              <p>
                Our engine answers the question: <em>"How accessible is this page, and for whom?"</em>
              </p>
              <p className="mt-4">
                Instead of a simple "passed vs. failed" count, our algorithm uses a <strong>constant denominator subtractive model</strong>. We evaluate your page against a fixed "Rule Map" to ensure scores are consistent and comparable across entirely different websites.
              </p>
            </div>
            
            <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Step-by-Step Calculation</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 shrink-0 text-sm mt-0.5">1</div>
                  <div>
                    <strong>Tally Total Possible Weights:</strong> We start by summing the weight of <em>every</em> rule in our system. This sets a constant, theoretical maximum baseline (the <strong>Total Weight</strong>).
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 shrink-0 text-sm mt-0.5">2</div>
                  <div>
                    <strong>Process Violations:</strong> For every failed rule found by axe-core, we find its severity weight and add it to a <strong>Failed Weight</strong> tally.
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-3 shrink-0 text-sm mt-0.5">3</div>
                  <div>
                    <strong>Calculate Percentage:</strong> We subtract the failed weight from the total weight to find the passed weight, then calculate the final percentage.
                  </div>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-white border border-blue-100 rounded-lg text-center shadow-sm">
                <span className="text-lg font-mono text-gray-800">
                  Score = ((Total Weight − Failed Weight) / Total Weight) × 100
                </span>
              </div>
            </div>
          </section>

          {/* Severity Weighting */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-blue-600 mr-3" />
              The Weight Scale
            </h2>
            <p className="text-gray-600 mb-6">
              Not all accessibility issues have the same impact. A critical barrier that completely blocks a user group penalizes the score much more heavily than a minor technical violation.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border border-red-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" /> High
                  </h3>
                  <span className="bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-md text-sm">Weight: 3</span>
                </div>
                <p className="text-sm text-gray-600">
                  Critical barriers that block entire user groups. (e.g., missing image alt text, inaccessible keyboard navigation, no color contrast).
                </p>
              </div>

              <div className="bg-white border border-orange-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" /> Medium
                  </h3>
                  <span className="bg-orange-100 text-orange-800 font-bold px-2.5 py-1 rounded-md text-sm">Weight: 2</span>
                </div>
                <p className="text-sm text-gray-600">
                  Significant issues that heavily degrade usability. (e.g., missing document titles, illogical tab order, missing form labels).
                </p>
              </div>

              <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2" /> Low
                  </h3>
                  <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-md text-sm">Weight: 1</span>
                </div>
                <p className="text-sm text-gray-600">
                  Minor issues that are inconvenient but usually bypassable. (e.g., invalid ARIA attributes, non-unique access keys).
                </p>
              </div>
            </div>
          </section>

          {/* Group Scoring */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Layers className="w-6 h-6 text-blue-600 mr-3" />
              Disability Categories
            </h2>
            <p className="text-gray-600 mb-6">
              Our algorithm maps every rule to specific disability groups to pinpoint exactly who is affected. Some rules (like missing link names) are multi-group and will deduct points from all affected categories simultaneously.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="py-3 px-4 rounded-tl-lg font-semibold border-b">Category</th>
                    <th className="py-3 px-4 font-semibold border-b">What it Checks</th>
                    <th className="py-3 px-4 rounded-tr-lg font-semibold border-b">Example Failure Impact</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-900">Visual</td>
                    <td className="py-3 px-4">Color contrast, screen reader semantics</td>
                    <td className="py-3 px-4">A user with low vision cannot read gray text on a white background.</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-900">Motor</td>
                    <td className="py-3 px-4">Keyboard navigation, focus indicators</td>
                    <td className="py-3 px-4">A user without a mouse cannot reach a dropdown menu.</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-900">Cognitive</td>
                    <td className="py-3 px-4">Predictable navigation, timing, distractions</td>
                    <td className="py-3 px-4">A user with ADHD is distracted by an auto-refreshing carousel.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">The Overall Score</h3>
              <p className="text-gray-600">
                The final Overall Score is simply the <strong>arithmetic mean</strong> of the Visual, Motor, and Cognitive scores. By giving equal weight to each group, we ensure no single disability category dominates the assessment.
              </p>
            </div>
          </section>

          {/* Thresholds */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
              Score Interpretation
            </h2>
            <p className="text-gray-600 mb-6">
              Our color-coded thresholds help you quickly identify the health of your digital content:
            </p>
            <div className="space-y-3">
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-md text-lg mr-4 w-20 text-center">90-100</div>
                <div>
                  <h4 className="font-bold text-green-800">Excellent</h4>
                  <p className="text-green-700 text-sm">Minimal issues — page meets or exceeds standards.</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-md text-lg mr-4 w-20 text-center">70-89</div>
                <div>
                  <h4 className="font-bold text-yellow-800">Needs Attention</h4>
                  <p className="text-yellow-700 text-sm">Some violations present — remediation is recommended.</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-md text-lg mr-4 w-20 text-center">&lt; 70</div>
                <div>
                  <h4 className="font-bold text-red-800">Poor</h4>
                  <p className="text-red-700 text-sm">Significant accessibility gaps - urgent attention is needed.</p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg shadow-sm">
            <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              A Note on Automated Testing
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              A score of 100 does not guarantee complete WCAG compliance. Manual testing with screen readers and keyboard navigation is always recommended for true inclusivity.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
