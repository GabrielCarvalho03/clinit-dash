"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFileUpload } from "@/hooks/use-file-upload/use-file-upload";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { QuoteFormData } from "@/hooks/use-quote/schema";
import { UseFormReturn } from "react-hook-form";

interface FileUploadProps {
  onFileUploaded: (file: File, preview: string) => void;
  initialPreview?: string;
  label?: string | React.ReactNode;
  compact?: boolean;
  onClear?: () => void;
  handleFileChangeUpdated?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  isLoadingUploading?: boolean;
  maxtotalImage?: number;
  form?: UseFormReturn<QuoteFormData>;
  indicative?:boolean
}

export const FileUpload = ({
  onFileUploaded,
  initialPreview,
  label = "Upload de Arquivo",
  compact = false,
  onClear,
  isLoadingUploading,
  maxtotalImage,
  form,
  indicative
}: FileUploadProps) => {
  const { status, preview, error, uploadFile, resetUpload } = useFileUpload();
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPreview) {
      console.log("FileUpload: Configurando preview inicial:", initialPreview);
      setCurrentPreview(initialPreview); // Garante que o preview inicial seja configurado corretamente
    }
  }, [initialPreview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (maxtotalImage) {
      const allTretatments = form?.getValues("treatments");

      const allImages = allTretatments
        ?.map((treatment) => treatment.treatmentImages)
        .flat();

      if (allImages && allImages.length >= maxtotalImage) {
        toast.error("Limite de imagens atingido", {
          description: "você só pode adicionar 4 imagens por orçamento",
        });

        return;
      }
    }

    try {
      setIsUploading(true);
      console.log("Iniciando upload de arquivo:", file.name, file.type);
      const fileUrl = await uploadFile(file);
      console.log("Upload concluído com sucesso, URL:", fileUrl);
      setCurrentPreview(fileUrl); // Atualiza o preview com a URL do arquivo
      onFileUploaded(file, fileUrl);
      setIsUploading(false);

      toast("Upload concluído", {
        description: "A imagem foi carregada com sucesso",
      });
    } catch (err) {
      console.error("Falha no upload:", err);
      setIsUploading(false);
      toast.error("Erro no upload", {
        description:
          typeof err === "string"
            ? err
            : "Não foi possível fazer o upload da imagem.",
      });
    }
  };

  const handleClearFile = () => {
    resetUpload();
    setCurrentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`space-y-${compact ? "2" : "4"}`}>
      {typeof label === "string" ? (
        <p className="text-sm font-medium">{label}</p>
      ) : (
        label
      )}

      {currentPreview ? (
        <div className="relative rounded-md overflow-hidden border">
          <img
            src={currentPreview} // Usa a URL do arquivo
            alt="Preview"
            className={`w-full ${compact ? "h-32" : "h-48"} object-cover`}
            style={{ backgroundColor: "transparent" }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleClearFile}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed ${
            compact ? "p-3" : "p-6"
          }`}
        >
          <Camera
            size={compact ? 32 : 48}
            className="mb-4 text-muted-foreground"
          />
       {indicative &&    <p className="mb-2 text-sm font-medium">
            Arraste uma imagem ou clique para fazer upload
          </p>}
          <p className="mb-4 text-xs text-muted-foreground">
            Formatos suportados: PNG, JPG, GIF. Máximo 5MB.
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e)}
            className="hidden"
            id="file-upload"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Selecionar Arquivo
              </>
            )}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
