import { useMemo, useState } from "react";

import { parseResume } from "../lib/parseResume";
import { improveResume } from "../lib/aiImprove";
import { buildResumePlainText } from "../lib/resumeUtils";

const fieldGroups = [
  {
    title: "Profile",
    helper: "Recruiters should understand who you are in the first five seconds.",
    fields: [
      { name: "name", label: "Full name", type: "input" },
      { name: "role", label: "Target role", type: "input" },
      { name: "email", label: "Email", type: "input" },
      { name: "phone", label: "Phone", type: "input" },
      { name: "location", label: "Location", type: "input" },
      { name: "linkedin", label: "LinkedIn URL", type: "input" },
      { name: "portfolio", label: "Portfolio or website", type: "input" },
    ],
  },
  {
    title: "Resume Content",
    helper: "Keep copy specific, measurable, and easy to scan.",
    fields: [
      { name: "summary", label: "Professional summary", rows: 4 },
      { name: "skills", label: "Skills", rows: 3 },
      { name: "exp", label: "Professional experience", rows: 6 },
      { name: "projects", label: "Projects", rows: 4 },
      { name: "education", label: "Education", rows: 3 },
      { name: "certifications", label: "Certifications", rows: 3 },
      { name: "achievements", label: "Achievements", rows: 3 },
      { name: "languages", label: "Languages", rows: 2 },
    ],
  },
  {
    title: "Job Match",
    helper: "Paste a job description to score keywords and tailoring gaps.",
    fields: [{ name: "jd", label: "Target job description", rows: 5 }],
  },
];

function ScoreMeter({ score }) {
  return (
    <div className="cvp-score-meter" aria-label={`ATS score ${score}%`}>
      <div style={{ width: `${score}%` }} />
    </div>
  );
}

function KeywordList({ title, items, empty, tone }) {
  return (
    <div className="cvp-keyword-block">
      <strong>{title}</strong>
      <div className="cvp-keyword-list">
        {items.length > 0 ? (
          items.slice(0, 10).map((item) => (
            <span key={item} className={`cvp-keyword-chip ${tone}`}>
              {item}
            </span>
          ))
        ) : (
          <p>{empty}</p>
        )}
      </div>
    </div>
  );
}

const searchableSections = [
  ["summary", "Summary"],
  ["skills", "Skills"],
  ["exp", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["certifications", "Certifications"],
  ["achievements", "Achievements"],
  ["languages", "Languages"],
];

const mediaFields = [
  {
    name: "photoImage",
    label: "Candidate photo",
    accept: "image/png,image/jpeg,image/webp",
    helper: "Used only by selected premium visual templates.",
  },
  {
    name: "signatureImage",
    label: "Scanned signature",
    accept: "image/png,image/jpeg,image/webp",
    helper: "Best with a clean white or transparent background.",
  },
];

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseSearchKeywords(value = "") {
  const seen = new Set();

  return String(value)
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    })
    .slice(0, 18);
}

function countMatches(text = "", keyword = "") {
  const pattern = new RegExp(escapePattern(keyword), "gi");
  return String(text || "").match(pattern)?.length || 0;
}

function buildKeywordSearchResults(form, keywords) {
  const resumeText = buildResumePlainText(form);

  return keywords.map((keyword) => {
    const sections = searchableSections
      .map(([key, label]) => ({
        label,
        count: countMatches(form[key], keyword),
      }))
      .filter((section) => section.count > 0);

    return {
      keyword,
      count: countMatches(resumeText, keyword),
      sections,
    };
  });
}

function readImageDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function KeywordSearchPanel({ form, analysis }) {
  const [query, setQuery] = useState("");
  const keywords = useMemo(() => parseSearchKeywords(query), [query]);
  const results = useMemo(() => buildKeywordSearchResults(form, keywords), [form, keywords]);
  const foundCount = results.filter((item) => item.count > 0).length;
  const missingCount = results.filter((item) => item.count === 0).length;
  const totalMatches = results.reduce((total, item) => total + item.count, 0);

  const useKeywords = (items) => {
    setQuery(items.slice(0, 12).join(", "));
  };

  return (
    <section className="cvp-keyword-search" id="keywords">
      <div className="cvp-keyword-search-head">
        <div>
          <span>Keyword finder</span>
          <h3>Search resume keywords</h3>
          <p>
            Check exact skills, tools, job-title words, and ATS phrases across your CV before exporting.
          </p>
        </div>
        <div className="cvp-keyword-score">
          <strong>{keywords.length ? `${foundCount}/${keywords.length}` : "0/0"}</strong>
          <span>found</span>
        </div>
      </div>

      <label className="cvp-keyword-search-box">
        <span>Keywords to find</span>
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          rows={3}
          placeholder="Example: Salesforce, Apex, LWC, REST API"
        />
      </label>

      <div className="cvp-keyword-search-actions">
        <button
          type="button"
          onClick={() => useKeywords(analysis.missingKeywords)}
          disabled={analysis.missingKeywords.length === 0}
        >
          Search Missing JD Keywords
        </button>
        <button
          type="button"
          onClick={() => useKeywords(analysis.matchedKeywords)}
          disabled={analysis.matchedKeywords.length === 0}
        >
          Search Matched JD Keywords
        </button>
        <button type="button" onClick={() => setQuery("")} disabled={!query}>
          Clear
        </button>
      </div>

      <div className="cvp-keyword-search-summary">
        <div>
          <strong>{foundCount}</strong>
          <span>keywords found</span>
        </div>
        <div>
          <strong>{missingCount}</strong>
          <span>keywords missing</span>
        </div>
        <div>
          <strong>{totalMatches}</strong>
          <span>total matches</span>
        </div>
      </div>

      <div className="cvp-keyword-results">
        {results.length > 0 ? (
          results.map((item) => (
            <article
              key={item.keyword}
              className={`cvp-keyword-result ${item.count > 0 ? "found" : "missing"}`}
            >
              <div>
                <strong>{item.keyword}</strong>
                <span>{item.count > 0 ? `${item.count} match${item.count === 1 ? "" : "es"}` : "Missing"}</span>
              </div>
              <p>
                {item.sections.length > 0
                  ? item.sections.map((section) => `${section.label} (${section.count})`).join(", ")
                  : "Add this only if it honestly matches your experience."}
              </p>
            </article>
          ))
        ) : (
          <p className="cvp-keyword-empty">
            Type keywords above or use the job-description keyword shortcuts.
          </p>
        )}
      </div>
    </section>
  );
}

