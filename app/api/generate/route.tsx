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
    
    const prompt = 'Post: "' + post + '"\n' +
      'User wants ' + tone + ' tone comments.\n\n' +
      'Task: Read the post, understand context + language.\n' +
      'Write 3 short, natural, human-like comments as if a real person is commenting.\n' +
      '1-2 lines each. Match the post language. No hashtags, no quotes. Separate each comment with ||';

    // 🔥 فری ماڈلز پہلے، paid والا last پر
    const models = [
      "gemini-1.5-flash-latest",
      "gemini-1.0-pro"
      // "gemini-2.0-flash" ← فل حال delete کر دو
    ];

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
        // quota error آئے تو next ماڈل
        const msg = lastError.toLowerCase();
        if (!msg.includes("429") && !msg.includes("quota") && !msg.includes("billing")) {
          break;
        }
      }
    }

    return NextResponse.json({ error: "All models failed. Last error: " + lastError }, { status: 500 });
  } catch (error) {
    console.error('Gemini Error:', error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}