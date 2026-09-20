import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const FREE_MODEL = "meta-llama/llama-3.3-70b-instruct";

export async function POST(request) {
  try {
    const { comments, movieId, mediaType, contentTitle } = await request.json();

    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      return NextResponse.json(
        { error: "Comments array is required." },
        { status: 400 },
      );
    }

    const rawComments = comments.map((c) =>
      typeof c === "string" ? c : c.text || c.content || "",
    );

    const titleToUse = contentTitle || `ID ${movieId}`;

    const userPrompt = `
    Analyze these user reviews for the title "${titleToUse}" (${mediaType}):
    ${JSON.stringify(rawComments)}

    Task:
    1. Write a 3-4 sentence narrative summary paragraph detailing overall sentiment, key strengths, and consensus. Refer to the title by its name "${titleToUse}" or simply as "the film/show" — NEVER output raw numeric IDs in the text summary.
    2. Extract up to 8 positive praise tags (1-3 words each).
    3. Extract up to 4 critical/negative tags if present.

    Respond STRICTLY with raw JSON:
    {
      "text": "Full narrative summary paragraph here...",
      "pros": ["Exceptional writing", "Phenomenal performances"],
      "cons": ["Slow pacing"]
    }`;

    const response = await openai.chat.completions.create({
      model: FREE_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an AI json generator. Return strictly valid raw JSON without markdown.",
        },
        { role: "user", content: userPrompt },
      ],
    });

    let rawContent = response.choices[0].message.content?.trim() || "{}";

    if (rawContent.startsWith("```")) {
      rawContent = rawContent
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "");
    }

    const result = JSON.parse(rawContent);

    return NextResponse.json({ summary: result });
  } catch (error) {
    console.error("Greška u analizi komentara:", error);
    return NextResponse.json(
      { error: "Greška pri obradi zahteva.", details: error.message },
      { status: 500 },
    );
  }
}
