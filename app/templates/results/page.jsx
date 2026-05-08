"use client";

import { useEffect } from "react";
import Link from "next/link";

import ResumeDocument from "../../../components/ResumeDocument";

const rohithResume = {
  name: "Rohith Annadatha",
  role: "Salesforce Developer",
  email: "rohith161194@gmail.com",
  phone: "+91 9000281647",
  location: "Hyderabad, IN 500047",
  summary:
    "Salesforce Developer with 3+ years of experience designing, implementing, and maintaining Salesforce applications. Skilled in Apex, Visualforce, Lightning Web Components, performance optimization, automation, third-party integrations, stakeholder collaboration, cloud computing, database development, and troubleshooting. Certified Salesforce Platform Developer I with a focus on scalable, maintainable solutions.",
  skills:
    "Salesforce.com, Force.com, Apex, Visualforce, Lightning Web Components, SOQL, SOSL, REST API, SOAP API, Sales Cloud, Service Cloud, Marketing Cloud, Data Loader, Salesforce DX, Git, HTML, CSS, JavaScript, SQL, MySQL, Jenkins, Postman, Jira, AWS",
  exp:
    "Salesforce Developer - Kom Info Solutions, Hyderabad, India | March 2021 - Present\n- Developed and customized Salesforce applications using Apex, Visualforce, and Lightning Web Components.\n- Integrated Salesforce with third-party systems to enhance functionality and streamline workflows.\n- Collaborated with clients and internal teams to gather requirements and deliver scalable solutions.\n- Maintained Salesforce systems by identifying and resolving software defects.\n- Improved system performance and reduced maintenance through modern development practices.\n- Built custom reports and dashboards to deliver business performance insights.\n- Debugged and optimized code to improve reliability and reduce defects.",
  projects:
    "Insurance Management - American National Insurance Company (ANIC), USA | Salesforce Lightning Developer | March 2021 - March 2023\nAutomated insurance policy registration, lead assignment, follow-up appointment workflows, policyholder ID generation, confirmation emails, and policy-status updates. Built Lightning Components, Lightning apps, Apex classes, Visualforce pages, controller classes, triggers, workflows, approvals, object relationships, Web-to-Lead functionality, formula fields, page layouts, test classes, SOQL/SOSL queries, data migration flows, and reports.\n\nHealth Care System - Al Sabah Medical Centre, UAE | Project Coordinator | April 2023 - Present\nSupported a health application for managing patient information across hospital branches with role-based access for doctors, paramedics, and registration users. Customized Salesforce applications, built Visualforce pages, custom controllers, extension controllers, Apex classes, triggers, custom objects, validation rules, page layouts, search layouts, workflow rules, email alerts, field updates, approval processes, sharing rules, role hierarchies, profiles, and field-level security. Reduced completion time by 15% through requirement and specification collaboration.",
  education:
    "Bachelor of Technology in Mechanical Engineering - Auroras Engineering College, Hyderabad | July 2016",
  certifications: "Salesforce Certified Platform Developer I - July 2024",
  languages: "English (Bilingual, C2), Hindi (Advanced, C1)",
  achievements:
    "Improved Salesforce reliability by optimizing and debugging code. Reduced project completion time by 15% through stronger requirement collaboration. Delivered reusable Lightning helper functions and automation patterns that reduced duplicated JavaScript and maintenance effort.",
};

const templateGroups = [
  {
    title: "Free Templates",
    badge: "Rs. 0",
    color: "#2457d6",
    templates: [
      ["free-modern", "Modern Starter CV"],
      ["professional-two-column", "Professional Two Column"],
    ],
  },
  {
    title: "Career Launch",
    badge: "Rs. 199",
    color: "#2563eb",
    templates: [
      ["blue-corporate", "Blue Corporate"],
      ["minimal-fresher", "Minimal Fresher"],
      ["smart-sidebar", "Smart Sidebar"],
      ["bold-skills", "Bold Skills"],
      ["elegant-entry", "Elegant Entry"],
    ],
  },
  {
    title: "Interview Pro",
    badge: "Rs. 499",
    color: "#0f8f82",
    templates: [
      ["premium-ats", "Premium ATS"],
      ["executive-modern", "Executive Modern"],
      ["finance-sharp", "Finance Sharp"],
      ["consultant-style", "Consultant Style"],
      ["global-pro", "Global Pro"],
      ["sales-impact", "Sales Impact"],
      ["creative-clean", "Creative Clean"],
    ],
  },
  {
    title: "Executive Edge",
    badge: "Rs. 999",
    color: "#7057d8",
    templates: [
      ["black-gold", "Black Gold"],
      ["ceo-luxury", "CEO Luxury"],
      ["royal-executive", "Royal Executive"],
      ["director-premium", "Director Premium"],
      ["silicon-elite", "Silicon Elite"],
      ["tech-dark", "Tech Dark"],
      ["platinum-pro", "Platinum Pro"],
      ["manager-x", "Manager X"],
      ["international-max", "International Max"],
      ["architect-pro", "Architect Pro"],
    ],
  },
];

