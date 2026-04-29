"use client";

import Link from "next/link";
import ResumeDocument from "../../components/ResumeDocument";

const sampleResume = {
  name: "Rohith Annadatha",
  role: "Senior Salesforce Developer",
  email: "rohith@example.com",
  phone: "+91 00000 00000",
  location: "India",
  summary:
    "Certified Salesforce developer skilled in Apex, LWC, integrations and scalable CRM architecture.",
  skills: "Salesforce, Apex, LWC, SOQL, REST API, Flows",
  exp: "3+ years delivering enterprise-grade Salesforce solutions across sales, service, and automation workflows.",
  projects:
    "Built automated lead routing, LWC dashboards, and REST integrations that improved sales operations.",
  education: "B.Tech in Computer Science",
  certifications: "Salesforce Platform Developer I, Administrator",
  achievements: "Reduced manual CRM work by 35% through flow automation.",
};

const freeTemplates = [
  {
    name: "Modern Starter CV",
    slug: "free-modern",
    color: "#2563eb",
    description: "Simple, clean, full-page resume for quick applications.",
  },
  {
    name: "Professional Two Column",
    slug: "professional-two-column",
    color: "#0f172a",
    description: "Full-body CV layout with a polished sidebar.",
  },
];

const packs = [
  {
    name: "Career Launch",
    price: "Rs. 199",
    color: "#2563eb",
    badge: "For freshers",
    templates: [
      "blue-corporate",
      "minimal-fresher",
      "smart-sidebar",
      "bold-skills",
      "elegant-entry",
    ],
    description: "Entry-level templates for internships, first jobs, and fast applications.",
  },
  {
    name: "Interview Pro",
    price: "Rs. 499",
    color: "#059669",
    badge: "For job switchers",
    templates: [
      "premium-ats",
      "executive-modern",
      "finance-sharp",
      "consultant-style",
      "global-pro",
      "sales-impact",
      "creative-clean",
    ],
    description: "Premium templates for experienced profiles and competitive roles.",
  },
  {
    name: "Executive Edge",
    price: "Rs. 999",
    color: "#7c3aed",
    badge: "For leaders",
    templates: [
      "black-gold",
      "ceo-luxury",
      "royal-executive",
      "director-premium",
      "silicon-elite",
      "tech-dark",
      "platinum-pro",
      "manager-x",
      "international-max",
      "architect-pro",
    ],
    description: "Executive, international, and leadership-focused CV designs.",
  },
];

function FullResumePreview({ color = "#2563eb", name = "" }) {
  return (
    <div className="cvp-full-resume-frame gallery">
      <div className="cvp-full-resume-scale">
        <ResumeDocument
          form={sampleResume}
          ats={96}
          template={{
            name,
            color,
          }}
          compact
        />
      </div>
    </div>
  );
}

export default function TemplatesGalleryPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="max-w-7xl mx-auto mb-10">
        <span className="text-blue-700 font-bold uppercase tracking-[0.15em] text-sm">
          CVPilot Templates
        </span>
        <h1 className="text-5xl font-bold text-slate-900 mt-3">
          Two free resumes, then choose the right career pack.
        </h1>
        <p className="text-slate-600 mt-4 text-lg max-w-3xl">
          Every template preview shows a complete resume shape so the person can
          judge the full CV style before selecting or upgrading.
        </p>
      </section>

      <section className="max-w-7xl mx-auto mb-16">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h2 className="text-3xl font-bold">Free Templates</h2>
          <span className="text-green-600 font-semibold">Only 2 free options</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {freeTemplates.map((item) => (
            <article key={item.slug} className="bg-white rounded-lg shadow-lg p-6 border">
              <FullResumePreview color={item.color} name={item.slug} />
              <h3 className="font-bold text-xl mt-5">{item.name}</h3>
              <p className="text-slate-600 mt-2 leading-7">{item.description}</p>
              <Link
                href={`/templates/${item.slug}`}
                className="block text-center w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-black mt-5"
              >
                Use Free Template
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h2 className="text-3xl font-bold">Subscription Packs</h2>
          <span className="text-indigo-600 font-semibold">3 choices by requirement</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <article key={pack.name} className="bg-white rounded-lg shadow-xl overflow-hidden border">
              <div style={{ background: `${pack.color}18` }} className="p-6">
                <FullResumePreview color={pack.color} name={pack.templates[0]} />
              </div>
              <div className="p-6">
                <span style={{ color: pack.color }} className="font-bold text-sm uppercase">
                  {pack.badge}
                </span>
                <h3 className="text-2xl font-bold mt-2">{pack.name}</h3>
                <p className="text-4xl font-bold mt-2" style={{ color: pack.color }}>
                  {pack.price}
                </p>
                <p className="text-slate-600 mt-3 leading-7">{pack.description}</p>
                <p className="font-semibold mt-4">{pack.templates.length} templates included</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {pack.templates.slice(0, 4).map((template) => (
                    <span key={template} className="px-3 py-1 rounded-full bg-slate-100 text-sm capitalize">
                      {template.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/app/api/generate/pricing?pack=${pack.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block text-center w-full text-white py-3 rounded-lg font-semibold mt-6"
                  style={{ background: pack.color }}
                >
                  Take {pack.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
