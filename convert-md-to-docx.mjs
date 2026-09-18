import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";
import HTMLtoDOCX from "html-to-docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mdPath = path.join(__dirname, "تفاويض-الأوقاف-قصص-المستخدم.md");
const docxPath = path.join(__dirname, "تفاويض-الأوقاف-قصص-المستخدم.docx");

let md = fs.readFileSync(mdPath, "utf8");

md = md.replace(/```mermaid[\s\S]*?```/g, (block) => {
  const inner = block.replace(/```mermaid\n?/, "").replace(/```$/, "").trim();
  return `\n**مخطط تدفق (Mermaid):**\n\n\`\`\`\n${inner}\n\`\`\`\n`;
});

marked.setOptions({ gfm: true, breaks: false });

const body = marked.parse(md);

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>تفاويض الأوقاف — قصص المستخدم</title>
</head>
<body dir="rtl" style="direction: rtl; text-align: right; font-family: Arial, Traditional Arabic, Tahoma, sans-serif; font-size: 12pt;">
${body}
</body>
</html>`;

const buffer = await HTMLtoDOCX(html, null, {
  orientation: "portrait",
  margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
  title: "تفاويض الأوقاف — قصص المستخدم",
  lang: "ar-SA",
  table: { row: { cantSplit: true } },
  footer: false,
  pageNumber: false,
});

fs.writeFileSync(docxPath, buffer);
console.log("DOCX:", docxPath, `(${(buffer.length / 1024).toFixed(1)} KB)`);
