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