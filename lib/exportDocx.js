import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";
import {
  getContactItems,
  getResumeSections,
  normalizeResume,
} from "./resumeData";

const heading = (text) =>
  new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
      }),
    ],
  });

const body = (text) =>
  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text,
        size: 21,
      }),
    ],
  });

export async function exportResumeDOCX(form, ats, template) {
  const resume = normalizeResume(form);
  const children = [
    new Paragraph({
      children: [
        new TextRun({
          text: resume.name,
          bold: true,
          size: 40,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: resume.role,
          bold: true,
          color: "2563EB",
          size: 24,
        }),
      ],
    }),
  ];

  const contact = getContactItems(resume).join(" | ");
  if (contact) {
    children.push(body(contact));
  }

  getResumeSections(resume).forEach((section) => {
    children.push(heading(section.title.toUpperCase()));

    if (section.list) {
      section.list.forEach((item) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: item,
                size: 21,
              }),
            ],
          })
        );
      });
    } else {
      String(section.value)
        .split("\n")
        .filter(Boolean)
        .forEach((line) => children.push(body(line)));
    }
  });

  if (typeof ats === "number") {
    children.push(heading(`ATS SCORE: ${ats}%`));
  }

  if (template?.name) {
    children.push(body(`Template: ${template.name}`));
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${resume.name.replace(/\s+/g, "-") || "CVPilot"}-Resume.docx`);
}