const totalTemplates = templateGroups.reduce(
  (count, group) => count + group.templates.length,
  0
);

function getVariant(slug) {
  return slug.includes("two-column") ||
    slug.includes("sidebar") ||
    slug.includes("executive") ||
    slug.includes("director") ||
    slug.includes("manager")
    ? "sidebar"
    : "classic";
}

export default function ResultsPage() {
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(rohithResume));
    localStorage.setItem("cvpilot_draft", JSON.stringify(rohithResume));
  }, []);

  return (
    <main className="cvp-results-page" style={styles.page}>
      <section className="cvp-results-hero" style={styles.hero}>
        <div className="cvp-results-hero-content" style={styles.heroContent}>
          <span className="cvp-results-eyebrow" style={styles.eyebrow}>CVPilot template results</span>
          <h1 className="cvp-results-title" style={styles.title}>Rohith Annadatha CV across every CVPilot design</h1>
          <p className="cvp-results-copy" style={styles.copy}>
            Your RR-1.pdf has been parsed once and applied consistently across
            all free and paid template packs, so you can compare layout, tone,
            density, and visual hierarchy side by side.
          </p>
          <div className="cvp-results-actions" style={styles.heroActions}>
            <Link className="cvp-results-primary-link" href="/" style={styles.primaryLink}>
              Open builder
            </Link>
            <Link className="cvp-results-secondary-link" href="/templates" style={styles.secondaryLink}>
              Back to templates
            </Link>
          </div>
        </div>

        <aside className="cvp-results-summary" style={styles.summaryPanel}>
          <div className="cvp-results-score-ring" style={styles.scoreRing}>
            <strong>96</strong>
            <span>ATS</span>
          </div>
          <div className="cvp-results-summary-rows" style={styles.summaryRows}>
            <div>
              <span>Templates</span>
              <strong>{totalTemplates}</strong>
            </div>
            <div>
              <span>Packs</span>
              <strong>{templateGroups.length}</strong>
            </div>
            <div>
              <span>Profile</span>
              <strong>Salesforce</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="cvp-results-pack-nav" style={styles.packNav}>
        {templateGroups.map((group) => (
          <a
            className="cvp-results-pack-chip"
            key={group.title}
            href={`#${group.title.replace(/\s+/g, "-").toLowerCase()}`}
            style={styles.packChip}
          >
            <span style={{ ...styles.packDot, background: group.color }} />
            {group.title}
            <strong>{group.templates.length}</strong>
          </a>
        ))}
      </section>

      {templateGroups.map((group) => (
        <section
          key={group.title}
          id={group.title.replace(/\s+/g, "-").toLowerCase()}
          className="cvp-results-group"
          style={styles.group}
        >
          <div className="cvp-results-group-head" style={styles.groupHead}>
            <div>
              <span style={{ ...styles.pack, color: group.color }}>{group.badge}</span>
              <h2 className="cvp-results-group-title" style={styles.groupTitle}>{group.title}</h2>
            </div>
            <strong style={styles.count}>{group.templates.length} templates</strong>
          </div>

          <div className="cvp-results-grid" style={styles.grid}>
            {group.templates.map(([slug, name]) => (
              <article className="cvp-results-card" key={slug} style={styles.card}>
                <div style={{ ...styles.accentBar, background: group.color }} />
                <div className="cvp-results-card-head" style={styles.cardHead}>
                  <div>
                    <h3 className="cvp-results-card-title" style={styles.cardTitle}>{name}</h3>
                    <p style={styles.slug}>{slug}</p>
                  </div>
                  <Link className="cvp-results-open-link" href={`/templates/${slug}`} style={styles.openLink}>
                    Open
                  </Link>
                </div>
                <div className="cvp-results-preview-frame" style={styles.previewFrame}>
                  <div className="cvp-results-preview-scale" style={styles.previewScale}>
                    <ResumeDocument
                      form={rohithResume}
                      ats={96}
                      template={{ name: slug, color: group.color }}
                      variant={getVariant(slug)}
                      compact
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #0b1020 0%, #121a2e 300px, #f4f7fb 301px, #eef3f8 100%)",
    color: "#111827",
    padding: "28px 18px 70px",
  },
  hero: {
    maxWidth: 1240,
    margin: "0 auto 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 20,
    flexWrap: "wrap",
    color: "#ffffff",
  },
  heroContent: {
    flex: "1 1 680px",
    padding: "30px 0 16px",
  },
  eyebrow: {
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 8,
    maxWidth: 900,
    fontSize: 54,
    lineHeight: 1.05,
    letterSpacing: 0,
  },
  copy: {
    maxWidth: 760,
    marginTop: 16,
    color: "#cbd5e1",
    lineHeight: 1.65,
    fontSize: 16,
  },
  heroActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 22,
  },
  primaryLink: {
    minHeight: 44,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    background: "#ffffff",
    color: "#111827",
    padding: "0 16px",
    fontWeight: 900,
  },
  secondaryLink: {
    minHeight: 44,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.24)",
    color: "#ffffff",
    padding: "0 16px",
    fontWeight: 900,
  },
  summaryPanel: {
    flex: "0 1 360px",
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: 16,
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 8,
    background: "rgba(255,255,255,0.08)",
    padding: 18,
    boxShadow: "0 22px 54px rgba(0,0,0,0.22)",
  },
  scoreRing: {
    width: 112,
    height: 112,
    display: "grid",
    placeItems: "center",
    alignContent: "center",
    border: "8px solid #38bdf8",
    borderRadius: "50%",
    background: "rgba(15, 23, 42, 0.72)",
  },
  summaryRows: {
    display: "grid",
    gap: 10,
  },
  packNav: {
    position: "sticky",
    top: 12,
    zIndex: 4,
    maxWidth: 1240,
    margin: "0 auto 28px",
    display: "flex",
    gap: 10,
    overflowX: "auto",
    padding: "12px",
    border: "1px solid #d9e2ef",
    borderRadius: 8,
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 18px 42px rgba(17, 24, 39, 0.1)",
    backdropFilter: "blur(14px)",
  },
  packChip: {
    minHeight: 40,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
    border: "1px solid #d9e2ef",
    borderRadius: 8,
    color: "#111827",
    padding: "0 12px",
    fontWeight: 900,
  },
  packDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
  group: {
    maxWidth: 1240,
    margin: "0 auto 42px",
    scrollMarginTop: 90,
  },
  groupHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  pack: {
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
  },
  groupTitle: {
    marginTop: 4,
    fontSize: 30,
    lineHeight: 1.1,
  },
  count: {
    color: "#5b667a",
    fontSize: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 18,
  },
  card: {
    position: "relative",
    overflow: "hidden",
    border: "1px solid #d9e2ef",
    borderRadius: 8,
    background: "#ffffff",
    boxShadow: "0 18px 46px rgba(17, 24, 39, 0.12)",
  },
  accentBar: {
    height: 5,
    width: "100%",
  },
  cardHead: {
    minHeight: 78,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: "14px 16px",
    borderBottom: "1px solid #d9e2ef",
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 1.2,
  },
  slug: {
    marginTop: 4,
    color: "#5b667a",
    fontSize: 12,
    fontWeight: 800,
  },
  openLink: {
    minWidth: 64,
    minHeight: 38,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: "1px solid #111827",
    background: "#111827",
    color: "#ffffff",
    fontWeight: 900,
  },
  previewFrame: {
    height: 620,
    overflow: "auto",
    background:
      "linear-gradient(135deg, #e5edf7 0%, #f8fafc 48%, #dfeaf6 100%)",
    padding: "18px 12px",
  },
  previewScale: {
    width: 780,
    margin: "0 auto -330px",
    transform: "scale(0.66)",
    transformOrigin: "top center",
  },
};
