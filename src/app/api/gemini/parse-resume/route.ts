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

    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: "No resume text provided" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an expert career counselor. Analyze the following resume text and provide a structured JSON response.
      Do not wrap it in markdown. Just valid JSON.
      
      Requirements:
      - current_level: "Entry Level", "Mid Level", "Senior", or "Executive"
      - key_strengths: Array of up to 5 main strengths/skills (MAX 3 words each)
      - skill_gaps: Array of up to 3 areas for improvement (short 1-sentence explanations)
      - recommended_roles: Array of up to 3 job titles they should target
      - action_plan: Array of up to 4 concrete steps they should take (short 1-sentence steps)
      
      Resume Text:
      ${resumeText}
    `;

    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });
        break; // Success
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

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini");
    }

    let result;
    try {
      result = JSON.parse(jsonText);
    } catch (e) {
      // Attempt to clean markdown if Gemini still returns it despite instructions
      const cleanJson = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleanJson);
    }

    // Save recommendations to supabase
    await supabase
      .from("profiles")
      .update({
        career_recommendations: result,
        skills_extracted: result.key_strengths,
      })
      .eq("id", user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Resume parsing error:", error);
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 });
  }
}
