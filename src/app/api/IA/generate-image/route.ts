import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest } from "next/server";
import axios from "axios";

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt, imagemOriginal } = body;

  if (!prompt || !imagemOriginal) {
    return new Response(
      JSON.stringify({ error: "Prompt e imagem são obrigatórios" }),
      { status: 400 }
    );
  }

  const match = imagemOriginal.match(/^data:(image\/(png|jpeg));base64,/);

  if (!match) {
    return new Response(
      JSON.stringify({ error: "Formato de imagem não suportado." }),
      { status: 400 }
    );
  }
  const mimeType = match[1];
  const base64Data = imagemOriginal.replace(
    /^data:image\/(png|jpeg);base64,/,
    ""
  );

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData);
    const textPart = parts.find((p) => p.text);

    // Extrai a imagem gerada (base64)
    if (!imagePart?.inlineData?.data) {
      return new Response(
        JSON.stringify({ error: "Não foi possível gerar a imagem." }),
        {
          status: 500,
        }
      );
    }

    console.log("Imagem gerada com sucesso, salvando no S3...");

    // Salva a imagem no AWS S3
    const uploadResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/files/create`,
      {
        imageData: imagePart.inlineData.data,
      }
    );

    if (!uploadResponse.data?.url) {
      return new Response(
        JSON.stringify({ error: "Erro ao salvar imagem no S3." }),
        { status: 500 }
      );
    }

    console.log("Imagem salva no S3:", uploadResponse.data.url);

    return new Response(
      JSON.stringify({
        url: uploadResponse.data.url,
        description: textPart?.text || "",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro na geração de imagem:", error);

    // Verificar se é erro de API não habilitada
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (
      errorMessage.includes("GOOGLE_API_KEY") ||
      errorMessage.includes("401")
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Chave da API Google não configurada ou inválida. Configure GOOGLE_API_KEY no .env.local",
        }),
        { status: 500 }
      );
    }

    if (
      errorMessage.includes("SERVICE_DISABLED") ||
      errorMessage.includes("403 Forbidden")
    ) {
      return new Response(
        JSON.stringify({
          error:
            "API Gemini não habilitada. Habilite em: https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview",
        }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ error: "Erro ao gerar imagem." }), {
      status: 500,
    });
  }
}
