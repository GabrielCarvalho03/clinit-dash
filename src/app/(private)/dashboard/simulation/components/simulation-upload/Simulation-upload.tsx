import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Image as ImageIcon,
  AlertCircle,
  User,
  Smile,
  Heart,
  Camera,
  FileImage,
  Info,
  Badge,
} from "lucide-react";
import { toast } from "sonner";
import { SimulationConfig } from "../simulation-config/Simulation-config";
import { api } from "@/lib/axios/axios";
import { useSimulationResults } from "../../hooks/use-simulation-results/use-simulation-results";
import { useSimulations } from "../../hooks/use-simulations/use-simulation";
import { Label } from "@/components/ui/label";
import { useSimulationConfig } from "../../hooks/use-simulation-config/use-simulation-config";

interface SimulationUploadProps {
  onImageUpload: (imageUrl: string) => void;
  onSimulationStart: (config: any) => void;
}

export const SimulationUpload = ({
  onImageUpload,
  onSimulationStart,
}: SimulationUploadProps) => {
  const { setImageResult } = useSimulationResults();
  const { setActiveTab } = useSimulations();
  const { uploadedImage, uploadedFile, setUploadedImage, setUploadedFile } =
    useSimulationConfig();

  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "sorriso" | "harmonizacao" | "completo"
  >("sorriso");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 10MB permitido");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setUploadedFile(file);
      onImageUpload(result);
      setIsUploading(false);
      setShowConfig(true);
      toast.success("Imagem carregada! Agora configure o tratamento desejado.");
    };
    reader.readAsDataURL(file);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  function gerarPrompt(configPrompt: any) {
    return `
      Você tem minha autorização para usar esta imagem para fins de simulação odontológica/estética.
      Mantenha todas as características faciais originais da pessoa, como formato do rosto, olhos, pele, cabelo, expressão e textura da pele.
      Não mude o formato do rosto, olhos, nariz, pele, cabelo, nem expressão.
      Preserve totalmente a identidade da pessoa.
      Apenas faça as alterações solicitadas para o tratamento, sem descaracterizar a identidade.
      Apenas o sorriso deve ser modificado, conforme solicitado abaixo:
      ${configPrompt || ""}
    `;
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof File)) {
        reject(new Error("Arquivo inválido"));
        return;
      }

      if (!file.type.startsWith("image/")) {
        reject(new Error("Arquivo deve ser uma imagem"));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result); // Envia o base64 completo
        } else {
          reject(new Error("Erro ao converter arquivo para base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  const handleSimulationGenerate = async (config: any) => {
    if (!uploadedFile) {
      toast.error("Por favor, carregue uma imagem antes de gerar a simulação.");
      return;
    }

    try {
      toast.loading("Gerando simulação...", { id: "generating" });
      setIsUploading(true);
      const imageInbase64 = await fileToBase64(uploadedFile);

      const configComAutorizacao = {
        ...config,
        prompt: gerarPrompt(config.prompt),
        imagemOriginal: imageInbase64,
      };

      const response = await api.post(
        "/IA/generate-image",
        configComAutorizacao
      );

      if (response.data.url) {
        setImageResult(response.data.url);
        toast.success("Simulação gerada com sucesso!", { id: "generating" });
        onSimulationStart(configComAutorizacao);
        setActiveTab("resultados");
      } else {
        toast.error("Erro ao gerar simulação");
      }
    } catch (error) {
      console.error("Erro na geração:", error);
      toast.error("Erro ao gerar simulação. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload da Imagem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload da Imagem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Selecione uma foto do sorriso</Label>
            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage}
                    alt="Imagem carregada"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                  />
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Imagem carregada com sucesso
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadClick();
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Imagem
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-lg font-medium">
                        Clique para fazer upload
                      </p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG ou WEBP (máx. 10MB)
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">
                    <FileImage className="mr-2 h-4 w-4" />
                    Selecionar Arquivo
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Dicas para melhores resultados:</strong>
              <br />• Use foto com boa iluminação e qualidade
              <br />• Sorriso visível e bem enquadrado
              <br />• Evite fotos muito escuras ou borradas
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Configurações do Tratamento */}
      {uploadedImage && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Smile className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Configurar Tratamento</h3>
                <p className="text-sm text-muted-foreground">
                  Defina os parâmetros para a simulação odontológica
                </p>
              </div>
            </div>
            <div className="bg-blue-100 flex items-center justify-center text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              <Smile className="mr-1 h-3 w-3" />
              Odontológico
            </div>
          </div>

          <SimulationConfig
            tipo="sorriso"
            onGenerate={handleSimulationGenerate}
            isGenerating={isUploading}
          />
        </div>
      )}
    </div>
  );
};
