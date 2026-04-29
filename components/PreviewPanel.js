import { exportResumePDF } from "../lib/exportPdf";
import { exportResumeDOCX } from "../lib/exportDocx";
import { buildResumeText } from "../lib/resumeData";
import ResumeDocument from "./ResumeDocument";

export default function PreviewPanel({
  form,
  ats,
  template,
  theme,
  view,
  setView,
}) {
  const maxWidth = view === "mobile" ? 360 : 660;
  const preview = buildResumeText(form, ats, template);
  const scale = view === "mobile" ? 0.58 : 0.66;
  const resumeWidth = view === "mobile" ? 390 : 700;

  const shareResume = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Resume - CVPilot",
          text: preview,
        });
      } else {
        await navigator.clipboard.writeText(preview);
        alert("Resume copied to clipboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="cvp-live-preview-card"
      style={{
        width: "100%",
        maxWidth,
        padding: 22,
        borderRadius: 26,
        background: theme.card,
        border: `1px solid ${theme.border}`,
        transition: "0.3s ease",
      }}
    >
      <div
        className="cvp-preview-window"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <h3
          style={{
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          Live CV Preview
        </h3>

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <button onClick={() => setView("desktop")} style={styles.smallBtn}>
            Desktop
          </button>
          <button onClick={() => setView("mobile")} style={styles.smallBtn}>
            Mobile
          </button>
        </div>
      </div>

      <div
        style={{
          overflow: "auto",
          borderRadius: 8,
          background: "#f8fafc",
          padding: view === "mobile" ? 10 : 16,
          maxHeight: view === "mobile" ? 680 : 780,
        }}
      >
        <div
          style={{
            width: resumeWidth,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            margin: `0 auto ${-1040 * (1 - scale)}px`,
          }}
        >
          <ResumeDocument
            form={form}
            ats={ats}
            template={template}
            compact
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          marginTop: 14,
        }}
      >
        <button
          className="cvp-export-action"
          onClick={() => exportResumePDF(form, ats, template)}
          style={styles.actionBtn}
        >
          PDF
        </button>
        <button
          className="cvp-export-action"
          onClick={() => exportResumeDOCX(form, ats, template)}
          style={styles.actionBtn}
        >
          DOCX
        </button>
        <button className="cvp-export-action" onClick={shareResume} style={styles.actionBtn}>
          Share
        </button>
      </div>
    </div>
  );
}

const styles = {
  smallBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
  },
  actionBtn: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
};
