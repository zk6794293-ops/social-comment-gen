import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    // 👇 REST API سے Google کے سارے available models نکالیں گے
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    
    if (!res.ok) {
      console.log("Google API Error:", data);
      return NextResponse.json({ error: data.error?.message || "API failed" }, { status: 500 });
    }
    
    const modelNames = data.models?.map((m: any) => m.name) || [];
    console.log("AVAILABLE MODELS:", modelNames);
    
    return NextResponse.json({ 
      success: true,
      msg: "Vercel Logs میں AVAILABLE MODELS دیکھو",
      models: modelNames 
    });
    
  } catch (e: any) {
    console.log("Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}