function normalizeImportedText(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/\u2022/g, "-")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function readSection(text, starts, ends = []) {
  const startPattern = starts.filter(Boolean).map(escapePattern).join("|");
  const endPattern = ends.filter(Boolean).map(escapePattern).join("|");

  if (!startPattern) return "";

  const pattern = endPattern
    ? `(?:${startPattern})\\s*:?\\s*([\\s\\S]*?)(?=\\n\\s*(?:${endPattern})\\s*:?|$)`
    : `(?:${startPattern})\\s*:?\\s*([\\s\\S]*)`;
  const match = text.match(new RegExp(pattern, "i"));

  return match?.[1]?.trim() || "";
}

function readContact(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone =
    text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0]?.replace(/\s+/g, " ").trim() || "";
  const name = lines[0]?.replace(/\s{2,}.*/, "").trim() || "";
  const locationLine = lines.find(
    (line, index) =>
      index > 0 &&
      index < 5 &&
      !line.match(/mobile|phone|email/i) &&
      !line.includes("@")
  );

  return {
    name,
    email,
    phone,
    location: locationLine || "",
  };
}

function readRole(text, lines) {
  const roleLine =
    lines.find((line) => line.match(/developer|engineer|manager|analyst|consultant|coordinator/i)) ||
    "";

  return roleLine.replace(/:$/, "").trim();
}

function buildImportedResume(form, rawText) {
  const text = normalizeImportedText(rawText);
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const contact = readContact(text);
  const role = readRole(text, lines);
  const summary =
    readSection(text, ["Professional Summary", "Summary", role], ["Professional Experience", "Experience"]) ||
    text.slice(0, 700);

  return {
    ...form,
    name: contact.name || form.name,
    email: contact.email || form.email,
    phone: contact.phone || form.phone,
    location: contact.location || form.location,
    role: role || form.role,
    summary: summary || form.summary,
    exp:
      readSection(text, ["Professional Experience", "Experience"], ["Projects Summary", "Projects", "Education"]) ||
      form.exp,
    projects: readSection(text, ["Projects Summary", "Projects"], ["Education"]) || form.projects,
    education:
      readSection(text, ["Education"], ["Certifications", "Technical Skills", "Skills", "Languages"]) ||
      form.education,
    certifications:
      readSection(text, ["Certifications"], ["Technical Skills", "Skills", "Languages"]) ||
      form.certifications,
    skills: readSection(text, ["Technical Skills", "Skills"], ["Languages", "Interest", "Interests"]) || form.skills,
    languages: readSection(text, ["Languages"], ["Interest", "Interests"]) || form.languages,
  };
}

