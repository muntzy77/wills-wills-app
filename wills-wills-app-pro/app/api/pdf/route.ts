import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

export async function POST(req: Request) {
  const { content } = await req.json();

  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  const stream = doc as unknown as Readable;
  stream.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve) => {
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.fontSize(16).text("Will Draft", { align: "center" });
  doc.moveDown();
  doc.fontSize(11).text(content || "No content provided.", {
    align: "left",
  });
  doc.end();

  const pdfBuffer = await done;

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="will-draft.pdf"',
    },
  });
}
