import mammoth from "mammoth";

const pdfWorkerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export async function parseResume(file) {
  const name =
    file.name.toLowerCase();

  if (
    name.endsWith(".docx")
  ) {
    return await parseDOCX(
      file
    );
  }

  if (
    name.endsWith(".pdf")
  ) {
    return await parsePDF(
      file
    );
  }

  throw new Error(
    "Unsupported file type"
  );
}

async function parseDOCX(file) {
  const arrayBuffer =
    await file.arrayBuffer();

  const result =
    await mammoth.extractRawText({
      arrayBuffer,
    });

  return result.value;
}

async function parsePDF(file) {
  const pdfjsLib =
    await import(
      "pdfjs-dist"
    );

  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

  const arrayBuffer =
    await file.arrayBuffer();

  const pdf =
    await pdfjsLib.getDocument({
      data:
        new Uint8Array(
          arrayBuffer
        ),
    }).promise;

  let text = "";

  for (
    let i = 1;
    i <= pdf.numPages;
    i++
  ) {
    const page =
      await pdf.getPage(i);

    const content =
      await page.getTextContent();

    text +=
      getPageText(
        content.items
      ) +
      "\n";
  }

  return text;
}

function getPageText(items) {
  const lines = [];
  let currentLine = [];
  let previousY = null;

  items.forEach((item) => {
    const value = String(item.str || "").trim();

    if (!value) return;

    const y = Math.round(item.transform?.[5] || 0);

    if (
      previousY !== null &&
      Math.abs(previousY - y) > 5 &&
      currentLine.length > 0
    ) {
      lines.push(currentLine.join(" "));
      currentLine = [];
    }

    currentLine.push(value);
    previousY = y;

    if (item.hasEOL) {
      lines.push(currentLine.join(" "));
      currentLine = [];
      previousY = null;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine.join(" "));
  }

  return lines.join("\n");
}
