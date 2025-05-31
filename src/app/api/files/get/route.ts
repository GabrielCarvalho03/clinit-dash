// pages/api/files/get.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const url = body.url;

  console.log("chegou aqui url", url);

  if (!url) {
    return NextResponse.json({ error: "URL not provided" }, { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 500 }
      );
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Detecta o tipo da imagem pra montar data URL
    const contentType = response.headers.get("content-type") || "image/png";
    return NextResponse.json({
      base64: `data:${contentType};base64,${base64}`,
    });
  } catch (error) {
    NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
