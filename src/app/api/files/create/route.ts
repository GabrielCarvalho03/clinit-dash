import { S3 } from "aws-sdk";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { imageData } = body;
  // ...seu código de geração da imagem

  // Após gerar o buffer da imagem:
  const buffer = Buffer.from(imageData, "base64");
  const fileName = `simulacao_${Date.now()}.png`;

  // Configuração do S3
  const s3 = new S3({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
  });

  const params = {
    Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
    ContentType: "image/png",
    ACL: "public-read",
  };

  // Faz upload para o S3
  const uploadResult = await s3.upload(params).promise();

  // Retorna a URL pública do S3
  return new Response(JSON.stringify({ url: uploadResult.Location }), {
    status: 200,
  });
}
