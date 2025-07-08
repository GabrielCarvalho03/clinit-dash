import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { file: string } }
) {
  const { file } = params;
  const filePath = path.join(
    process.cwd(),
    "src",
    "app",
    "api",
    "IA",
    "temp",
    file
  );

  if (!fs.existsSync(filePath)) {
    return new Response("Arquivo não encontrado", { status: 404 });
  }

  const imageBuffer = fs.readFileSync(filePath);

  return new Response(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename=\"${file}\"`,
    },
  });
}
