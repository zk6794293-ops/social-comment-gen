import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    console.log("=== DEBUG START ===");

    // 1. Key + Env Vars check
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API KEY EXISTS:",!!apiKey);
    console.log("API KEY LENGTH:", apiKey?.length || 0);
    console.log("API KEY FIRST 8:", apiKey? apiKey.slice(0, 8) + "..." : "MISSING");
    console.log("ENV VARS:", Object.keys(process.env).filter(k => k.includes("GEMINI")));

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY missing in Vercel Env Vars");
    }

    const { prompt } = await req.json();
    console.log("Prompt received:", prompt);

    // 2. Gemini API call
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    console.log("Calling Gemini API...");
    const result = await model.generateContent(prompt);

    // 3. Response check - یہی اصل ڈبہ ہے
    console.log("Result received:",!!result);
    console.log("Result.response exists:",!!result?.response);
    console.log("Full result object:", JSON.stringify(result, null, 2));

    const response = result.response;
    if (!response) {
      throw new Error("Google returned response = undefined. 100% Key restriction issue");
    }

    console.log("Response.candidates:", response.candidates);
    console.log("Response.promptFeedback:", response.promptFeedback);

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || response.text();
    console.log("Final text:", text);
    console.log("=== DEBUG END ===");

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("=== ERROR CAUGHT ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("FULL ERROR OBJECT:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

    // Google کے اصل errors
    if (error.message?.includes("API key not valid")) {
      return NextResponse.json({ error: "Key invalid - nayi banao aistudio.google.com se" }, { status: 401 });
    }
    if (error.message?.includes("PERMISSION_DENIED")) {
      return NextResponse.json({ error: "Key restricted hai - Gemini API block hai" }, { status: 403 });
    }
    if (error.message?.includes("response = undefined")) {
      return NextResponse.json({ error: "Key restricted - nayi AI... key use karo" }, { status: 403 });
    }

    return NextResponse.json({
      error: error.message,
      type: error.name
    }, { status: 500 });
  }
}