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
    const prompt = `Post: "${post}"
User wants ${tone} tone comments.

Task: Read the post, understand context + language.
Write 3 short, natural, human-like comments as if a real person is commenting.
1-2 lines each. Match the post language. No hashtags, no quotes. Separate each comment with ||`;

    // فری ماڈلز کی لسٹ - اوپر والا پہلے ٹرائی ہو گا
    const models = [
      "gemini-1.5-flash-latest",  // ابھی فری چل رہا
      "gemini-1.0-pro",           // backup فری ماڈل
      "gemini-2.0-flash"          // اگر card لگ گیا تو یہ
    ];

    let lastError = "";
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const comments = text.split("||").map(c => c.trim()).filter(Boolean).slice(0, 3);
        
        console.log(`Success with