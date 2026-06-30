import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    // 👇 یہ 3 لائن add کرو - Key debug
    console.log("API KEY EXISTS:", !!apiKey);
    console.log("API KEY FIRST 8:", apiKey ? apiKey.slice(0, 8) + "..." : "MISSING");
    console.log("ENV VARS:", Object.keys(process.env).filter(k => k.includes("GEMINI")));
    
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    
    const result = await model.generateContent(prompt);
    const text = result.response?.text() || "No response";
    
    return NextResponse.json({ text });
    
  } catch (e: any) {
    // 👇 Full error dump
    console.log("FULL ERROR OBJECT:", JSON.stringify(e, null, 2));
    console.log("ERROR NAME:", e.name);
    console.log("ERROR MESSAGE:", e.message);
    console.log("ERROR STACK:", e.stack);
    
    return NextResponse.json({ 
      error: e.message,
      type: e.name 
    }, { status: 500 });
  }
}