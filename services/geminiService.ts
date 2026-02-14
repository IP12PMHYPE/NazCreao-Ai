
import { GoogleGenAI } from "@google/genai";
import { GenerationSettings } from "../types";

export const generateImage = async (
  prompt: string, 
  settings: GenerationSettings, 
  imageData?: { data: string; mimeType: string }
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const fullPrompt = `${prompt}${settings.style}`;
  
  const parts: any[] = [{ text: fullPrompt }];
  if (imageData) {
    parts.unshift({
      inlineData: {
        data: imageData.data,
        mimeType: imageData.mimeType,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: settings.model,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: settings.aspectRatio,
        },
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No image generated.");
    }

    const outputParts = response.candidates[0].content.parts;
    const imagePart = outputParts.find(p => p.inlineData);

    if (!imagePart || !imagePart.inlineData) {
      const textPart = outputParts.find(p => p.text);
      throw new Error(textPart?.text || "The engine did not return an image.");
    }

    const base64Data = imagePart.inlineData.data;
    
    return {
      url: `data:image/png;base64,${base64Data}`,
      groundingChunks: []
    };
  } catch (error: any) {
    console.error("Generation Error:", error);
    throw error;
  }
};
