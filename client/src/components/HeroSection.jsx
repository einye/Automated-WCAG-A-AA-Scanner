import { Globe, FileCode, Cpu, FileText, Compass, Layers } from 'lucide-react';

export default function HeroSection() {
  const steps = [
    {
      num: '1',
      title: 'Submit Source',
      desc: (
        <>
          Enter a website URL for multi-page crawling, upload a static HTML file, or scan directly using {' '}
          <a
            href="https://drive.google.com/uc?id=1MKb4mSAkzhhuNi1jO8-hzDNVPmoxE3_a"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            our Chrome extension
          </a>
          .
        </>
      ),
    },
    {
      num: '2',
      title: 'Automated Audit',
      desc: 'Our engine runs comprehensive WCAG 2.1/2.2 compliance audits using axe-core across critical accessibility groups.',
    },
    {
      num: '3',
      title: 'Remediate & Export',
      desc: 'Get instantly generated AI suggested code fixes for failed checks and export beautiful, comprehensive PDF reports.',
    },
    {
      num: '4',
      title: 'Understand the Score',
      desc: (
        <>
          Curious how we calculate your compliance percentage? {' '}
          <a
            href="/how-we-score"
            className="text-blue-600 underline font-medium hover:text-blue-800 transition-colors"
          >
            Learn about our scoring algorithm
          </a>.
        </>
      ),
    },
  ];

  const features = [
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: 'URL Web Scanning',
      desc: 'Audit live web pages instantly. Type any public domain and let our engine retrieve accessibility indicators.',
    },
    {
      icon: <FileCode className="w-6 h-6 text-indigo-600" />,
      title: 'HTML Upload Support',
      desc: 'Analyze raw HTML files before they deploy to production. Simply drag, drop, and inspect accessibility.',
    },
    {
      icon: <Layers className="w-6 h-6 text-teal-600" />,
      title: 'Deep Crawling & Audit',
      desc: 'Configure deep scanning up to 50 pages. Perfect for understanding accessibility health across whole directories.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-600" />,
      title: 'AI Code Remediation',
      desc: 'Failed a check? Our AI models generate ready-to-copy accessible code snippets instantly with explanations.',
    },
    {
      icon: <FileText className="w-6 h-6 text-rose-600" />,
      title: 'Professional Reports',
      desc: 'Export beautifully formatted PDF summary reports with score cards and failed/passed details.',
    },
    {
      icon: <Compass className="w-6 h-6 text-amber-600" />,
      title: 'Chrome Extension',
      desc: 'Scan current tabs inline on any webpage, view instant overlays, and easily redirect to this dashboard.',
    },
  ];

  return (
    <div className="space-y-12 mb-12">
      {/* Welcome Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full uppercase tracking-wider">
          Next-Gen Web Accessibility
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          Ensure Digital Inclusivity for Everyone, Everywhere.
        </h2>
        <p className="text-gray-600 text-base md:text-lg">
          Our advanced accessibility scanner parses your web interfaces against standard criteria, providing developer-ready remediations instantly.
        </p>
      </div>

      {/* How to use */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">How to Get Started</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-blue-100">
                {step.num}
              </div>
              <h4 className="text-lg font-bold text-gray-800">{step.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 -right-4 w-8 border-t-2 border-dashed border-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Powerful Auditing Features</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-150 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col space-y-3"
            >
              <div className="p-3 bg-gray-50 rounded-lg w-fit">{feat.icon}</div>
              <h4 className="font-bold text-gray-800 text-lg">{feat.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
