import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.addPage([612, 792]);
    const { height } = page.getSize();

    const title = `Invoice ${id}`;
    const lines = [
      "",
      "Sample Invoice",
      "",
      `Invoice number: ${id}`,
      "Payment date: 25 January 2026",
      "Payment method: Visa •••• 2053",
      "Amount: US$20.00",
      "",
      "Thank you for your business.",
    ];

    page.drawText(title, { x: 50, y: height - 50, size: 18, font });
    let y = height - 80;
    for (const line of lines) {
      page.drawText(line, { x: 50, y, size: 12, font });
      y -= 18;
    }

    const bytes = await pdfDoc.save();
    const filename = `invoice-${id}.pdf`;
    const body = new Blob([new Uint8Array(bytes)], {
      type: "application/pdf",
    });

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(body.size),
      },
    });
  } catch (err) {
    console.error("Invoice PDF generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate invoice PDF." },
      { status: 500 }
    );
  }
}
