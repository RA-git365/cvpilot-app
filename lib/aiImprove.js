export function improveResume(
  form
) {
  const improvedSummary = form.summary
    ? `${form.summary} Proven ability to deliver scalable business solutions, optimize workflows, and collaborate across teams to achieve measurable results.`
    : "";

  const improvedExp = form.exp
    ? `${form.exp} Successfully handled critical responsibilities, improved productivity, and delivered high-quality outcomes under deadlines.`
    : "";

  const improvedSkills = form.skills
    ? form.skills +
      ", Leadership, Problem Solving, Communication"
    : "";

  return {
    ...form,
    summary:
      improvedSummary,
    exp: improvedExp,
    skills:
      improvedSkills,
  };
}