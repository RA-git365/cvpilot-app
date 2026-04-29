import jsPDF from "jspdf";
import {
  getContactItems,
  getResumeSections,
  normalizeResume,
} from "./resumeData";

export function exportResumePDF(form, ats, template) {
  const resume = normalizeResume(form);
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
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

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(resume.name, margin, y);
  y += 9;

  doc.setFontSize(13);
  doc.setTextColor(37, 99, 235);
  doc.text(resume.role, margin, y);
  y += 8;

  const contact = getContactItems(resume).join(" | ");
  if (contact) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    addTextBlock(contact, { lineHeight: 5 });
    y += 3;
  }

  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.7);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  getResumeSections(resume).forEach((section) => {
    addPageIfNeeded(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(section.title.toUpperCase(), margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    if (section.list) {
      section.list.forEach((item) => {
        addPageIfNeeded(6);
        doc.text(`- ${item}`, margin + 2, y);
        y += 5;
      });
    } else {
      addTextBlock(section.value);
    }

    y += 4;
  });

  if (typeof ats === "number") {
    addPageIfNeeded(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`ATS Score: ${ats}%`, margin, y);
    y += 6;
  }

  if (template?.name) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(37, 99, 235);
    doc.text(`Template: ${template.name}`, margin, y);
  }

  doc.save(`${resume.name.replace(/\s+/g, "-") || "CVPilot"}-Resume.pdf`);
}
