import { NextResponse } from "next/server";
import { mistral } from "@ai-sdk/mistral";
import { generateText } from "ai";

// Key is read from process.env.MISTRAL_API_KEY on the server only. Never use NEXT_PUBLIC_ for this key.
export async function POST(request: Request) {
  if (!process.env.MISTRAL_API_KEY) {
    return NextResponse.json(
      {
        error: "MISTRAL_API_KEY not configured. Use client-side OCR for demo.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const imageDataUrl = body?.image as string | undefined;
    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'image' (data URL)." },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: mistral("pixtral-large-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract text from this ID document image. Reply with a JSON object only (no markdown), with keys: fullName (string), idNumber (string or null), dateOfBirth (string or null), expiryDate (string or null). Use null for any field you cannot read. Example: {"fullName":"John Doe","idNumber":"12345678","dateOfBirth":"01/01/1990","expiryDate":"01/01/2030"}`,
            },
            {
              type: "image",
              image: imageDataUrl,
              mediaType: "image/jpeg",
            },
          ],
        },
      ],
    });

    let fields: Record<string, string | null> = {
      fullName: null,
      idNumber: null,
      dateOfBirth: null,
      expiryDate: null,
    };
    try {
      const parsed = JSON.parse(text.trim()) as Record<string, string | null>;
      fields = { ...fields, ...parsed };
    } catch {
      // keep defaults if parse fails
    }

    return NextResponse.json({
      rawText: text,
      fields,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "OCR failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
