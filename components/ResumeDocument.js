import {
  getContactItems,
  getResumeSections,
  normalizeResume,
} from "../lib/resumeData";

const designByTemplate = {
  "free-modern": {
    mode: "modern",
    accent: "#2563eb",
    dark: "#0f172a",
    soft: "#eff6ff",
    font: "Inter, Arial, sans-serif",
  },
  "professional-two-column": {
    mode: "sidebar",
    accent: "#0f172a",
    dark: "#111827",
    soft: "#f1f5f9",
  },
  "blue-corporate": {
    mode: "corporate",
    accent: "#1d4ed8",
    dark: "#172554",
    soft: "#dbeafe",
  },
  "minimal-fresher": {
    mode: "minimal",
    accent: "#16a34a",
    dark: "#14532d",
    soft: "#dcfce7",
  },
  "smart-sidebar": {
    mode: "sidebar",
    accent: "#7c3aed",
    dark: "#2e1065",
    soft: "#ede9fe",
  },
  "bold-skills": {
    mode: "skills",
    accent: "#dc2626",
    dark: "#7f1d1d",
    soft: "#fee2e2",
  },
  "elegant-entry": {
    mode: "editorial",
    accent: "#ea580c",
    dark: "#7c2d12",
    soft: "#ffedd5",
    font: "Georgia, serif",
  },
  "premium-ats": {
    mode: "ats",
    accent: "#059669",
    dark: "#064e3b",
    soft: "#d1fae5",
  },
  "executive-modern": {
    mode: "executive",
    accent: "#334155",
    dark: "#020617",
    soft: "#e2e8f0",
  },
  "finance-sharp": {
    mode: "finance",
    accent: "#047857",
    dark: "#022c22",
    soft: "#ccfbf1",
  },
  "consultant-style": {
    mode: "consultant",
    accent: "#78716c",
    dark: "#292524",
    soft: "#f5f5f4",
  },
  "global-pro": {
    mode: "global",
    accent: "#4f46e5",
    dark: "#312e81",
    soft: "#e0e7ff",
  },
  "sales-impact": {
    mode: "impact",
    accent: "#e11d48",
    dark: "#881337",
    soft: "#ffe4e6",
  },
  "creative-clean": {
    mode: "creative",
    accent: "#0891b2",
    dark: "#164e63",
    soft: "#cffafe",
  },
  "black-gold": {
    mode: "dark",
    accent: "#ca8a04",
    dark: "#020617",
    soft: "#fef3c7",
  },
  "ceo-luxury": {
    mode: "luxury",
    accent: "#b45309",
    dark: "#1c1917",
    soft: "#ffedd5",
    font: "Georgia, serif",
  },
  "royal-executive": {
    mode: "royal",
    accent: "#7c3aed",
    dark: "#1e1b4b",
    soft: "#ede9fe",
  },
  "director-premium": {
    mode: "director",
    accent: "#475569",
    dark: "#0f172a",
    soft: "#f1f5f9",
  },
  "silicon-elite": {
    mode: "tech",
    accent: "#06b6d4",
    dark: "#083344",
    soft: "#cffafe",
  },
  "tech-dark": {
    mode: "dark",
    accent: "#38bdf8",
    dark: "#020617",
    soft: "#0f172a",
  },
  "platinum-pro": {
    mode: "platinum",
    accent: "#6b7280",
    dark: "#111827",
    soft: "#f3f4f6",
  },
  "manager-x": {
    mode: "manager",
    accent: "#4338ca",
    dark: "#1e1b4b",
    soft: "#eef2ff",
  },
  "international-max": {
    mode: "global",
    accent: "#0284c7",
    dark: "#0c4a6e",
    soft: "#e0f2fe",
  },
  "architect-pro": {
    mode: "blueprint",
    accent: "#0f172a",
    dark: "#020617",
    soft: "#e2e8f0",
  },
};

