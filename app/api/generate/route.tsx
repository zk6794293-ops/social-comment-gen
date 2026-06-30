import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { post, tone } = await req.json();
    if (!post) return NextResponse.json({ error: "Post missing" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `Post: "${post}"
User wants ${tone} tone comments.
Write 3 short, natural, human-like comments. 1-2 lines each. Match language. No hashtags. Separate with ||`;

    // ✅ صرف یہ 2 فری ماڈل - کوئی -latest نہیں
    const models = ["gemini-1.5-flash", "gemini-1.0-pro"];
    
    let lastError = "";
    for (const modelName of models) {
      try {
        console.log("Trying model: " + modelName);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const comments = text.split("||").map(c => c.trim()).filter(Boolean).slice(0, 3);
        console.log("Success with model: " + modelName);
        return NextResponse.json({ comments, model: modelName });
      } catch (e: any) {
        lastError = e.message || "Unknown error";
        console.log("Model " + modelName + " failed: " + lastError);
      }
    }
    return NextResponse.json({ error: "All models failed. Last: " + lastError }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 