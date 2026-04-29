"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ResumeDocument from "../../../components/ResumeDocument";
import { exportResumeDOCX } from "../../../lib/exportDocx";
import { exportResumePDF } from "../../../lib/exportPdf";
import { defaultResume, normalizeResume } from "../../../lib/resumeData";
import { saveDraft } from "../../../lib/resumeUtils";

const templateStyles = {
  "free-modern": {
    color: "#2563eb",
    accentDark: "#0f172a",
    bg: "#f1f5f9",
    variant: "classic",
  },
  "professional-two-column": {
    color: "#1d4ed8",
    accentDark: "#1e3a8a",
    bg: "#eff6ff",
    variant: "sidebar",
  },
  "blue-corporate": {
    color: "#1d4ed8",
    accentDark: "#1d4ed8",
    bg: "#eff6ff",
    variant: "classic",
  },
  "minimal-fresher": {
    color: "#16a34a",
    accentDark: "#15803d",
    bg: "#f0fdf4",
    variant: "classic",
  },
  "smart-sidebar": {
    color: "#7c3aed",
    accentDark: "#6d28d9",
    bg: "#f5f3ff",
    variant: "sidebar",
  },
  "bold-skills": {
    color: "#dc2626",
    accentDark: "#b91c1c",
    bg: "#fef2f2",
    variant: "sidebar",
  },
  "elegant-entry": {
    color: "#ea580c",
    accentDark: "#c2410c",
    bg: "#fff7ed",
    variant: "classic",
  },
  "premium-ats": {
    color: "#059669",
    accentDark: "#047857",
    bg: "#ecfdf5",
    variant: "classic",
  },
  "executive-modern": {
    color: "#334155",
    accentDark: "#1e293b",
    bg: "#f8fafc",
    variant: "sidebar",
  },
  "finance-sharp": {
    color: "#047857",
    accentDark: "#065f46",
    bg: "#ecfdf5",
    variant: "classic",
  },
  "consultant-style": {
    color: "#78716c",
    accentDark: "#57534e",
    bg: "#fafaf9",
    variant: "classic",
  },
  "global-pro": {
    color: "#4f46e5",
    accentDark: "#4338ca",
    bg: "#eef2ff",
    variant: "classic",
  },
  "sales-impact": {
    color: "#e11d48",
    accentDark: "#be123c",
    bg: "#fff1f2",
    variant: "classic",
  },
  "creative-clean": {
    color: "#0891b2",
    accentDark: "#0e7490",
    bg: "#ecfeff",
    variant: "sidebar",
  },
  "black-gold": {
    color: "#ca8a04",
    accentDark: "#111827",
    bg: "#fefce8",
    variant: "sidebar",
  },
  "ceo-luxury": {
    color: "#b45309",
    accentDark: "#78350f",
    bg: "#fffbeb",
    variant: "classic",
  },
  "royal-executive": {
    color: "#7c3aed",
    accentDark: "#4c1d95",
    bg: "#f5f3ff",
    variant: "sidebar",
  },
  "director-premium": {
    color: "#475569",
    accentDark: "#334155",
    bg: "#f8fafc",
    variant: "sidebar",
  },
  "silicon-elite": {
    color: "#06b6d4",
    accentDark: "#0e7490",
    bg: "#ecfeff",
    variant: "classic",
  },
  "tech-dark": {
    color: "#2563eb",
    accentDark: "#0f172a",
    bg: "#eff6ff",
    variant: "sidebar",
  },
  "platinum-pro": {
    color: "#6b7280",
    accentDark: "#374151",
    bg: "#f9fafb",
    variant: "classic",
  },
  "manager-x": {
    color: "#4338ca",
    accentDark: "#3730a3",
    bg: "#eef2ff",
    variant: "sidebar",
  },
  "international-max": {
    color: "#0284c7",
    accentDark: "#0369a1",
    bg: "#f0f9ff",
    variant: "classic",
  },
};

export default function TemplateBySlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || "free-modern";
  const [resume, setResume] = useState(null);
  const [ats] = useState(96);
  const [savedMessage, setSavedMessage] = useState("");

  const template = useMemo(
    () => ({
      name: String(slug),
      ...(templateStyles[slug] || templateStyles["free-modern"]),
    }),
    [slug]
  );

  useEffect(() => {
    const saved =
      localStorage.getItem("resumeData") || localStorage.getItem("cvpilot_draft");

    if (!saved) {
      setResume(defaultResume);
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setResume(normalizeResume(parsed));
    } catch {
      setResume(defaultResume);
    }
  }, []);

  const saveCurrentResume = () => {
    const nextResume = normalizeResume(resume);
    saveDraft(nextResume);
    localStorage.setItem("resumeData", JSON.stringify(nextResume));
    setSavedMessage("Saved locally");
    window.setTimeout(() => setSavedMessage(""), 1800);
  };

  if (!resume) {
    return (
      <main style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <h1 style={styles.loadingTitle}>Loading Template</h1>
          <p style={styles.muted}>Preparing your CV.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ ...styles.page, background: template.bg }}>
      <div style={styles.shell}>
        <div style={styles.toolbar}>
          <button onClick={() => router.push("/")} style={styles.secondaryBtn}>
            Edit Details
          </button>

          <div style={styles.actions}>
            {savedMessage && <span style={styles.saved}>{savedMessage}</span>}
            <button onClick={saveCurrentResume} style={styles.secondaryBtn}>
              Save
            </button>
            <button
              onClick={() => exportResumePDF(resume, ats, template)}
              style={styles.primaryBtn}
            >
              Download PDF
            </button>
            <button
              onClick={() => exportResumeDOCX(resume, ats, template)}
              style={styles.primaryBtn}
            >
              Download DOCX
            </button>
          </div>
        </div>

        <ResumeDocument
          form={resume}
          ats={ats}
          template={template}
          variant={template.variant}
        />
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px 16px 60px",
  },
  shell: {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    marginBottom: 18,
    flexWrap: "wrap",
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
  loadingPage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f1f5f9",
    padding: 16,
  },
  loadingCard: {
    background: "#ffffff",
    padding: 32,
    borderRadius: 16,
    boxShadow: "0 20px 25px rgba(15, 23, 42, 0.12)",
    textAlign: "center",
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 8,
  },
  muted: {
    color: "#64748b",
  },
};
