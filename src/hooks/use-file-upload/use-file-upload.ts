import { create } from "zustand";
import { toast } from "sonner";
import { S3 } from "aws-sdk";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface FileUploadStore {
  status: UploadStatus;
  preview: string | null;
  error: string | null;
  uploadFile: (file: File, path?: string) => Promise<string>;
  resetUpload: () => void;
}

export const useFileUpload = create<FileUploadStore>((set) => ({
  status: "idle",
  preview: null,
  error: null,

  uploadFile: async (file: File): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        // Verificação do tipo de arquivo
        if (!file.type.startsWith("image/")) {
          const message = "O arquivo precisa ser uma imagem";
          toast.error("Erro no upload", { description: message });
          return reject(message);
        }

        // Limitação de tamanho de arquivo
        if (file.size > 5 * 1024 * 1024) {
          const message = "A imagem deve ter no máximo 5MB";
          toast.error("Erro no upload", { description: message });
          return reject(message);
        }
        const config = {
          bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME,
          region: process.env.NEXT_PUBLIC_AWS_REGION,
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
          s3Url: process.env.NEXT_PUBLIC_BUCKET_URL,
        };

        // @ts-ignore
        const s3 = new S3(config);

        const params = {
          Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
          Key: file.name,
          Body: file,
          ContentType: file.type,
          ACL: "public-read",
        };

        const resUpload = await s3.upload(params).promise();

        toast.success("Upload concluído", {
          description: "A imagem foi carregada com sucesso.",
        });

        return resolve(resUpload.Location);
      } catch (err) {
        console.error("Erro no upload:", err);
        toast.error("Erro no upload", {
          description: "Erro ao processar o arquivo",
        });
        reject("Erro no upload");
      }
    });
  },

  resetUpload: () => {
    set({ status: "idle", preview: null, error: null });
  },
}));
