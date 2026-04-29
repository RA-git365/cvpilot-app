"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ResumeDocument from "../../../components/ResumeDocument";
import { exportResumeDOCX } from "../../../lib/exportDocx";
import { exportResumePDF } from "../../../lib/exportPdf";
import { defaultResume, normalizeResume } from "../../../lib/resumeData";
import { saveDraft } from "../../../lib/resumeUtils";

const colors = {
  "free-modern": "#2563eb",
  "professional-two-column": "#1d4ed8",
  "blue-corporate": "#1d4ed8",
  "minimal-fresher": "#16a34a",
  "smart-sidebar": "#7c3aed",
  "bold-skills": "#dc2626",
  "elegant-entry": "#ea580c",
  "premium-ats": "#059669",
  "executive-modern": "#334155",
  "finance-sharp": "#047857",
  "consultant-style": "#78716c",
  "global-pro": "#4f46e5",
  "sales-impact": "#e11d48",
  "creative-clean": "#0891b2",
  "black-gold": "#ca8a04",
  "ceo-luxury": "#b45309",
  "royal-executive": "#7c3aed",
  "director-premium": "#475569",
  "silicon-elite": "#06b6d4",
  "tech-dark": "#2563eb",
  "platinum-pro": "#6b7280",
  "manager-x": "#4338ca",
  "international-max": "#0284c7",
  "architect-pro": "#0f172a",
};

export default function ResumeTemplate({ slug = "free-modern" }) {
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [saved, setSaved] = useState("");
  const template = {
    name: slug,
    color: colors[slug] || "#2563eb",
    accentDark: slug.includes("dark") || slug.includes("black") ? "#111827" : colors[slug] || "#0f172a",
  };
  const variant =
    slug.includes("two-column") ||
    slug.includes("sidebar") ||
    slug.includes("executive") ||
    slug.includes("director") ||
    slug.includes("manager")
      ? "sidebar"
      : "classic";

  useEffect(() => {
    const savedResume =
      localStorage.getItem("resumeData") || localStorage.getItem("cvpilot_draft");

    if (!savedResume) {
      setResume(defaultResume);
      return;
    }

    try {
      setResume(normalizeResume(JSON.parse(savedResume)));
    } catch {
      setResume(defaultResume);
    }
  }, []);

  const saveResume = () => {
    const nextResume = normalizeResume(resume);
    saveDraft(nextResume);
    localStorage.setItem("resumeData", JSON.stringify(nextResume));
    setSaved("Saved locally");
    window.setTimeout(() => setSaved(""), 1800);
  };

  if (!resume) {
    return (
      <main style={styles.page}>
        <div style={styles.shell}>Loading CV...</div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.toolbar}>
          <button onClick={() => router.push("/")} style={styles.secondaryBtn}>
            Edit Details
          </button>
          <div style={styles.actions}>
            {saved && <span style={styles.saved}>{saved}</span>}
            <button onClick={saveResume} style={styles.secondaryBtn}>
              Save
            </button>
            <button
              onClick={() => exportResumePDF(resume, 96, template)}
              style={styles.primaryBtn}
            >
              Download PDF
            </button>
            <button
              onClick={() => exportResumeDOCX(resume, 96, template)}
              style={styles.primaryBtn}
            >
              Download DOCX
            </button>
          </div>
        </div>

        <ResumeDocument
          form={resume}
          ats={96}
          template={template}
          variant={variant}
        />
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "32px 16px 60px",
  },
  shell: {
    maxWidth: 980,
    margin: "0 auto",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  actions: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    border: "none",
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: 8,
    padding: "11px 14px",
    fontWeight: 800,
  },
  secondaryBtn: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: 8,
    padding: "11px 14px",
    fontWeight: 800,
  },
  saved: {
    color: "#047857",
    fontWeight: 800,
    fontSize: 13,
  },
};
