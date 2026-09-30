import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testModel(modelName: string) {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Hello",
    });
    console.log(`Success with ${modelName}`);
  } catch (e: any) {
    console.error(`Failed with ${modelName}:`, e.message);
  }
}

async function run() {
  await testModel("gemini-2.5-pro");
  await testModel("gemini-3.5-flash");
  await testModel("gemini-3.5-flash-lite");
  await testModel("gemini-3.6-flash");
}

run();
