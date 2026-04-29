"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "../components/navbar";
import BuilderForm from "../components/BuilderForm";
import PreviewPanel from "../components/PreviewPanel";
import LoginPanel from "../components/LoginPanel";
import MyResumes from "../components/MyResumes";
import ResumeDocument from "../components/ResumeDocument";
import JobSearchPanel from "../components/JobSearchPanel";

import { auth } from "../lib/firebase";
import { saveResumeCloud } from "../lib/cloudSave";

import { calculateATS, saveDraft, loadDraft } from "../lib/resumeUtils";
import { defaultResume } from "../lib/resumeData";

const freeTemplates = [
  {
    name: "free-modern",
    title: "Modern Starter CV",
    color: "#2563EB",
    pack: "Free",
    description: "Clean one-page resume for freshers and quick applications.",
  },
  {
    name: "professional-two-column",
    title: "Professional Two Column",
    color: "#0F172A",
    pack: "Free",
    description: "Balanced full-body CV with sidebar details and ATS-safe text.",
  },
];

const subscriptionPacks = [
  {
    id: "career-launch",
    name: "Career Launch",
    price: "Rs. 199",
    color: "#2563EB",
    accent: "#DBEAFE",
    templateCount: "5 premium templates",
    bestFor: "Freshers, interns, and early-career applicants",
    templates: [
      "blue-corporate",
      "minimal-fresher",
      "smart-sidebar",
      "bold-skills",
      "elegant-entry",
    ],
    features: [
      "Modern fresher layouts",
      "Unlimited PDF and DOCX exports",
      "ATS-friendly section order",
    ],
  },
  {
    id: "interview-pro",
    name: "Interview Pro",
    price: "Rs. 499",
    color: "#059669",
    accent: "#D1FAE5",
    templateCount: "7 advanced templates",
    bestFor: "Experienced professionals applying to competitive roles",
    templates: [
      "premium-ats",
      "executive-modern",
      "finance-sharp",
      "consultant-style",
      "global-pro",
      "sales-impact",
      "creative-clean",
    ],
    features: [
      "Recruiter-ready premium designs",
      "Stronger profile and impact sections",
      "Cloud save for multiple resumes",
    ],
  },
  {
    id: "executive-edge",
    name: "Executive Edge",
    price: "Rs. 999",
    color: "#7C3AED",
    accent: "#EDE9FE",
    templateCount: "10 executive templates",
    bestFor: "Managers, directors, founders, and senior leaders",
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
    features: [
      "Leadership and international CV styles",
      "Executive profile positioning",
      "Priority support and AI suggestions",
    ],
  },
];

const templates = [
  ...freeTemplates,
  ...subscriptionPacks.flatMap((pack) =>
    pack.templates.map((name) => ({
      name,
      color: pack.color,
      pack: pack.price,
      packName: pack.name,
    }))
  ),
];

