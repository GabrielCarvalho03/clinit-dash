import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import axios from "axios";

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { prompt, imagemOriginal } = await req.json();

  if (!prompt || !imagemOriginal) {
    return new Response(
      JSON.stringify({ error: "Prompt e imagem são obrigatórios" }),
      { status: 400 }
    );
  }

  const match = imagemOriginal.match(/^data:(image\/(png|jpeg));base64,/);
  if (!match) {
    return new Response(
      JSON.stringify({ error: "Formato de imagem não suportado" }),
      { status: 400 }
    );
  }

  const mimeType = match[1];
  const base64Data = imagemOriginal.replace(
    /^data:image\/(png|jpeg);base64,/,
    ""
  );

  try {
    /**
     * 1️⃣ GEMINI → entende a imagem e melhora o prompt
     */
    const visionResponse = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Descreva a imagem e aplique esta instrução: ${prompt}`,
            },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    });

    const refinedPrompt =
      visionResponse.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        ?.join(" ") || prompt;

    /**
     * 2️⃣ IMAGEN → gera a imagem final
     * (Vertex AI obrigatório)
     */
    const imagenResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: refinedPrompt }],
          parameters: {
            sampleCount: 1,
          },
        }),
      }
    );

    const imagenData = await imagenResponse.json();

    if (!imagenData.predictions?.length) {
      throw new Error("Imagen não retornou imagem");
    }

    const imageBase64 = imagenData.predictions[0].bytesBase64Encoded;

    /**
     * 3️⃣ Salva no S3 (mantido igual ao teu fluxo)
     */
    const uploadResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/files/create`,
      {
        imageData: imageBase64,
      }
    );

    if (!uploadResponse.data?.url) {
      throw new Error("Erro ao salvar imagem no S3");
    }

    return new Response(
      JSON.stringify({
        url: uploadResponse.data.url,
        description: refinedPrompt,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro na geração de imagem:", error);

    const message = error?.message || "Erro desconhecido";

    return new Response(
      JSON.stringify({
        error: message,
      }),
      { status: 500 }
    );
  }
}
