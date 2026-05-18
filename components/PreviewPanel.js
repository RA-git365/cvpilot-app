import { exportResumePDF } from "../lib/exportPdf";
import { exportResumeDOCX } from "../lib/exportDocx";
import { buildResumeText } from "../lib/resumeData";
import ResumeDocument from "./ResumeDocument";

export default function PreviewPanel({
  form,
  ats,
  analysis,
  template,
  view,
  setView,
}) {
  const preview = buildResumeText(form, ats, template);
  const scale = view === "mobile" ? 0.58 : 0.66;
  const resumeWidth = view === "mobile" ? 390 : 700;

  const shareResume = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Resume",
          text: preview,
        });
      } else {
        await navigator.clipboard.writeText(preview);
        alert("Resume copied to clipboard.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="cvp-live-preview-card">
      <div className="cvp-preview-head">
        <div>
          <span>Resume preview</span>
          <h2>{template?.title || template?.name || "ATS template"}</h2>
        </div>

        <div className="cvp-device-toggle" aria-label="Preview device">
          <button
            className={view === "desktop" ? "active" : ""}
            onClick={() => setView("desktop")}
          >
            Desktop
          </button>
          <button
            className={view === "mobile" ? "active" : ""}
            onClick={() => setView("mobile")}
          >
            Mobile
          </button>
        </div>
      </div>

      <div className="cvp-preview-score-row">
        <div>
          <strong>{analysis.score}%</strong>
          <span>{analysis.readiness}</span>
        </div>
        <p>{analysis.categories[0]?.summary}</p>
      </div>

      <div className="cvp-preview-window">
        <div
          className="cvp-preview-scale"
          style={{
            width: resumeWidth,
            transform: `scale(${scale})`,
            margin: `0 auto ${-1040 * (1 - scale)}px`,
          }}
        >
          <ResumeDocument form={form} ats={ats} template={template} compact />
        </div>
      </div>

      <div className="cvp-export-grid">
        <button className="cvp-export-action" onClick={() => exportResumePDF(form, ats, template)}>
          Download PDF
        </button>
        <button className="cvp-export-action" onClick={() => exportResumeDOCX(form, ats, template)}>
          Download DOCX
        </button>
        <button className="cvp-export-action" onClick={shareResume}>
          Share
        </button>
      </div>

      <div className="cvp-export-checklist">
        <strong>Before download</strong>
        {(analysis.issues.length > 0
          ? analysis.issues
          : ["No critical issues detected. Review formatting and export when ready."]
        ).map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </aside>
  );
}
