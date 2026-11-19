import { ShieldAlert, Landmark, Globe2, ExternalLink } from 'lucide-react';

export default function LegislationSection() {
  const kenyanLegislation = [
    {
      title: 'Constitution of Kenya 2010 (Article 54)',
      desc: 'Guarantees the right of persons with disabilities to access all places, public transport, and information, asserting their dignity and equal participation in society.',
      link: 'https://kenyalaw.org/akn/ke/act/2010/constitution/eng@2010-09-03#chp_Four__part_3__sec_54',
    },
    {
      title: 'Persons with Disabilities Act 2003',
      desc: 'An Act of Parliament to give effect to Article 54 of the Constitution; to restructure the National Council for Persons with Disabilities and to provide for its functions and powers; to provide for the institutional framework for protecting, promoting and monitoring the rights of persons with disabilities; to provide for incentives and reliefs; and for connected purposes',
      link: 'https://kenyalaw.org/akn/ke/act/2025/4/eng@2025-05-13#part_III__sec_26',
    },
    {
      title: 'ICT Authority Accessibility Guidelines',
      desc: 'Kenyan government ICT standards directing state portals and public agency websites to achieve minimum WCAG Level AA compatibility.',
      link: 'https://cms.icta.go.ke//sites/default/files/2024-10/Kenya-Accessibility-Standard-ICT-Products-and-Services_KS-2952-1-2-2022_May_2023_.pdf',
    },
    {
      title: 'Kenya Information & Communications Act',
      desc: 'Promotes access to modern information services and broadcasting for vulnerable groups, specifically catering to special needs and PWD accessibility.',
      link: 'https://kenyalaw.org/akn/ke/act/1998/2/eng@2022-12-31',
    },
  ];

  const globalStandards = [
    {
      title: 'WCAG 2.1 / 2.2 Guidelines',
      desc: 'Published by W3C, these international guidelines outline modern web criteria across Perceivable, Operable, Understandable, and Robust accessibility principles.',
      link: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
    },
    {
      title: 'European Standard EN 301549:2021',
      desc: 'The official European specification for ICT procurement, ensuring mobile applications and governmental web services are digitally inclusive.',
      link: 'https://accessible-eu-centre.ec.europa.eu/content-corner/digital-library/en-3015492021-accessibility-requirements-ict-products-and-services_en',
    },
    {
      title: 'ADA Section 508 (United States)',
      desc: 'Mandates that federal agencies build, procure, and maintain information and electronic technology accessible to federal employees and members of the public.',
      link: 'https://www.access-board.gov/ict/',
    },
    {
      title: 'EU Web Accessibility Directive',
      desc: 'Requires all public sector websites and mobile applications in EU member states to be fully compliant with accessibility requirements based on EN 301 549.',
      link: 'https://digital-strategy.ec.europa.eu/en/policies/web-accessibility',
    },
  ];

  return (
    <div className="space-y-8 mt-16 pt-8 border-t border-gray-200">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <ShieldAlert className="w-6 h-6 text-blue-600" />
          Accessibility Laws & Standards
        </h3>
        <p className="text-gray-600 text-sm">
          Understanding local frameworks and global guidelines is crucial to building modern, compliant digital platforms.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Kenyan Legislation */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Landmark className="w-5 h-5 text-amber-600" />
            Kenyan Legal Frameworks
          </h4>
          <div className="space-y-4">
            {kenyanLegislation.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-gray-150 rounded-lg hover:border-amber-300 transition-colors shadow-sm"
              >
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h5 className="font-bold text-gray-800 text-sm">{item.title}</h5>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Standards */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Globe2 className="w-5 h-5 text-indigo-600" />
            Global Compliance Guidelines
          </h4>
          <div className="space-y-4">
            {globalStandards.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-gray-150 rounded-lg hover:border-indigo-300 transition-colors shadow-sm"
              >
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h5 className="font-bold text-gray-800 text-sm">{item.title}</h5>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
