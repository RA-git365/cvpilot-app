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
    tint: "#f8fbff",
    line: "#bfdbfe",
    font: "Inter, Arial, sans-serif",
    personality: "crisp",
  },
  "professional-two-column": {
    mode: "sidebar",
    accent: "#0f172a",
    dark: "#111827",
    soft: "#f1f5f9",
    tint: "#f8fafc",
    line: "#cbd5e1",
    personality: "structured",
  },
  "blue-corporate": {
    mode: "corporate",
    accent: "#1d4ed8",
    dark: "#172554",
    soft: "#dbeafe",
    tint: "#f8fbff",
    line: "#93c5fd",
    personality: "boardroom",
  },
  "minimal-fresher": {
    mode: "minimal",
    accent: "#16a34a",
    dark: "#14532d",
    soft: "#dcfce7",
    tint: "#fbfefc",
    line: "#86efac",
    personality: "clean",
  },
  "smart-sidebar": {
    mode: "sidebar",
    accent: "#7c3aed",
    dark: "#2e1065",
    soft: "#ede9fe",
    tint: "#fbfaff",
    line: "#c4b5fd",
    personality: "smart",
  },
  "bold-skills": {
    mode: "skills",
    accent: "#dc2626",
    dark: "#7f1d1d",
    soft: "#fee2e2",
    tint: "#fffafa",
    line: "#fca5a5",
    personality: "impact",
  },
  "elegant-entry": {
    mode: "editorial",
    accent: "#ea580c",
    dark: "#7c2d12",
    soft: "#ffedd5",
    tint: "#fffaf5",
    line: "#fed7aa",
    font: "Georgia, 'Times New Roman', serif",
    personality: "editorial",
  },
  "premium-ats": {
    mode: "ats",
    accent: "#059669",
    dark: "#064e3b",
    soft: "#d1fae5",
    tint: "#fbfffd",
    line: "#6ee7b7",
    personality: "precision",
  },
  "executive-modern": {
    mode: "executive",
    accent: "#334155",
    dark: "#020617",
    soft: "#e2e8f0",
    tint: "#f8fafc",
    line: "#94a3b8",
    personality: "executive",
  },
  "finance-sharp": {
    mode: "finance",
    accent: "#047857",
    dark: "#022c22",
    soft: "#ccfbf1",
    tint: "#f7fffc",
    line: "#5eead4",
    personality: "analytic",
  },
  "consultant-style": {
    mode: "consultant",
    accent: "#78716c",
    dark: "#292524",
    soft: "#f5f5f4",
    tint: "#fdfcfb",
    line: "#d6d3d1",
    personality: "consulting",
  },
  "global-pro": {
    mode: "global",
    accent: "#4f46e5",
    dark: "#312e81",
    soft: "#e0e7ff",
    tint: "#fafaff",
    line: "#a5b4fc",
    personality: "international",
  },
  "sales-impact": {
    mode: "impact",
    accent: "#e11d48",
    dark: "#881337",
    soft: "#ffe4e6",
    tint: "#fffafb",
    line: "#fda4af",
    personality: "results",
  },
  "creative-clean": {
    mode: "creative",
    accent: "#0891b2",
    dark: "#164e63",
    soft: "#cffafe",
    tint: "#f7feff",
    line: "#67e8f9",
    personality: "creative",
  },
  "black-gold": {
    mode: "dark",
    accent: "#ca8a04",
    dark: "#020617",
    soft: "#fef3c7",
    tint: "#111827",
    line: "#854d0e",
    personality: "luxury",
  },
  "ceo-luxury": {
    mode: "luxury",
    accent: "#b45309",
    dark: "#1c1917",
    soft: "#ffedd5",
    tint: "#fff7ed",
    line: "#fdba74",
    font: "Georgia, 'Times New Roman', serif",
    personality: "luxury",
  },
  "royal-executive": {
    mode: "royal",
    accent: "#7c3aed",
    dark: "#1e1b4b",
    soft: "#ede9fe",
    tint: "#f8f7ff",
    line: "#a78bfa",
    personality: "royal",
  },
  "director-premium": {
    mode: "director",
    accent: "#475569",
    dark: "#0f172a",
    soft: "#f1f5f9",
    tint: "#ffffff",
    line: "#cbd5e1",
    personality: "director",
  },
  "silicon-elite": {
    mode: "tech",
    accent: "#06b6d4",
    dark: "#083344",
    soft: "#cffafe",
    tint: "#ecfeff",
    line: "#67e8f9",
    personality: "tech",
  },
  "tech-dark": {
    mode: "tech-dark",
    accent: "#38bdf8",
    dark: "#020617",
    soft: "#0f172a",
    tint: "#0b1220",
    line: "#075985",
    personality: "tech",
  },
  "platinum-pro": {
    mode: "platinum",
    accent: "#6b7280",
    dark: "#111827",
    soft: "#f3f4f6",
    tint: "#ffffff",
    line: "#d1d5db",
    personality: "platinum",
  },
  "manager-x": {
    mode: "manager",
    accent: "#4338ca",
    dark: "#1e1b4b",
    soft: "#eef2ff",
    tint: "#fbfbff",
    line: "#a5b4fc",
    personality: "manager",
  },
  "international-max": {
    mode: "global",
    accent: "#0284c7",
    dark: "#0c4a6e",
    soft: "#e0f2fe",
    tint: "#f7fcff",
    line: "#7dd3fc",
    personality: "international",
  },
  "architect-pro": {
    mode: "blueprint",
    accent: "#0f172a",
    dark: "#020617",
    soft: "#e2e8f0",
    tint: "#f8fafc",
    line: "#94a3b8",
    personality: "blueprint",
  },
};

