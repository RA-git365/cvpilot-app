export const defaultResume = {
  name: "Your Name",
  role: "Target Role",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  portfolio: "",
  summary: "",
  skills: "",
  exp: "",
  projects: "",
  education: "",
  certifications: "",
  languages: "",
  achievements: "",
  photoImage: "",
  signatureImage: "",
  jd: "",
};

export function normalizeResume(form = {}) {
  const merged = {
    ...defaultResume,
    ...form,
  };

  return {
    ...merged,
    name: merged.name || merged.fullName || defaultResume.name,
    exp: merged.exp || merged.experience || "",
  };
}

export function splitList(value = "") {
  return String(value)
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getResumeSections(form = {}) {
  const resume = normalizeResume(form);

  return [
    {
      title: "Professional Summary",
      value: resume.summary,
    },
    {
      title: "Skills",
      value: resume.skills,
      list: splitList(resume.skills),
    },
    {
      title: "Professional Experience",
      value: resume.exp,
    },
    {
      title: "Projects",
      value: resume.projects,
    },
    {
      title: "Education",
      value: resume.education,
    },
    {
      title: "Certifications",
      value: resume.certifications,
      list: splitList(resume.certifications),
    },
    {
      title: "Achievements",
      value: resume.achievements,
    },
    {
      title: "Languages",
      value: resume.languages,
      list: splitList(resume.languages),
    },
  ].filter((section) => {
    if (section.list) return section.list.length > 0;
    return Boolean(String(section.value || "").trim());
  });
}

export function getContactItems(form = {}) {
  const resume = normalizeResume(form);

  return [
    resume.email,
    resume.phone,
    resume.location,
    resume.linkedin,
    resume.portfolio,
  ].filter(Boolean);
}

export function buildResumeText(form = {}, ats) {
  const resume = normalizeResume(form);
  const lines = [
    resume.name,
    resume.role,
    getContactItems(resume).join(" | "),
    "",
  ];

  getResumeSections(resume).forEach((section) => {
    lines.push(section.title.toUpperCase());
    lines.push(section.list ? section.list.join(", ") : section.value);
    lines.push("");
  });

  if (typeof ats === "number") {
    lines.push(`ATS SCORE: ${ats}%`);
  }

  return lines.filter((line, index) => line || lines[index - 1]).join("\n");
}
