import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    console.log("=== DEBUG START ===");

    // 1. Key check
    const apiKey = process.env.GROQ_KEY;
    console.log("GROQ KEY EXISTS:",!!apiKey);
    console.log("GROQ KEY FIRST 8:", apiKey? apiKey.slice(0, 8) + "..." : "MISSING");

    if (!apiKey) {
      throw new Error("GROQ_KEY missing in Vercel Env Vars");
    }

    const { prompt } = await req.json();
    console.log("Prompt received:", prompt);

    // 2. Groq API call
    const groq = new Groq({ apiKey });

    console.log("Calling Groq API...");
    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    // 3. Response
    const text = result.choices[0]?.message?.content;
    console.log("Final text:", text);
    console.log("=== DEBUG END ===");

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("=== ERROR CAUGHT ===");
    console.error("Error:", error.message);

    if (error.message?.includes("401")) {
      return NextResponse.json({ error: "Key invalid - groq.com پر نئی key بناؤ" }, { status: 401 });
    }
    if (error.message?.includes("429")) {
      return NextResponse.json({ error: "Rate limit - تھوڑی دیر بعد ٹرائی کرو" }, { status: 429 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}