function getDesign(template = {}, variant) {
  const base = designByTemplate[template.name] || {};
  const accent = template.color || template.accent || base.accent || "#2563eb";

  if (variant === "sidebar" && !base.mode) {
    return {
      mode: "sidebar",
      accent,
      dark: template.accentDark || "#0f172a",
      soft: `${accent}12`,
    };
  }

  return {
    mode: base.mode || "modern",
    accent,
    dark: template.accentDark || base.dark || "#0f172a",
    soft: base.soft || `${accent}12`,
    font: base.font || "Inter, Arial, sans-serif",
  };
}

function splitSectionGroups(sections) {
  const sideTitles = ["Skills", "Education", "Certifications", "Languages"];
  return {
    side: sections.filter((section) => sideTitles.includes(section.title)),
    main: sections.filter((section) => !sideTitles.includes(section.title)),
  };
}

export default function ResumeDocument({
  form,
  ats,
  template,
  variant = "classic",
  compact = false,
}) {
  const resume = normalizeResume(form);
  const sections = getResumeSections(resume);
  const contact = getContactItems(resume);
  const design = getDesign(template, variant);
  const groups = splitSectionGroups(sections);
  const pageStyle = getPageStyle(design, compact);

  const renderSection = (section, options = {}) => (
    <section key={section.title} style={getSectionStyle(design, options)}>
      <h2 style={getSectionTitleStyle(design, options)}>{section.title}</h2>
      {section.list ? (
        <div style={getSkillGridStyle(design, options)}>
          {section.list.map((item) => (
            <span key={item} style={getSkillPillStyle(design, options)}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p style={getBodyTextStyle(design, options)}>{section.value}</p>
      )}
    </section>
  );

  const header = (
    <header style={getHeaderStyle(design)}>
      <div>
        <p style={getEyebrowStyle(design)}>CVPilot Resume</p>
        <h1 style={getNameStyle(design)}>{resume.name}</h1>
        <p style={getRoleStyle(design)}>{resume.role}</p>
      </div>
      {typeof ats === "number" && (
        <div style={getScoreStyle(design)}>
          <strong>{ats}%</strong>
          <span>ATS</span>
        </div>
      )}
    </header>
  );

  const contactBar = contact.length > 0 && (
    <div style={getContactStyle(design)}>
      {contact.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );

  if (["sidebar", "executive", "director", "manager", "royal"].includes(design.mode)) {
    return (
      <article style={pageStyle}>
        {header}
        {contactBar}
        <div style={getTwoColumnStyle(design)}>
          <aside style={getSidebarStyle(design)}>
            {groups.side.map((section) => renderSection(section, { sidebar: true }))}
          </aside>
          <main style={styles.mainColumn}>
            {groups.main.map((section) => renderSection(section))}
          </main>
        </div>
      </article>
    );
  }

  if (["dark", "luxury", "tech", "blueprint"].includes(design.mode)) {
    return (
      <article style={pageStyle}>
        <div style={getDarkHeroStyle(design)}>
          {header}
          {contactBar}
        </div>
        <main style={styles.singleColumn}>
          {sections.map((section) => renderSection(section))}
        </main>
      </article>
    );
  }

  if (["skills", "impact", "creative"].includes(design.mode)) {
    const skills = sections.find((section) => section.title === "Skills");
    const rest = sections.filter((section) => section.title !== "Skills");

    return (
      <article style={pageStyle}>
        {header}
        {contactBar}
        {skills && (
          <section style={getFeatureBandStyle(design)}>
            {renderSection(skills, { feature: true })}
          </section>
        )}
        <main style={styles.singleColumn}>{rest.map((section) => renderSection(section))}</main>
      </article>
    );
  }

  if (["finance", "consultant", "global"].includes(design.mode)) {
    return (
      <article style={pageStyle}>
        {header}
        {contactBar}
        <main style={getTimelineStyle(design)}>
          {sections.map((section, index) =>
            renderSection(section, { timeline: true, index })
          )}
        </main>
      </article>
    );
  }

  return (
    <article style={pageStyle}>
      {header}
      {contactBar}
      <main style={styles.singleColumn}>{sections.map((section) => renderSection(section))}</main>
    </article>
  );
}

function getPageStyle(design, compact) {
  const isDark = ["dark", "tech", "blueprint"].includes(design.mode);

  return {
    ...styles.document,
    minHeight: compact ? 760 : 1040,
    background: isDark ? design.dark : "#ffffff",
    color: isDark ? "#e5e7eb" : "#0f172a",
    fontFamily: design.font,
    borderColor: isDark ? "#1e293b" : "#e2e8f0",
  };
}

function getHeaderStyle(design) {
  const base = {
    ...styles.header,
    borderTopColor: design.accent,
  };

  const modes = {
    corporate: {
      background: design.dark,
      color: "#ffffff",
      borderTop: "0",
      borderBottom: `7px solid ${design.accent}`,
    },
    minimal: {
      display: "block",
      borderTop: "0",
      borderBottom: `2px solid ${design.accent}`,
      paddingBottom: 18,
    },
    editorial: {
      display: "block",
      textAlign: "center",
      borderTop: "0",
      borderBottom: `1px solid ${design.accent}`,
      paddingTop: 46,
    },
    ats: {
      borderTop: "0",
      borderLeft: `12px solid ${design.accent}`,
      background: "#ffffff",
    },
    executive: {
      background: design.dark,
      color: "#ffffff",
      borderTop: "0",
    },
    director: {
      background: "linear-gradient(90deg,#0f172a,#475569)",
      color: "#ffffff",
      borderTop: "0",
    },
    manager: {
      background: design.soft,
      borderTop: `12px solid ${design.accent}`,
    },
    royal: {
      background: design.dark,
      color: "#ffffff",
      borderTop: `8px solid ${design.accent}`,
    },
  };

  return {
    ...base,
    ...(modes[design.mode] || {}),
  };
}

function getDarkHeroStyle(design) {
  return {
    background:
      design.mode === "luxury"
        ? `linear-gradient(135deg,${design.dark},#78350f)`
        : `linear-gradient(135deg,${design.dark},#0f172a)`,
    color: "#ffffff",
  };
}

function getNameStyle(design) {
  return {
    ...styles.name,
    color: ["dark", "tech", "blueprint", "luxury"].includes(design.mode)
      ? "#ffffff"
      : "inherit",
    fontSize: design.mode === "editorial" || design.mode === "luxury" ? 44 : 38,
    textTransform: design.mode === "blueprint" ? "uppercase" : "none",
  };
}

function getRoleStyle(design) {
  return {
    ...styles.role,
    color: ["corporate", "executive", "director", "royal", "dark", "tech", "blueprint", "luxury"].includes(
      design.mode
    )
      ? "#dbeafe"
      : design.dark,
  };
}

function getEyebrowStyle(design) {
  return {
    marginBottom: 9,
    color: ["corporate", "executive", "director", "royal", "dark", "tech", "blueprint", "luxury"].includes(
      design.mode
    )
      ? design.soft
      : design.accent,
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
  };
}

function getScoreStyle(design) {
  const darkScore = ["corporate", "executive", "director", "royal", "dark", "tech", "blueprint", "luxury"].includes(
    design.mode
  );

  return {
    ...styles.score,
    borderColor: darkScore ? design.soft : design.accent,
    background: darkScore ? "rgba(255,255,255,0.08)" : "#ffffff",
    color: darkScore ? "#ffffff" : design.dark,
  };
}

function getContactStyle(design) {
  const darkContact = ["dark", "tech", "blueprint", "luxury"].includes(design.mode);

  return {
    ...styles.contact,
    background: darkContact ? "#0f172a" : design.soft,
    color: darkContact ? "#e2e8f0" : design.dark,
    borderBottomColor: darkContact ? "#1e293b" : "#e2e8f0",
    justifyContent: design.mode === "editorial" ? "center" : "flex-start",
  };
}

function getTwoColumnStyle(design) {
  const sidebarWidth = design.mode === "manager" ? "38%" : "31%";

  return {
    ...styles.twoColumn,
    gridTemplateColumns: `minmax(190px, ${sidebarWidth}) minmax(0, 1fr)`,
  };
}

function getSidebarStyle(design) {
  return {
    ...styles.sidebar,
    background: design.mode === "royal" ? design.dark : design.soft,
    color: design.mode === "royal" ? "#ffffff" : "#0f172a",
    borderRightColor: design.accent,
  };
}

function getSectionStyle(design, options = {}) {
  return {
    ...styles.section,
    ...(options.timeline
      ? {
          borderLeft: `3px solid ${design.accent}`,
          paddingLeft: 18,
          position: "relative",
        }
      : {}),
    ...(options.feature ? { marginBottom: 0 } : {}),
  };
}

function getSectionTitleStyle(design, options = {}) {
  const isDark = ["dark", "tech", "blueprint"].includes(design.mode);

  return {
    ...styles.sectionTitle,
    color: options.sidebar && design.mode === "royal" ? "#ffffff" : isDark ? "#f8fafc" : design.dark,
    borderBottomColor: options.timeline ? "transparent" : design.accent,
    background: design.mode === "ats" ? design.soft : "transparent",
    padding: design.mode === "ats" ? "7px 9px" : "0 0 7px",
  };
}

function getBodyTextStyle(design, options = {}) {
  const isDark = ["dark", "tech", "blueprint"].includes(design.mode);

  return {
    ...styles.bodyText,
    color: options.sidebar && design.mode === "royal" ? "#ddd6fe" : isDark ? "#cbd5e1" : "#334155",
  };
}

function getSkillGridStyle(design) {
  return {
    ...styles.skillGrid,
    gap: design.mode === "skills" || design.mode === "impact" ? 10 : 8,
  };
}

function getSkillPillStyle(design, options = {}) {
  const darkPill = ["dark", "tech", "blueprint"].includes(design.mode);

  return {
    ...styles.skillPill,
    borderColor: options.feature ? "transparent" : design.accent,
    background: options.feature ? design.accent : darkPill ? "#111827" : "#ffffff",
    color: options.feature ? "#ffffff" : darkPill ? "#e2e8f0" : "#334155",
  };
}

function getFeatureBandStyle(design) {
  return {
    padding: "24px 38px",
    background: design.soft,
    borderBottom: "1px solid #e2e8f0",
  };
}

function getTimelineStyle() {
  return {
    ...styles.singleColumn,
    paddingLeft: 50,
  };
}

const styles = {
  document: {
    width: "100%",
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    padding: "34px 38px 22px",
    borderTop: "10px solid",
    borderBottom: "1px solid #e2e8f0",
  },
  name: {
    fontSize: 38,
    lineHeight: 1.1,
    fontWeight: 900,
    margin: 0,
    letterSpacing: 0,
  },
  role: {
    fontSize: 18,
    fontWeight: 800,
    marginTop: 8,
  },
  score: {
    width: 74,
    height: 74,
    border: "2px solid",
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    alignContent: "center",
    flexShrink: 0,
  },
  contact: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px 18px",
    padding: "14px 38px",
    borderBottom: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: 13,
    fontWeight: 700,
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 32%) minmax(0, 1fr)",
  },
  sidebar: {
    padding: 28,
    borderRight: "1px solid #e2e8f0",
  },
  mainColumn: {
    padding: 32,
  },
  singleColumn: {
    padding: 38,
  },
  section: {
    marginBottom: 24,
    breakInside: "avoid",
  },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 7,
    marginBottom: 10,
    fontWeight: 900,
  },
  bodyText: {
    whiteSpace: "pre-line",
    color: "#334155",
    lineHeight: 1.7,
    fontSize: 14,
  },
  skillGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  skillPill: {
    border: "1px solid",
    borderRadius: 6,
    padding: "6px 9px",
    color: "#334155",
    background: "#ffffff",
    fontSize: 12,
    fontWeight: 800,
  },
};
