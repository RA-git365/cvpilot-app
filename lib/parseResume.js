import mammoth from "mammoth";

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

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer =
    await file.arrayBuffer();

  const pdf =
    await pdfjsLib.getDocument({
      data:
        arrayBuffer,
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

    const strings =
      content.items.map(
        (item) =>
          item.str
      );

    text +=
      strings.join(" ") +
      "\n";
  }

  return text;
}