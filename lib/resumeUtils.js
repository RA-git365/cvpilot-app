const stopWords = new Set([
  "about",
  "across",
  "after",
  "also",
  "and",
  "are",
  "based",
  "been",
  "being",
  "candidate",
  "company",
  "experience",
  "from",
  "have",
  "into",
  "must",
  "our",
  "over",
  "required",
  "responsibilities",
  "role",
  "should",
  "skills",
  "that",
  "the",
  "their",
  "this",
  "with",
  "work",
  "will",
  "you",
  "your",
]);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeText(value = "") {
  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function extractKeywords(text = "", limit = 26) {
  const counts = new Map();

  normalizeText(text)
    .split(/[^a-z0-9+#.]+/i)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .forEach((word) => {
      counts.set(word, (counts.get(word) || 0) + 1);
    });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word]) => word);
}

function scoreKeywordMatch(resumeText, jdText) {
  const keywords = extractKeywords(jdText);

  if (keywords.length === 0) {
    return {
      score: 72,
      matchedKeywords: [],
      missingKeywords: [],
      keywordCount: 0,
    };
  }

  const normalizedResume = normalizeText(resumeText);
  const matchedKeywords = keywords.filter((word) => normalizedResume.includes(word));
  const missingKeywords = keywords.filter((word) => !normalizedResume.includes(word));

  return {
    score: clamp(Math.round((matchedKeywords.length / keywords.length) * 100), 28, 98),
    matchedKeywords,
    missingKeywords,
    keywordCount: keywords.length,
  };
}

function scoreSections(form = {}) {
  const required = [
    ["name", form.name],
    ["target role", form.role],
    ["email", form.email],
    ["phone", form.phone],
    ["summary", form.summary],
    ["skills", form.skills],
    ["experience", form.exp],
    ["education", form.education],
  ];
  const present = required.filter(([, value]) => String(value || "").trim()).length;

  return clamp(Math.round((present / required.length) * 100), 25, 100);
}

function scoreImpact(form = {}) {
  const impactText = `${form.summary || ""} ${form.exp || ""} ${form.projects || ""} ${
    form.achievements || ""
  }`;
  const metricCount = (impactText.match(/\d+%?|\b(increased|reduced|improved|saved|launched|delivered|automated|optimized|grew)\b/gi) || [])
    .length;

  return clamp(48 + metricCount * 9, 48, 96);
}

function scoreReadability(form = {}) {
  const resumeText = buildResumePlainText(form);
  const words = resumeText.split(/\s+/).filter(Boolean).length;
  const hasLongBlocks = [form.summary, form.exp, form.projects, form.achievements].some(
    (value) => String(value || "").length > 900
  );
  let score = 72;

  if (words >= 280 && words <= 850) score += 14;
  if (words > 850) score -= 12;
  if (hasLongBlocks) score -= 10;
  if (String(form.skills || "").split(/,|\n/).filter(Boolean).length >= 8) score += 8;

  return clamp(score, 38, 96);
}

export function buildResumePlainText(form = {}) {
  return [
    form.name,
    form.role,
    form.email,
    form.phone,
    form.location,
    form.linkedin,
    form.portfolio,
    form.summary,
    form.skills,
    form.exp,
    form.projects,
    form.education,
    form.certifications,
    form.achievements,
    form.languages,
  ]
    .filter(Boolean)
    .join("\n");
}

export function analyzeResume(form = {}) {
  const resumeText = buildResumePlainText(form);
  const keyword = scoreKeywordMatch(resumeText, form.jd);
  const sections = scoreSections(form);
  const impact = scoreImpact(form);
  const readability = scoreReadability(form);

  const categories = [
    {
      label: "Keyword match",
      score: keyword.score,
      weight: 35,
      summary: form.jd
        ? `${keyword.matchedKeywords.length} of ${keyword.keywordCount} important job keywords found.`
        : "Paste a job description to unlock role-specific keyword scoring.",
    },
    {
      label: "ATS structure",
      score: sections,
      weight: 25,
      summary: "Checks whether core resume sections and contact fields are complete.",
    },
    {
      label: "Impact evidence",
      score: impact,
      weight: 25,
      summary: "Looks for measurable outcomes, action verbs, and business results.",
    },
    {
      label: "Readability",
      score: readability,
      weight: 15,
      summary: "Balances resume length, scannability, and dense blocks of text.",
    },
  ];

  const score = clamp(
    Math.round(
      categories.reduce((total, item) => total + item.score * item.weight, 0) /
        categories.reduce((total, item) => total + item.weight, 0)
    ),
    30,
    98
  );

  const issues = [];
  const suggestions = [];

  if (!form.jd) {
    issues.push("Job description missing, so keyword scoring is using a generic baseline.");
    suggestions.push("Paste the target job description before applying to get a role-specific ATS score.");
  }

  if (keyword.missingKeywords.length > 0) {
    issues.push(`${keyword.missingKeywords.slice(0, 5).join(", ")} are missing from your resume.`);
    suggestions.push(
      `Naturally add ${keyword.missingKeywords.slice(0, 4).join(", ")} where they match your real experience.`
    );
  }

  if (sections < 85) {
    issues.push("Some core sections or contact details are incomplete.");
    suggestions.push("Complete contact details, skills, education, and experience before exporting.");
  }

  if (impact < 75) {
    issues.push("Experience needs more measurable outcomes.");
    suggestions.push("Rewrite bullets with action + result + metric, such as automated X to reduce Y by 30%.");
  }

  if (readability < 75) {
    issues.push("Some sections may be too thin, too long, or hard to scan.");
    suggestions.push("Use concise bullets, 8-14 focused skills, and clear section labels.");
  }

  return {
    score,
    categories,
    matchedKeywords: keyword.matchedKeywords,
    missingKeywords: keyword.missingKeywords,
    issues: issues.slice(0, 5),
    suggestions: suggestions.slice(0, 5),
    readiness:
      score >= 85
        ? "Ready to apply"
        : score >= 70
          ? "Almost ready"
          : "Needs improvement",
  };
}

export function calculateATS(resumeText, jdText) {
  return analyzeResume({
    summary: resumeText,
    jd: jdText,
  }).score;
}

export function saveDraft(data) {
  localStorage.setItem(
    "cvpilot_draft",
    JSON.stringify(data)
  );
}

export function loadDraft() {
  const raw =
    localStorage.getItem("cvpilot_draft");

  return raw ? JSON.parse(raw) : null;
}
