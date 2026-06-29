import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { post, tone } = await req.json();
    
    if (!post) {
      return NextResponse.json({ error: "Post missing" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set in Vercel" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // فری کوٹا: 250 requests/دن - API کا اسٹیبل نام
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    const prompt = `Post: "${post}"
User wants ${tone} tone comments.

Task: Read the post, understand context + language.
Write 3 short, natural, human-like comments as if a real person is commenting.
1-2 lines each. Match the post language. No hashtags, no quotes. Separate each comment with ||`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const comments = text.split("||").map(c => c.trim()).filter(Boolean).slice(0, 3);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Gemini Error:', error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}