import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 👇 یہ لائن Google سے سارے models منگوائے گی
    const result = await genAI.listModels();
    const modelNames = result.models.map(m => m.name);
    
    console.log("AVAILABLE MODELS:", modelNames);
    
    return NextResponse.json({ 
      msg: "Vercel Logs میں دیکھو", 
      models: modelNames 
    });
    
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}