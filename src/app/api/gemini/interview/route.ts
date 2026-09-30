import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Format messages for the Gemini API
    const contents = messages.map(msg => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.text }]
    }));

    const systemInstruction = "You are an expert technical interviewer conducting a mock interview for a Frontend Engineer position. Keep your responses concise (under 100 words), ask one clear technical question at a time, and provide constructive feedback on the user's answers. Act professionally but encouragingly.";

    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction,
          }
        });
        break;
      } catch (err: any) {
        if (err.message && err.message.includes("503") && retries > 1) {
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          throw err;
        }
      }
    }

    if (!response) {
      throw new Error("Service unavailable after multiple attempts. Please try again later.");
    }

    const reply = response.text;
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json({ error: "Failed to process interview response" }, { status: 500 });
  }
}