const sectionMeta = {
  "Professional Summary": { label: "Profile", priority: "01" },
  Skills: { label: "Expertise", priority: "02" },
  "Professional Experience": { label: "Experience", priority: "03" },
  Projects: { label: "Projects", priority: "04" },
  Education: { label: "Education", priority: "05" },
  Certifications: { label: "Credentials", priority: "06" },
  Achievements: { label: "Impact", priority: "07" },
  Languages: { label: "Languages", priority: "08" },
};

const sidebarTitles = ["Skills", "Education", "Certifications", "Languages"];
const darkModes = ["dark", "tech", "tech-dark", "blueprint", "luxury"];
const heroDarkModes = ["corporate", "executive", "director", "royal", ...darkModes];
const twoColumnModes = ["sidebar", "executive", "director", "manager", "royal", "platinum"];
const featureModes = ["skills", "impact", "creative"];
const timelineModes = ["finance", "consultant", "global", "ats"];

function getDesign(template = {}, variant) {
  const base = designByTemplate[template.name] || {};
  const accent = template.color || template.accent || base.accent || "#2563eb";

  if (variant === "sidebar" && !base.mode) {
    return {
      mode: "sidebar",
      accent,
      dark: template.accentDark || "#0f172a",
      soft: `${accent}14`,
      tint: "#ffffff",
      line: `${accent}55`,
      personality: "structured",
      font: "Inter, Arial, sans-serif",
    };
  }

  return {
    mode: base.mode || "modern",
    accent,
    dark: template.accentDark || base.dark || "#0f172a",
    soft: base.soft || `${accent}14`,
    tint: base.tint || "#ffffff",
    line: base.line || `${accent}55`,
    font: base.font || "Inter, Arial, sans-serif",
    personality: base.personality || "crisp",
  };
}

function splitSectionGroups(sections) {
  return {
    side: sections.filter((section) => sidebarTitles.includes(section.title)),
    main: sections.filter((section) => !sidebarTitles.includes(section.title)),
  };
}

function getSectionLabel(title) {
  return sectionMeta[title]?.label || title;
}

function getSectionNumber(title) {
  return sectionMeta[title]?.priority || "";
}

