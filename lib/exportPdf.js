import jsPDF from "jspdf";
import {
  getContactItems,
  getResumeSections,
  normalizeResume,
} from "./resumeData";

function getTemplateAccent(template = {}) {
  return template.color || template.accent || "#2563eb";
}

function getTemplateDark(template = {}) {
  if (template.accentDark) return template.accentDark;
  if (String(template.name || "").includes("gold") || String(template.name || "").includes("dark")) {
    return "#111827";
  }
  return "#0f172a";
}

function parseLines(value = "") {
  return String(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function stripBullet(line) {
  return line.replace(/^[-*]\s*/, "").trim();
}

function getImageFormat(dataUrl = "") {
  if (dataUrl.includes("image/png")) return "PNG";
  if (dataUrl.includes("image/webp")) return "WEBP";
  return "JPEG";
}

function addImageSafe(doc, image, x, y, width, height) {
  try {
    doc.addImage(image, getImageFormat(image), x, y, width, height);
  } catch {
    // Visual assets are optional; keep export working if a browser cannot encode one.
  }
}

export function exportResumePDF(form, ats, template) {
  const resume = normalizeResume(form);
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const accent = getTemplateAccent(template);
  const dark = getTemplateDark(template);
  const usePhoto = Boolean(resume.photoImage);
  const useSignature = Boolean(resume.signatureImage);
  let y = 18;

  const addPageIfNeeded = (needed = 12) => {
    if (y + needed <= pageHeight - margin) return;
    doc.addPage();
    y = margin;
  };

  const addTextBlock = (text, options = {}) => {
    const lines = doc.splitTextToSize(String(text || ""), contentWidth);
    lines.forEach((line) => {
      addPageIfNeeded(7);
      doc.text(line, margin, y);
      y += options.lineHeight || 6;
    });
  };

  doc.setFillColor(dark);
  doc.rect(0, 0, pageWidth, 44, "F");
  doc.setFillColor(accent);
  doc.rect(0, 44, pageWidth, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.setTextColor("#ffffff");
  doc.text(resume.name, margin, y);
  y += 9;

  doc.setFontSize(13);
  doc.setTextColor("#dbeafe");
  doc.text(resume.role, margin, y);
  y += 13;

  if (usePhoto) {
    addImageSafe(doc, resume.photoImage, pageWidth - margin - 16, 10, 15, 20);
  }

  if (typeof ats === "number") {
    doc.setDrawColor("#ffffff");
    doc.setLineWidth(0.4);
    const scoreX = pageWidth - margin - (usePhoto ? 53 : 25);
    doc.roundedRect(scoreX, 13, 25, 18, 2, 2);
    doc.setFontSize(12);
    doc.setTextColor("#ffffff");
    doc.text(`${ats}%`, scoreX + 7, 22);
    doc.setFontSize(7);
    doc.text("ATS", scoreX + 9, 28);
  }

  const contact = getContactItems(resume).join(" | ");
  if (contact) {
    doc.setFillColor("#f8fafc");
    doc.rect(0, 47, pageWidth, 14, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#475569");
    y = 55;
    addTextBlock(contact, { lineHeight: 5 });
    y += 6;
  } else {
    y = 57;
  }

  getResumeSections(resume).forEach((section) => {
    addPageIfNeeded(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(dark);
    doc.text(section.title.toUpperCase(), margin, y);
    doc.setDrawColor(accent);
    doc.setLineWidth(0.55);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#334155");

    if (section.list) {
      section.list.forEach((item) => {
        addPageIfNeeded(6);
        doc.text(`- ${item}`, margin + 2, y);
        y += 5;
      });
    } else {
      const lines = parseLines(section.value);
      const listLike =
        lines.length > 1 &&
        (section.title.includes("Experience") ||
          section.title === "Projects" ||
          section.title === "Achievements" ||
          lines.every((line) => /^[-*]/.test(line)));

      if (listLike) {
        lines.forEach((line) => {
          addPageIfNeeded(6);
          const wrapped = doc.splitTextToSize(`- ${stripBullet(line)}`, contentWidth - 4);
          wrapped.forEach((wrappedLine) => {
            addPageIfNeeded(6);
            doc.text(wrappedLine, margin + 2, y);
            y += 5;
          });
        });
      } else {
        addTextBlock(section.value);
      }
    }

    y += 4;
  });

  if (useSignature) {
    addPageIfNeeded(34);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(dark);
    doc.text("DECLARATION", margin, y);
    doc.setDrawColor(accent);
    doc.setLineWidth(0.45);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#334155");
    addTextBlock(
      "I hereby declare that the information provided above is true and correct to the best of my knowledge.",
      { lineHeight: 5 }
    );
    y += 2;
    addImageSafe(doc, resume.signatureImage, margin, y, 34, 11);
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(dark);
    doc.text(resume.name, margin, y);
    y += 6;
  }

  doc.save(`${resume.name.replace(/\s+/g, "-") || "Resume"}-Resume.pdf`);
}