function FullResumePreview({ form, template, ats = 96 }) {
  return (
    <div className="cvp-full-resume-frame">
      <div className="cvp-full-resume-scale">
        <ResumeDocument form={form} ats={ats} template={template} compact />
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("desktop");
  const [template, setTemplate] = useState(templates[0]);
  const [ats, setAts] = useState(96);
  const [selectedPack, setSelectedPack] = useState(null);

  const [form, setForm] = useState({
    ...defaultResume,
    name: "Rohith Annadatha",
    role: "Senior Salesforce Developer",
    email: "rohith@example.com",
    phone: "+91 00000 00000",
    location: "India",
    summary:
      "Certified Salesforce developer skilled in Apex, LWC, integrations and scalable CRM architecture.",
    skills: "Salesforce, Apex, LWC, SOQL, REST API, Flows",
    exp: "3+ years delivering enterprise-grade Salesforce solutions.",
    projects:
      "Built automated lead routing, LWC dashboards, and REST integrations that improved sales operations.",
    education: "B.Tech in Computer Science",
    certifications: "Salesforce Platform Developer I, Administrator",
    achievements: "Reduced manual CRM work by 35% through flow automation.",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const draft = loadDraft();

    if (draft) {
      setForm({
        ...defaultResume,
        ...draft,
      });
    }

    try {
      const pack = JSON.parse(localStorage.getItem("cvpilot_selected_pack") || "null");
      setSelectedPack(pack);
    } catch {
      setSelectedPack(null);
    }
  }, []);

  const runATS = () => {
    const resumeText = `
${form.role}
${form.summary}
${form.skills}
${form.exp}
${form.projects}
${form.education}
${form.certifications}
${form.achievements}
`;

    const score = calculateATS(resumeText, form.jd);
    setAts(score);
  };

  const saveResume = async () => {
    try {
      saveDraft(form);

      if (user) {
        await saveResumeCloud(user, form, ats, template);
        alert("Saved to cloud");
      } else {
        alert("Saved locally");
      }
    } catch (error) {
      console.error(error);
      alert("Save failed");
    }
  };

  const openResume = (item) => {
    if (!item) return;

    setForm({
      ...defaultResume,
      ...item.form,
    });

    const selected = templates.find((t) => t.name === item.template);

    if (selected) {
      setTemplate(selected);
    }

    setAts(item.ats || 96);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    alert("Resume loaded");
  };

  const openTemplatePage = (item) => {
    saveDraft(form);
    localStorage.setItem("resumeData", JSON.stringify(form));
    setTemplate(item);
    router.push(`/templates/${item.name}`);
  };

  const choosePack = (pack) => {
    if (!user?.email) {
      alert("Please login with email first. Paid packs and invoices need the same account email.");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    saveDraft(form);
    const invoiceReadyForm = {
      ...form,
      email: user.email || form.email,
    };

    localStorage.setItem("resumeData", JSON.stringify(invoiceReadyForm));
    localStorage.setItem("cvpilot_selected_pack", JSON.stringify(pack));
    setSelectedPack(pack);
    router.push(`/app/api/generate/pricing?pack=${pack.id}`);
  };

  const hasPaidPack = Boolean(user?.email && selectedPack?.paymentId);

  const theme = {
    bg: dark
      ? "linear-gradient(135deg,#020617,#111827,#0f172a)"
      : "linear-gradient(135deg,#f8fafc,#eef2ff,#ecfeff)",
    card: dark ? "rgba(15,23,42,0.86)" : "rgba(255,255,255,0.88)",
    text: dark ? "#f8fafc" : "#0f172a",
    sub: dark ? "#cbd5e1" : "#475569",
    border: dark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
    solid: dark ? "#111827" : "#ffffff",
  };

  return (
    <main
      className="cvp-app-shell"
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <Navbar dark={dark} setDark={setDark} theme={theme} />

      <div style={{ marginTop: 18 }}>
        <LoginPanel user={user} />
      </div>

      <div style={{ marginTop: 18 }}>
        <MyResumes user={user} onOpen={openResume} />
      </div>

      <div style={{ marginTop: 18 }}>
        <JobSearchPanel form={form} user={user} />
      </div>

      <section
        className="cvp-main-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.92fr) minmax(0, 1.08fr)",
          gap: 28,
          marginTop: 22,
          alignItems: "start",
        }}
      >
        <div>
          <div
            className="cvp-hero-badge"
            style={{
              display: "inline-block",
            }}
          >
            CVPilot Full Scale
          </div>

          <h1
            className="cvp-hero-title"
            style={{
              lineHeight: 1.05,
              letterSpacing: 0,
            }}
          >
            Build a complete CV that looks interview-ready.
          </h1>

          <p
            className="cvp-hero-copy"
            style={{
              color: theme.sub,
            }}
          >
            Create the resume, score it for ATS, save it, export it, and choose
            the exact template pack that fits the person's career level.
          </p>

          <section className="cvp-panel cvp-showcase-panel" style={{ background: theme.card, borderColor: theme.border }}>
            <div className="cvp-section-head">
              <div>
                <strong>Start With 2 Free Templates</strong>
                <p style={{ color: theme.sub }}>
                  The first page keeps free choices simple and shows full resume
                  previews before the paid packs.
                </p>
              </div>
              <span>Free forever</span>
            </div>

            <div className="cvp-free-grid">
              {freeTemplates.map((item) => (
                <button
                  key={item.name}
                  onClick={() => openTemplatePage(item)}
                  className="cvp-template-card"
                  style={{
                    borderColor:
                      template.name === item.name ? item.color : theme.border,
                    background: template.name === item.name ? "#EFF6FF" : theme.solid,
                  }}
                >
                  <FullResumePreview form={form} template={item} ats={ats} />
                  <span style={{ color: item.color }}>{item.pack}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="cvp-panel cvp-showcase-panel" style={{ background: theme.card, borderColor: theme.border }}>
            <div className="cvp-section-head">
              <div>
                <strong>Upgrade Packs</strong>
                <p style={{ color: theme.sub }}>
                  Pick based on requirement: fresher, professional, or
                  executive-level resume.
                </p>
              </div>
              <span>{subscriptionPacks.length} packs</span>
            </div>

            <div className="cvp-pack-grid">
              {subscriptionPacks.map((pack) => (
                <article key={pack.id} className="cvp-pack-card">
                  <div className="cvp-pack-top" style={{ background: pack.accent }}>
                    <FullResumePreview
                      form={form}
                      ats={ats}
                      template={{
                        name: pack.templates[0],
                        color: pack.color,
                      }}
                    />
                  </div>
                  <div className="cvp-pack-body">
                    <span style={{ color: pack.color }}>{pack.price}</span>
                    <h2>{pack.name}</h2>
                    <p>{pack.bestFor}</p>
                    <strong>{pack.templateCount}</strong>
                    <ul>
                      {pack.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => choosePack(pack)}
                      style={{ background: pack.color }}
                    >
                      Take {pack.name}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div
            className="cvp-stats-grid"
            style={{ display: "grid", gap: 12, marginTop: 22 }}
          >
            <div style={{ padding: 18, borderRadius: 8, background: theme.card }}>
              <h3>{ats}%</h3>
              <p>ATS Score</p>
            </div>

            <div style={{ padding: 18, borderRadius: 8, background: theme.card }}>
              <h3>{user ? "Online" : "Guest"}</h3>
              <p>Account Status</p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          <BuilderForm
            form={form}
            setForm={setForm}
            runATS={runATS}
            saveResume={saveResume}
            theme={theme}
            allowAI={hasPaidPack}
          />

          <PreviewPanel
            form={form}
            ats={ats}
            template={template}
            theme={theme}
            view={view}
            setView={setView}
          />
        </div>
      </section>
    </main>
  );
}