export default function BuilderForm({
  form,
  setForm,
  runATS,
  saveResume,
  analysis,
  allowAI = false,
}) {
  const handle = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const uploadMedia = async (fieldName, event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > 900 * 1024) {
      alert("Please use an image below 900 KB so the resume stays fast to preview and save.");
      return;
    }

    try {
      const image = await readImageDataUrl(file);

      setForm({
        ...form,
        [fieldName]: image,
      });
    } catch (error) {
      console.error(error);
      alert("Could not read this image. Try another file.");
    } finally {
      event.target.value = "";
    }
  };

  const removeMedia = (fieldName) => {
    setForm({
      ...form,
      [fieldName]: "",
    });
  };

  const uploadResume = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const text = await parseResume(file);

      setForm(buildImportedResume(form, text));

      alert("Resume imported successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to read this file. Try a PDF or DOCX resume.");
    }
  };

  const improveAI = () => {
    if (!allowAI) {
      alert("AI suggestions unlock after login and paid pack subscription.");
      return;
    }

    setForm(improveResume(form, analysis));
    alert("Resume copy improved with premium suggestions.");
  };

  const generateAI = async () => {
    if (!allowAI) {
      alert("AI generation unlocks after login and paid pack subscription.");
      return;
    }

    try {
      const response = await fetch("/app/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          skills: form.skills,
          experience: form.exp,
          role: form.role,
          jobDescription: form.jd,
          template: "modern",
          contact: [form.email, form.phone, form.linkedin].filter(Boolean).join(" | "),
        }),
      });

      const data = await response.json();

      if (data.result) {
        setForm({
          ...form,
          summary: data.result,
        });

        alert("AI resume draft generated.");
      } else {
        alert(data.error || "Generation failed.");
      }
    } catch {
      alert("AI server error.");
    }
  };

  return (
    <section className="cvp-builder-card" id="builder">
      <div className="cvp-builder-head">
        <div>
          <span>Guided builder</span>
          <h2>Upload, analyze, improve, export</h2>
          <p>
            Edit every section before download. The score updates from the content and
            target job description.
          </p>
        </div>

        <div className="cvp-score-tile">
          <strong>{analysis.score}%</strong>
          <span>{analysis.readiness}</span>
        </div>
      </div>

      <div className="cvp-builder-toolbar">
        <label className="cvp-upload-btn">
          Upload CV
          <input type="file" hidden accept=".pdf,.docx" onChange={uploadResume} />
        </label>
        <button className="cvp-primary-action" onClick={runATS}>
          Analyze ATS
        </button>
        <button className="cvp-secondary-action" onClick={saveResume}>
          Save Draft
        </button>
      </div>

      <div className="cvp-analysis-panel">
        <div className="cvp-analysis-topline">
          <strong>ATS breakdown</strong>
          <span>{analysis.score}/100</span>
        </div>
        <ScoreMeter score={analysis.score} />

        <div className="cvp-breakdown-grid">
          {analysis.categories.map((item) => (
            <article key={item.label} className="cvp-breakdown-item">
              <div>
                <strong>{item.label}</strong>
                <span>{item.weight}% weight</span>
              </div>
              <b>{item.score}</b>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>

        <div className="cvp-keyword-grid">
          <KeywordList
            title="Matched keywords"
            items={analysis.matchedKeywords}
            empty="Paste a job description to compare keywords."
            tone="matched"
          />
          <KeywordList
            title="Missing keywords"
            items={analysis.missingKeywords}
            empty="No major keyword gaps detected."
            tone="missing"
          />
        </div>

        {analysis.suggestions.length > 0 && (
          <div className="cvp-suggestion-list">
            <strong>Fix suggestions</strong>
            {analysis.suggestions.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        )}
      </div>

      <KeywordSearchPanel form={form} analysis={analysis} />

      {!allowAI && (
        <div className="cvp-premium-note">
          <strong>Premium AI locked</strong>
          <p>
            Free users can upload, edit, score, preview, and export. Premium unlocks AI
            rewrites, deeper tailoring, and paid template packs.
          </p>
        </div>
      )}

      <div className="cvp-ai-actions">
        <button className="cvp-ai-action" onClick={improveAI} disabled={!allowAI}>
          Improve With AI
        </button>
        <button className="cvp-generate-action" onClick={generateAI} disabled={!allowAI}>
          Generate AI Draft
        </button>
      </div>

      <section className="cvp-form-group">
        <div className="cvp-form-group-head">
          <h3>Template assets</h3>
          <p>
            Upload optional files that appear only inside resume templates and exports.
          </p>
        </div>

        <div className="cvp-media-grid">
          {mediaFields.map((field) => (
            <article key={field.name} className="cvp-media-card">
              <div className={`cvp-media-status ${form[field.name] ? "added" : ""}`}>
                <span>{form[field.name] ? "Added" : "Empty"}</span>
              </div>
              <div>
                <strong>{field.label}</strong>
                <p>{field.helper}</p>
                <div className="cvp-media-actions">
                  <label>
                    Upload
                    <input
                      type="file"
                      hidden
                      accept={field.accept}
                      onChange={(event) => uploadMedia(field.name, event)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeMedia(field.name)}
                    disabled={!form[field.name]}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="cvp-form-groups">
        {fieldGroups.map((group) => (
          <section key={group.title} className="cvp-form-group">
            <div className="cvp-form-group-head">
              <h3>{group.title}</h3>
              <p>{group.helper}</p>
            </div>

            <div className="cvp-field-grid">
              {group.fields.map((field) => (
                <label
                  key={field.name}
                  className={field.type === "input" ? "cvp-field-wrap" : "cvp-field-wrap wide"}
                >
                  <span>{field.label}</span>
                  {field.type === "input" ? (
                    <input
                      className="cvp-field"
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handle}
                      placeholder={field.label}
                    />
                  ) : (
                    <textarea
                      className="cvp-field"
                      rows={field.rows}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handle}
                      placeholder={field.label}
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
