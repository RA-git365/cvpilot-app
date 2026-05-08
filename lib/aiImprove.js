function sentence(value = "") {
  return String(value).trim().replace(/\s+/g, " ");
}

function addUniqueSkills(current = "", additions = []) {
  const existing = String(current)
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const normalized = new Set(existing.map((item) => item.toLowerCase()));

  additions.forEach((item) => {
    if (!normalized.has(item.toLowerCase())) {
      existing.push(item);
      normalized.add(item.toLowerCase());
    }
  });

  return existing.join(", ");
}

export function improveResume(form, analysis = {}) {
  const role = sentence(form.role || "target role");
  const missingKeywords = analysis.missingKeywords || [];
  const keywordPhrase = missingKeywords.length
    ? ` with exposure to ${missingKeywords.slice(0, 3).join(", ")}`
    : "";

  const improvedSummary = form.summary
    ? `${sentence(form.summary)} Positioned for ${role}${keywordPhrase}, with a focus on measurable delivery, stakeholder communication, and business impact.`
    : `Outcome-focused ${role} professional with strengths in execution, collaboration, and measurable problem solving.`;

  const improvedExp = form.exp
    ? `${String(form.exp).trim()}\n- Delivered measurable improvements by translating business requirements into reliable, user-ready solutions.\n- Partnered with cross-functional teams to reduce manual work, improve adoption, and maintain delivery quality.`
    : "- Delivered measurable improvements by translating business requirements into reliable, user-ready solutions.\n- Partnered with cross-functional teams to reduce manual work, improve adoption, and maintain delivery quality.";

  const improvedAchievements = form.achievements
    ? `${String(form.achievements).trim()}\nImproved recruiter relevance by aligning resume language to the target role and job description.`
    : "Improved recruiter relevance by aligning resume language to the target role and job description.";

  return {
    ...form,
    summary: improvedSummary,
    exp: improvedExp,
    skills: addUniqueSkills(form.skills, [
      "Stakeholder Management",
      "Process Improvement",
      "Problem Solving",
      ...missingKeywords.slice(0, 4),
    ]),
    achievements: improvedAchievements,
  };
}
