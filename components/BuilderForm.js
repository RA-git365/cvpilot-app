import { parseResume } from "../lib/parseResume";
import { improveResume } from "../lib/aiImprove";

const fields = [
  {
    name: "name",
    placeholder: "Full Name",
    type: "input",
  },
  {
    name: "role",
    placeholder: "Target Role",
    type: "input",
  },
  {
    name: "email",
    placeholder: "Email",
    type: "input",
  },
  {
    name: "phone",
    placeholder: "Phone",
    type: "input",
  },
  {
    name: "location",
    placeholder: "Location",
    type: "input",
  },
  {
    name: "linkedin",
    placeholder: "LinkedIn URL",
    type: "input",
  },
  {
    name: "portfolio",
    placeholder: "Portfolio / Website",
    type: "input",
  },
  {
    name: "summary",
    placeholder: "Professional Summary",
    rows: 4,
  },
  {
    name: "skills",
    placeholder: "Skills (comma separated or one per line)",
    rows: 3,
  },
  {
    name: "exp",
    placeholder: "Professional Experience",
    rows: 5,
  },
  {
    name: "projects",
    placeholder: "Projects",
    rows: 4,
  },
  {
    name: "education",
    placeholder: "Education",
    rows: 3,
  },
  {
    name: "certifications",
    placeholder: "Certifications",
    rows: 3,
  },
  {
    name: "achievements",
    placeholder: "Achievements",
    rows: 3,
  },
  {
    name: "languages",
    placeholder: "Languages",
    rows: 2,
  },
  {
    name: "jd",
    placeholder: "Paste Job Description for ATS scoring",
    rows: 3,
  },
];

export default function BuilderForm({
  form,
  setForm,
  runATS,
  saveResume,
  theme,
  allowAI = false,
}) {
  const handle = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const uploadResume =
    async (e) => {
      const file =
        e.target.files[0];

      if (!file) return;

      try {
        const text =
          await parseResume(
            file
          );

        setForm({
          ...form,
          summary:
            text.slice(
              0,
              700
            ),
          skills:
            "Imported Resume",
          exp:
            text.slice(
              700,
              1400
            ),
        });

        alert(
          "Resume imported ✅"
        );
      } catch {
        alert(
          "Unable to read file"
        );
      }
    };

  const improveAI =
    () => {
      if (!allowAI) {
        alert("AI tools are available only after login and paid pack subscription.");
        return;
      }

      const upgraded =
        improveResume(
          form
        );

      setForm(
        upgraded
      );

      alert(
        "Improved with AI 🚀"
      );
    };

  const generateAI =
    async () => {
      if (!allowAI) {
        alert("AI tools are available only after login and paid pack subscription.");
        return;
      }

      try {
        const res =
          await fetch(
            "/api/generate",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                name:
                  form.name,
                skills:
                  form.skills,
                experience:
                  form.exp,
                role:
                  form.role,
                jobDescription:
                  form.jd,
                template:
                  "modern",
                contact:
                  "Your Contact",
              }),
            }
          );

        const data =
          await res.json();

        if (
          data.result
        ) {
          setForm({
            ...form,
            summary:
              data.result,
          });

          alert(
            "AI Resume Generated 🚀"
          );
        } else {
          alert(
            "Generation failed"
          );
        }
      } catch {
        alert(
          "Server error"
        );
      }
    };

  return (
    <div
      className="cvp-builder-card"
      style={{
        padding: 22,
        borderRadius: 26,
        background:
          theme.card,
        border: `1px solid ${theme.border}`,
      }}
    >
      <h3
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 14,
        }}
      >
        Smart Resume Builder
      </h3>

      {!allowAI && (
        <p className="cvp-free-ai-note">
          Free templates include manual editing, ATS score, save, and exports.
          AI tools unlock after login and paid pack subscription.
        </p>
      )}

      {fields.map((field) =>
        field.type === "input" ? (
          <input
            className="cvp-field"
            key={field.name}
            name={field.name}
            value={form[field.name] || ""}
            onChange={handle}
            placeholder={field.placeholder}
            style={styles.input}
          />
        ) : (
          <textarea
            className="cvp-field"
            key={field.name}
            rows={field.rows}
            name={field.name}
            value={form[field.name] || ""}
            onChange={handle}
            placeholder={field.placeholder}
            style={styles.textarea}
          />
        )
      )}

      <label
        className="cvp-upload-btn"
        style={
          styles.uploadBtn
        }
      >
        Upload Resume
        <input
          type="file"
          hidden
          accept=".pdf,.docx"
          onChange={
            uploadResume
          }
        />
      </label>

      <div
        className="cvp-builder-actions"
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 12,
          marginTop: 14,
        }}
      >
        <button
          className="cvp-primary-action"
          onClick={runATS}
          style={
            styles.primaryBtn
          }
        >
          ATS
        </button>

        <button
          className="cvp-secondary-action"
          onClick={
            saveResume
          }
          style={
            styles.secondaryBtn
          }
        >
          Save
        </button>

        <button
          className="cvp-ai-action"
          onClick={
            improveAI
          }
          disabled={!allowAI}
          style={
            styles.aiBtn
          }
        >
          Improve AI
        </button>

        <button
          className="cvp-generate-action"
          onClick={
            generateAI
          }
          disabled={!allowAI}
          style={
            styles.generateBtn
          }
        >
          Generate AI
        </button>
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border:
      "1px solid #cbd5e1",
    marginTop: 10,
  },

  textarea: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border:
      "1px solid #cbd5e1",
    marginTop: 10,
    resize: "vertical",
  },

  uploadBtn: {
    display:
      "block",
    marginTop: 14,
    padding: 14,
    textAlign:
      "center",
    borderRadius: 14,
    background:
      "#eff6ff",
    color:
      "#2563eb",
    fontWeight: 700,
    cursor:
      "pointer",
  },

  primaryBtn: {
    padding: 14,
    borderRadius: 14,
    border: "none",
    background:
      "#2563eb",
    color: "#fff",
    fontWeight: 700,
  },

  secondaryBtn: {
    padding: 14,
    borderRadius: 14,
    border:
      "1px solid #cbd5e1",
    background:
      "#fff",
    fontWeight: 700,
  },

  aiBtn: {
    padding: 14,
    borderRadius: 14,
    border: "none",
    background:
      "#7c3aed",
    color: "#fff",
    fontWeight: 700,
  },

  generateBtn: {
    padding: 14,
    borderRadius: 14,
    border: "none",
    background:
      "#059669",
    color: "#fff",
    fontWeight: 700,
  },
};
