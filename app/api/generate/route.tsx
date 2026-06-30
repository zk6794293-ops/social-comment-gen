import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return NextResponse.json({ text });
    
  } catch (e: any) {
    console.log("FULL ERROR:", e);              // 👈 یہ لائن add کرو
    console.log("ERROR MESSAGE:", e.message);   // 👈 یہ بھی add کرو
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}