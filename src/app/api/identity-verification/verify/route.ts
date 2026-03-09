import { NextResponse } from "next/server";
import { mistral } from "@ai-sdk/mistral";
import { generateText } from "ai";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isRateLimitError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /rate limit/i.test(message) || /too many requests/i.test(message);
}

// Key is read from process.env.MISTRAL_API_KEY on the server only. Never use NEXT_PUBLIC_ for this key.
export async function POST(request: Request) {
  if (!process.env.MISTRAL_API_KEY) {
    return NextResponse.json(
      {
        error:
          "MISTRAL_API_KEY not configured. Use client-side verification for demo.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const referenceImage = body?.referenceImage as string | undefined;
    const captureImage = body?.captureImage as string | undefined;
    if (
      !referenceImage ||
      typeof referenceImage !== "string" ||
      !captureImage ||
      typeof captureImage !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid 'referenceImage' or 'captureImage'." },
        { status: 400 }
      );
    }

    let text: string;
    try {
      const result = await generateText({
        model: mistral("pixtral-large-latest"),
        maxRetries: 0,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are comparing two face photos: Image 1 is the reference (e.g. from an ID document), Image 2 is a live capture. Are they the same person? Reply with a JSON object only (no markdown): {"samePerson": true or false, "confidence": number between 0 and 1}.`,
              },
              {
                type: "image",
                image: referenceImage,
                mediaType: "image/jpeg",
              },
              {
                type: "image",
                image: captureImage,
                mediaType: "image/jpeg",
              },
            ],
          },
        ],
      });
      text = result.text;
    } catch (firstErr) {
      if (isRateLimitError(firstErr)) {
        await sleep(20000);
        const result = await generateText({
          model: mistral("pixtral-large-latest"),
          maxRetries: 0,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You are comparing two face photos: Image 1 is the reference (e.g. from an ID document), Image 2 is a live capture. Are they the same person? Reply with a JSON object only (no markdown): {"samePerson": true or false, "confidence": number between 0 and 1}.`,
                },
                {
                  type: "image",
                  image: referenceImage,
                  mediaType: "image/jpeg",
                },
                {
                  type: "image",
                  image: captureImage,
                  mediaType: "image/jpeg",
                },
              ],
            },
          ],
        });
        text = result.text;
      } else {
        throw firstErr;
      }
    }

    let matched = false;
    let similarity = 0;
    try {
      const parsed = JSON.parse(text.trim()) as {
        samePerson?: boolean;
        confidence?: number;
      };
      matched = parsed.samePerson === true;
      similarity =
        typeof parsed.confidence === "number"
          ? Math.max(0, Math.min(1, parsed.confidence))
          : matched
            ? 0.8
            : 0.2;
    } catch {
      similarity = 0.5;
    }

    return NextResponse.json({
      matched,
      similarity,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed.";
    if (isRateLimitError(err)) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Please wait about 1 minute and try again.",
        },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
