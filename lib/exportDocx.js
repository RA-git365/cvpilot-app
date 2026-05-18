import {
  Document,
  ImageRun,
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

const cleanHex = (value = "#2563eb") => String(value).replace("#", "").toUpperCase();

const getAccent = (template = {}) => cleanHex(template.color || template.accent || "2563eb");

const parseLines = (value = "") =>
  String(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const stripBullet = (line) => line.replace(/^[-*]\s*/, "").trim();

const dataUrlToUint8Array = (dataUrl = "") => {
  const base64 = dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const getDocxImageType = (dataUrl = "") => {
  if (dataUrl.includes("image/png")) return "png";
  return "jpg";
};

const isDocxSupportedImage = (dataUrl = "") =>
  dataUrl.includes("image/png") || dataUrl.includes("image/jpeg") || dataUrl.includes("image/jpg");

const imageRun = (dataUrl, width, height) =>
  new ImageRun({
    type: getDocxImageType(dataUrl),
    data: dataUrlToUint8Array(dataUrl),
    transformation: {
      width,
      height,
    },
  });

const heading = (text, accent = "2563EB") =>
  new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: accent,
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
  const accent = getAccent(template);
  const usePhoto = isDocxSupportedImage(resume.photoImage);
  const useSignature = isDocxSupportedImage(resume.signatureImage);
  const children = [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: resume.name,
          bold: true,
          color: "0F172A",
          size: 44,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: resume.role,
          bold: true,
          color: accent,
          size: 24,
        }),
      ],
    }),
  ];

  if (usePhoto) {
    children.unshift(
      new Paragraph({
        spacing: { after: 120 },
        children: [imageRun(resume.photoImage, 54, 70)],
      })
    );
  }

  const contact = getContactItems(resume).join(" | ");
  if (contact) {
    children.push(body(contact));
  }

  getResumeSections(resume).forEach((section) => {
    children.push(heading(section.title.toUpperCase(), accent));

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
      const lines = parseLines(section.value);
      const listLike =
        lines.length > 1 &&
        (section.title.includes("Experience") ||
          section.title === "Projects" ||
          section.title === "Achievements" ||
          lines.every((line) => /^[-*]/.test(line)));

      lines.forEach((line) => {
        if (listLike) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 90 },
              children: [
                new TextRun({
                  text: stripBullet(line),
                  size: 21,
                }),
              ],
            })
          );
        } else {
          children.push(body(line));
        }
      });
    }
  });

  if (typeof ats === "number") {
    children.push(heading(`ATS SCORE: ${ats}%`, accent));
  }

  if (useSignature) {
    children.push(
      heading("DECLARATION", accent),
      body("I hereby declare that the information provided above is true and correct to the best of my knowledge."),
      new Paragraph({
        spacing: { before: 180, after: 60 },
        children: [imageRun(resume.signatureImage, 150, 46)],
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: resume.name,
            bold: true,
            color: "0F172A",
            size: 18,
          }),
        ],
      })
    );
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
  saveAs(blob, `${resume.name.replace(/\s+/g, "-") || "Resume"}-Resume.docx`);
}