function isDarkMode(design) {
  return darkModes.includes(design.mode);
}

function isHeroDark(design) {
  return heroDarkModes.includes(design.mode);
}

function parseLines(value = "") {
  return String(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeBullet(line) {
  return line.replace(/^[-*]\s*/, "").trim();
}

function getContactLabel(index) {
  return ["Email", "Phone", "Location", "LinkedIn", "Portfolio"][index] || "Contact";
}

function getInitials(name = "") {
  const parts = String(name)
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return `${parts[0]?.[0] || "C"}${parts[1]?.[0] || "V"}`.toUpperCase();
}

function uniqueValues(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function getImpactHighlights(resume) {
  const text = [resume.summary, resume.exp, resume.projects, resume.achievements]
    .filter(Boolean)
    .join(" ");
  const highlights = [];
  const years = text.match(/\b\d+\+?\s*(?:years?|yrs?)\b/i)?.[0];
  const percentages = uniqueValues(text.match(/\b\d+(?:\.\d+)?%\b/g) || []);

  if (years) {
    highlights.push({ value: years, label: "Experience" });
  }

  percentages.slice(0, 2).forEach((value, index) => {
    highlights.push({ value, label: index === 0 ? "Measured impact" : "Efficiency gain" });
  });

  if (highlights.length < 3) {
    uniqueValues(String(resume.skills || "").split(/,|\n/))
      .slice(0, 3 - highlights.length)
      .forEach((skill) => highlights.push({ value: skill, label: "Core strength" }));
  }

  return highlights.slice(0, 3);
}

function supportsPhoto(design) {
  return Boolean(design.mode);
}

function supportsSignature(design) {
  return Boolean(design.mode);
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
  const impactHighlights = getImpactHighlights(resume);
  const showPhoto = supportsPhoto(design) && Boolean(resume.photoImage);
  const showSignature = supportsSignature(design) && Boolean(resume.signatureImage);

  const renderSectionBody = (section, options = {}) => {
    if (section.list) {
      return (
        <div style={getSkillGridStyle(design, options)}>
          {section.list.map((item) => (
            <span key={item} style={getSkillPillStyle(design, options)}>
              {item}
            </span>
          ))}
        </div>
      );
    }

    const lines = parseLines(section.value);
    const shouldList =
      lines.length > 1 &&
      (section.title.includes("Experience") ||
        section.title === "Projects" ||
        section.title === "Achievements" ||
        lines.every((line) => /^[-*]/.test(line)));

    if (shouldList) {
      return (
        <ul style={getBulletListStyle(design, options)}>
          {lines.map((line) => (
            <li key={line} style={getBulletItemStyle(design, options)}>
              {normalizeBullet(line)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div style={getParagraphWrapStyle(design, options)}>
        {lines.length > 0 ? (
          lines.map((line) => (
            <p key={line} style={getBodyTextStyle(design, options)}>
              {line}
            </p>
          ))
        ) : (
          <p style={getBodyTextStyle(design, options)}>{section.value}</p>
        )}
      </div>
    );
  };

  const renderSection = (section, options = {}) => (
    <section key={section.title} style={getSectionStyle(design, options)}>
      <div style={getSectionTitleRowStyle(design, options)}>
        {options.timeline && <span style={getTimelineDotStyle(design)} />}
        {options.numbered && <b style={getSectionNumberStyle(design)}>{getSectionNumber(section.title)}</b>}
        <h2 style={getSectionTitleStyle(design, options)}>{getSectionLabel(section.title)}</h2>
      </div>
      {renderSectionBody(section, options)}
    </section>
  );

  const header = (
    <header style={getHeaderStyle(design)}>
      <div style={getIdentityRowStyle(design)}>
        <div style={getProfileMarkStyle(design, showPhoto)}>
          {showPhoto ? (
            <img src={resume.photoImage} alt="" style={styles.profilePhoto} />
          ) : (
            getInitials(resume.name)
          )}
        </div>
        <div style={styles.identity}>
          <p style={getEyebrowStyle(design)}>{getHeaderEyebrow(design)}</p>
          <h1 style={getNameStyle(design)}>{resume.name}</h1>
          <p style={getRoleStyle(design)}>{resume.role}</p>
        </div>
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
      {contact.map((item, index) => (
        <span key={item} style={getContactChipStyle(design)}>
          <b style={getContactLabelStyle(design)}>{getContactLabel(index)}</b>
          {item}
        </span>
      ))}
    </div>
  );

  const signatureBlock = showSignature && (
    <section style={getSignatureStyle(design)}>
      <h2 style={getSignatureTitleStyle(design)}>Declaration</h2>
      <p style={getDeclarationTextStyle(design)}>
        I hereby declare that the information provided above is true and correct to the best of my knowledge.
      </p>
      <div style={styles.signatureRow}>
        <img src={resume.signatureImage} alt="" style={getSignatureImageStyle(design)} />
        <span style={getSignatureLabelStyle(design)}>{resume.name}</span>
      </div>
    </section>
  );

  const impactStrip = impactHighlights.length > 0 && (
    <div style={getImpactStripStyle(design)}>
      {impactHighlights.map((item) => (
        <div key={`${item.value}-${item.label}`} style={getImpactItemStyle(design)}>
          <strong style={getImpactValueStyle(design)}>{item.value}</strong>
          <span style={getImpactLabelStyle(design)}>{item.label}</span>
        </div>
      ))}
    </div>
  );

  if (twoColumnModes.includes(design.mode)) {
    return (
      <article style={pageStyle}>
        {header}
        {contactBar}
        {impactStrip}
        <div style={getTwoColumnStyle(design)}>
          <aside style={getSidebarStyle(design)}>
            {groups.side.map((section) => renderSection(section, { sidebar: true }))}
          </aside>
          <main style={styles.mainColumn}>
            {groups.main.map((section) => renderSection(section, { numbered: design.mode !== "sidebar" }))}
            {signatureBlock}
          </main>
        </div>
      </article>
    );
  }

  if (darkModes.includes(design.mode)) {
    return (
      <article style={pageStyle}>
        <div style={getDarkHeroStyle(design)}>
          {header}
          {contactBar}
          {impactStrip}
        </div>
        <main style={getSingleColumnStyle(design)}>
          {sections.map((section) => renderSection(section, { numbered: design.mode === "blueprint" }))}
          {signatureBlock}
        </main>
      </article>
    );
  }

  if (featureModes.includes(design.mode)) {
    const skills = sections.find((section) => section.title === "Skills");
    const rest = sections.filter((section) => section.title !== "Skills");

    return (
      <article style={pageStyle}>
        {header}
        {contactBar}
        {impactStrip}
        {skills && (
          <section style={getFeatureBandStyle(design)}>
            {renderSection(skills, { feature: true })}
          </section>
        )}
        <main style={getSingleColumnStyle(design)}>
          {rest.map((section) => renderSection(section, { numbered: design.mode === "impact" }))}
          {signatureBlock}
        </main>
      </article>
    );
  }

  if (timelineModes.includes(design.mode)) {
    return (
      <article style={pageStyle}>
        {header}
        {contactBar}
        {impactStrip}
        <main style={getTimelineStyle(design)}>
          {sections.map((section) => renderSection(section, { timeline: true }))}
          {signatureBlock}
        </main>
      </article>
    );
  }

  return (
    <article style={pageStyle}>
      {header}
      {contactBar}
      {impactStrip}
      <main style={getSingleColumnStyle(design)}>
        {sections.map((section) => renderSection(section, { numbered: design.mode === "minimal" }))}
        {signatureBlock}
      </main>
    </article>
  );
}

function getPageStyle(design, compact) {
  const dark = isDarkMode(design);

  return {
    ...styles.document,
    minHeight: compact ? 760 : 1040,
    background: dark ? design.dark : "#ffffff",
    color: dark ? "#e5e7eb" : "#0f172a",
    fontFamily: design.font,
    borderColor: dark ? "#1e293b" : "#e2e8f0",
    boxShadow: dark
      ? "0 24px 55px rgba(2, 6, 23, 0.34)"
      : "0 22px 55px rgba(15, 23, 42, 0.14)",
  };
}

function getHeaderEyebrow(design) {
  const copy = {
    luxury: "Executive Portfolio",
    blueprint: "Technical Profile",
    "tech-dark": "Engineering Resume",
    tech: "Technology Profile",
    finance: "Finance Profile",
    consultant: "Consulting Profile",
    global: "Global CV",
    ats: "ATS Optimized",
    editorial: "Candidate Profile",
  };

  return copy[design.mode] || "Professional Resume";
}

function getHeaderStyle(design) {
  const base = {
    ...styles.header,
    borderTopColor: design.accent,
  };

  const modes = {
    corporate: {
      background: `linear-gradient(135deg, ${design.dark}, #1e3a8a)`,
      color: "#ffffff",
      borderTop: "0",
      borderBottom: `8px solid ${design.accent}`,
      padding: "40px 42px 28px",
    },
    minimal: {
      display: "block",
      borderTop: "0",
      borderBottom: `2px solid ${design.accent}`,
      paddingBottom: 20,
    },
    editorial: {
      display: "block",
      textAlign: "center",
      borderTop: "0",
      borderBottom: `1px solid ${design.line}`,
      paddingTop: 48,
      paddingBottom: 28,
    },
    ats: {
      borderTop: "0",
      borderLeft: `12px solid ${design.accent}`,
      background: "#ffffff",
      paddingLeft: 30,
    },
    executive: {
      background: `linear-gradient(135deg, ${design.dark}, #1f2937)`,
      color: "#ffffff",
      borderTop: "0",
    },
    director: {
      background: `linear-gradient(90deg, ${design.dark}, #475569)`,
      color: "#ffffff",
      borderTop: "0",
    },
    manager: {
      background: `linear-gradient(135deg, ${design.soft}, #ffffff)`,
      borderTop: `12px solid ${design.accent}`,
    },
    royal: {
      background: `linear-gradient(135deg, ${design.dark}, #312e81)`,
      color: "#ffffff",
      borderTop: `8px solid ${design.accent}`,
    },
    platinum: {
      background: "#ffffff",
      borderTop: `12px solid ${design.accent}`,
    },
  };

  return {
    ...base,
    ...(modes[design.mode] || {}),
  };
}

function getIdentityRowStyle(design) {
  return {
    ...styles.identityRow,
    justifyContent: design.mode === "editorial" ? "center" : "flex-start",
    textAlign: design.mode === "editorial" ? "center" : "left",
  };
}

function getProfileMarkStyle(design, hasPhoto = false) {
  const dark = isHeroDark(design);

  return {
    ...styles.profileMark,
    width: hasPhoto ? 46 : styles.profileMark.width,
    height: hasPhoto ? 58 : styles.profileMark.height,
    padding: hasPhoto ? 3 : 0,
    borderColor: dark ? "rgba(255,255,255,0.45)" : design.line,
    background: dark ? "rgba(255,255,255,0.10)" : design.soft,
    color: dark ? "#ffffff" : design.accent,
    boxShadow: dark ? "none" : `inset 0 -4px 0 ${design.line}`,
  };
}

function getDarkHeroStyle(design) {
  const accentWash =
    design.mode === "luxury"
      ? "#78350f"
      : design.mode === "tech" || design.mode === "tech-dark"
        ? "#075985"
        : "#0f172a";

  return {
    background: `linear-gradient(135deg, ${design.dark}, ${accentWash})`,
    color: "#ffffff",
    borderBottom: `1px solid ${design.line}`,
  };
}

function getImpactStripStyle(design) {
  const dark = isDarkMode(design);

  return {
    ...styles.impactStrip,
    background: dark ? "rgba(15,23,42,0.92)" : `linear-gradient(90deg, ${design.tint}, #ffffff)`,
    borderTopColor: dark ? "rgba(255,255,255,0.10)" : "#e2e8f0",
    borderBottomColor: dark ? "rgba(255,255,255,0.10)" : "#e2e8f0",
  };
}

function getImpactItemStyle(design) {
  const dark = isDarkMode(design);

  return {
    ...styles.impactItem,
    borderColor: dark ? "rgba(255,255,255,0.12)" : design.line,
    background: dark ? "rgba(255,255,255,0.06)" : "#ffffff",
  };
}

function getImpactValueStyle(design) {
  return {
    ...styles.impactValue,
    color: isDarkMode(design) ? "#ffffff" : design.dark,
  };
}

function getImpactLabelStyle(design) {
  return {
    ...styles.impactLabel,
    color: isDarkMode(design) ? design.soft : design.accent,
  };
}

function getSignatureStyle(design) {
  const dark = isDarkMode(design);

  return {
    ...styles.signature,
    borderColor: dark ? "rgba(255,255,255,0.12)" : design.line,
    background: dark ? "rgba(255,255,255,0.05)" : design.tint,
  };
}

function getSignatureImageStyle() {
  return styles.signatureImage;
}

function getSignatureTitleStyle(design) {
  return {
    ...styles.signatureTitle,
    color: isDarkMode(design) ? "#f8fafc" : design.dark,
    borderBottomColor: isDarkMode(design) ? "rgba(255,255,255,0.16)" : design.line,
  };
}

function getDeclarationTextStyle(design) {
  return {
    ...styles.declarationText,
    color: isDarkMode(design) ? "#cbd5e1" : "#334155",
  };
}

function getSignatureLabelStyle(design) {
  return {
    ...styles.signatureLabel,
    color: isDarkMode(design) ? "#e5e7eb" : design.dark,
  };
}

function getNameStyle(design) {
  const serif = design.mode === "editorial" || design.mode === "luxury";

  return {
    ...styles.name,
    color: isHeroDark(design) ? "#ffffff" : "inherit",
    fontSize: serif ? 44 : design.mode === "minimal" ? 36 : 39,
    fontWeight: serif ? 800 : 950,
    textTransform: design.mode === "blueprint" ? "uppercase" : "none",
  };
}

function getRoleStyle(design) {
  return {
    ...styles.role,
    color: isHeroDark(design) ? "#dbeafe" : design.dark,
  };
}

function getEyebrowStyle(design) {
  return {
    marginBottom: 9,
    color: isHeroDark(design) ? design.soft : design.accent,
    fontSize: 10,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
  };
}

function getScoreStyle(design) {
  const darkScore = isHeroDark(design);

  return {
    ...styles.score,
    borderColor: darkScore ? "rgba(255,255,255,0.54)" : design.accent,
    background: darkScore ? "rgba(255,255,255,0.10)" : design.tint,
    color: darkScore ? "#ffffff" : design.dark,
  };
}

function getContactStyle(design) {
  const darkContact = isDarkMode(design);

  return {
    ...styles.contact,
    background: darkContact ? "#0f172a" : design.tint,
    color: darkContact ? "#e2e8f0" : design.dark,
    borderBottomColor: darkContact ? "#1e293b" : "#e2e8f0",
    justifyContent: design.mode === "editorial" ? "center" : "flex-start",
  };
}

function getContactChipStyle(design) {
  const dark = isDarkMode(design);

  return {
    ...styles.contactChip,
    background: dark ? "rgba(255,255,255,0.06)" : "#ffffff",
    borderColor: dark ? "rgba(255,255,255,0.14)" : design.line,
    color: dark ? "#e5e7eb" : "#1f2937",
  };
}

function getContactLabelStyle(design) {
  return {
    color: isDarkMode(design) ? design.soft : design.accent,
  };
}

function getTwoColumnStyle(design) {
  const sidebarWidth = design.mode === "manager" ? "37%" : design.mode === "platinum" ? "29%" : "31%";

  return {
    ...styles.twoColumn,
    gridTemplateColumns: `minmax(190px, ${sidebarWidth}) minmax(0, 1fr)`,
  };
}

function getSidebarStyle(design) {
  const royal = design.mode === "royal";

  return {
    ...styles.sidebar,
    background: royal ? design.dark : `linear-gradient(180deg, ${design.soft}, ${design.tint})`,
    color: royal ? "#ffffff" : "#0f172a",
    borderRightColor: royal ? "rgba(255,255,255,0.14)" : design.line,
  };
}

function getSingleColumnStyle(design) {
  return {
    ...styles.singleColumn,
    background:
      design.mode === "modern"
        ? `linear-gradient(180deg, ${design.tint}, #ffffff 160px)`
        : "transparent",
  };
}

function getSectionStyle(design, options = {}) {
  const timeline = options.timeline;
  const carded = design.mode === "modern" && !options.sidebar;

  return {
    ...styles.section,
    ...(timeline
      ? {
          borderLeft: `2px solid ${design.line}`,
          paddingLeft: 20,
          position: "relative",
        }
      : {}),
    ...(options.feature ? { marginBottom: 0 } : {}),
    ...(carded
      ? {
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "18px 20px",
          boxShadow: "0 8px 22px rgba(15, 23, 42, 0.06)",
        }
      : {}),
  };
}

function getSectionTitleRowStyle(design, options = {}) {
  return {
    ...styles.sectionTitleRow,
    alignItems: options.timeline ? "center" : "baseline",
    gap: options.numbered ? 10 : 8,
  };
}

function getSectionNumberStyle(design) {
  return {
    color: design.accent,
    fontSize: 12,
    fontWeight: 950,
  };
}

function getTimelineDotStyle(design) {
  return {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: design.accent,
    border: "2px solid #ffffff",
    boxShadow: `0 0 0 3px ${design.soft}`,
    position: "absolute",
    left: -6,
  };
}

function getSectionTitleStyle(design, options = {}) {
  const dark = isDarkMode(design);
  const royalSidebar = options.sidebar && design.mode === "royal";

  return {
    ...styles.sectionTitle,
    color: royalSidebar ? "#ffffff" : dark ? "#f8fafc" : design.dark,
    borderBottomColor: options.timeline ? "transparent" : design.line,
    background: design.mode === "ats" ? design.soft : "transparent",
    padding: design.mode === "ats" ? "7px 9px" : "0 0 7px",
  };
}

function getParagraphWrapStyle() {
  return styles.paragraphWrap;
}

function getBodyTextStyle(design, options = {}) {
  const dark = isDarkMode(design);

  return {
    ...styles.bodyText,
    color: options.sidebar && design.mode === "royal" ? "#ddd6fe" : dark ? "#cbd5e1" : "#334155",
  };
}

function getBulletListStyle(design, options = {}) {
  return {
    ...styles.bulletList,
    color: options.sidebar && design.mode === "royal" ? "#ddd6fe" : isDarkMode(design) ? "#cbd5e1" : "#334155",
  };
}

function getBulletItemStyle(design) {
  return {
    ...styles.bulletItem,
    color: isDarkMode(design) ? "#cbd5e1" : "#334155",
  };
}

function getSkillGridStyle(design, options = {}) {
  return {
    ...styles.skillGrid,
    gap: options.feature || design.mode === "impact" ? 10 : 8,
  };
}

function getSkillPillStyle(design, options = {}) {
  const dark = isDarkMode(design);
  const royalSidebar = options.sidebar && design.mode === "royal";

  return {
    ...styles.skillPill,
    borderColor: options.feature ? "transparent" : royalSidebar ? "rgba(255,255,255,0.22)" : design.line,
    background: options.feature ? design.accent : dark || royalSidebar ? "rgba(255,255,255,0.07)" : "#ffffff",
    color: options.feature ? "#ffffff" : dark || royalSidebar ? "#e2e8f0" : "#334155",
  };
}

function getFeatureBandStyle(design) {
  return {
    padding: "24px 38px",
    background: `linear-gradient(135deg, ${design.soft}, ${design.tint})`,
    borderBottom: `1px solid ${design.line}`,
  };
}

function getTimelineStyle() {
  return {
    ...styles.singleColumn,
    paddingLeft: 52,
  };
}

const styles = {
  document: {
    width: "100%",
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 22,
    padding: "36px 40px 24px",
    borderTop: "10px solid",
    borderBottom: "1px solid #e2e8f0",
  },
  identity: {
    minWidth: 0,
  },
  identityRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    minWidth: 0,
  },
  profileMark: {
    width: 54,
    height: 54,
    border: "1px solid",
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    fontSize: 17,
    fontWeight: 950,
    overflow: "hidden",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 5,
  },
  name: {
    fontSize: 39,
    lineHeight: 1.08,
    fontWeight: 950,
    margin: 0,
    letterSpacing: 0,
  },
  role: {
    fontSize: 18,
    fontWeight: 850,
    marginTop: 8,
  },
  score: {
    width: 78,
    height: 78,
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
    gap: "8px 10px",
    padding: "14px 38px",
    borderBottom: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: 12,
    fontWeight: 750,
  },
  contactChip: {
    display: "inline-flex",
    gap: 7,
    alignItems: "center",
    border: "1px solid",
    borderRadius: 8,
    padding: "7px 9px",
    maxWidth: "100%",
  },
  impactStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
    padding: "14px 38px",
    borderTop: "1px solid",
    borderBottom: "1px solid",
  },
  impactItem: {
    border: "1px solid",
    borderRadius: 8,
    padding: "10px 12px",
    minWidth: 0,
  },
  impactValue: {
    display: "block",
    fontSize: 17,
    lineHeight: 1.1,
    fontWeight: 950,
  },
  impactLabel: {
    display: "block",
    marginTop: 4,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 32%) minmax(0, 1fr)",
  },
  sidebar: {
    padding: 30,
    borderRight: "1px solid #e2e8f0",
  },
  mainColumn: {
    padding: 34,
  },
  singleColumn: {
    padding: 38,
  },
  section: {
    marginBottom: 24,
    breakInside: "avoid",
  },
  sectionTitleRow: {
    display: "flex",
    position: "relative",
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 7,
    marginBottom: 11,
    fontWeight: 950,
    width: "100%",
  },
  paragraphWrap: {
    display: "grid",
    gap: 8,
  },
  bodyText: {
    whiteSpace: "pre-line",
    color: "#334155",
    lineHeight: 1.68,
    fontSize: 14,
    margin: 0,
  },
  bulletList: {
    display: "grid",
    gap: 8,
    margin: 0,
    paddingLeft: 18,
    listStyle: "disc",
    lineHeight: 1.58,
    fontSize: 14,
  },
  bulletItem: {
    paddingLeft: 2,
  },
  skillGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  skillPill: {
    border: "1px solid",
    borderRadius: 8,
    padding: "7px 10px",
    color: "#334155",
    background: "#ffffff",
    fontSize: 12,
    fontWeight: 850,
  },
  signature: {
    display: "grid",
    gap: 8,
    marginTop: 8,
    padding: "14px 16px",
    border: "1px solid",
    borderRadius: 8,
    breakInside: "avoid",
  },
  signatureTitle: {
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    borderBottom: "1px solid",
    paddingBottom: 7,
    margin: 0,
    fontWeight: 950,
  },
  declarationText: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.55,
  },
  signatureRow: {
    display: "inline-grid",
    justifyItems: "start",
    gap: 4,
    marginTop: 2,
  },
  signatureImage: {
    width: 138,
    height: 42,
    objectFit: "contain",
    mixBlendMode: "multiply",
  },
  signatureLabel: {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
};

