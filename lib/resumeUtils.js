export function calculateATS(resumeText, jdText) {
  if (!jdText) return 75;

  const words = jdText
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3);

  const unique = [...new Set(words)];

  let match = 0;

  unique.forEach((word) => {
    if (resumeText.toLowerCase().includes(word)) {
      match++;
    }
  });

  const score = Math.round(
    (match / unique.length) * 100
  );

  if (score < 35) return 35;
  if (score > 98) return 98;

  return score;
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