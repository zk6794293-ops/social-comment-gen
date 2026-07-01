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

    const { prompt, tone } = await req.json();
    console.log("Prompt received:", prompt);
    console.log("Tone received:", tone);

    // 2. Groq API call - model updated
    const groq = new Groq({ apiKey });

    console.log("Calling Groq API...");
    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ← پرانا model ٹھیک کر دیا
      messages: [
        {
          role: "user",
          content: `Generate 3 ${tone} comments for this social media post. Each comment on new line, no numbering, no quotes:\n\n${prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    // 3. Response - comments array return کرو
    const text = result.choices[0]?.message?.content || "";
    console.log("Final text:", text);

    // Text کو 3 comments میں split کرو
    const comments = text
     .split('\n')
     .map(c => c.trim().replace(/^[-•*]\s*/, '').replace(/^["']|["']$/g, ''))
     .filter(c => c.length > 5)
     .slice(0, 3);

    console.log("Comments array:", comments);
    console.log("=== DEBUG END ===");

    return NextResponse.json({ comments }); // ← {text} کی جگہ {comments}

  } catch (error: any) {
    console.error("=== ERROR CAUGHT ===");
    console.error("Error:", error.message);

    if (error.message?.includes("401")) {
      return NextResponse.json({ error: "Key invalid - groq.com پر نئی key بناؤ" }, { status: 401 });
    }
    if (error.message?.includes("429")) {
      return NextResponse.json({ error: "Rate limit - تھوڑی دیر بعد ٹرائی کرو" }, { status: 429 });
    }
    if (error.message?.includes("decommissioned")) {
      return NextResponse.json({ error: "Model deprecated - code updated" }, { status: 500 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}