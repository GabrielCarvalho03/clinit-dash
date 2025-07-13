import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Info,
  Smile,
  User,
  ArrowLeft,
  RefreshCw,
  Download,
  FileText,
  Zap,
  History,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ImageCompare } from "../compare-image/Compare-image";
import { useSimulationResults } from "../../hooks/use-simulation-results/use-simulation-results";
import { useSimulationHistoric } from "../../hooks/use-simulation-historic/use-simulation-results";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { useSimulations } from "../../hooks/use-simulations/use-simulation";
import { useRouter } from "next/navigation";

interface SimulacaoResultadosProps {
  originalImage: string | null;
  results: string[];
  currentConfig: any;
  onSimulationComplete: (results: string[]) => void;
  onGoBack: () => void;
  onSave: (simulacao: any) => void;
}

export const SimulacaoResultados = ({
  originalImage,
  results,
  currentConfig,
}: SimulacaoResultadosProps) => {
  const router = useRouter();
  const { setActiveTab } = useSimulations();
  const { imageResult } = useSimulationResults();
  const { saveHistoric } = useSimulationHistoric();
  const { clinic } = useAuth();

  const [isRefazing, setIsRefazing] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [showRefazer, setShowRefazer] = useState(false);
  const [comandoEspecifico, setComandoEspecifico] = useState("");
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const simulationResult =
    results.length > 0 && originalImage
      ? {
          image: imageResult,
          config: currentConfig,
          tipo: currentConfig?.tipo || ("sorriso" as const),
        }
      : null;

  const handleBaixarESalvar = async () => {
    if (!imageResult) return;

    const simulationAdaper = {
      id: "",
      resultado: imageResult,
      photo: imageResult,
      tipo: currentConfig?.tipo || ("sorriso" as const),
      clinicId: clinic?.id,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSavingImage(true);
      await saveHistoric(simulationAdaper);
      const response = await fetch(imageResult);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `simulacao-resultado-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // limpa da memória

      toast.success("Download realizado e simulação salva no histórico!");
      setShowCompletionDialog(true);
    } catch (err) {
      toast.error("Erro ao baixar a imagem.");
      console.error("Erro no download:", err);
    } finally {
      setIsSavingImage(false);
    }
  };

  const getTipoIcon = (tipo: "sorriso" | "harmonizacao") => {
    return tipo === "sorriso" ? (
      <Smile className="h-6 w-6" />
    ) : (
      <User className="h-6 w-6" />
    );
  };

  const getTipoBadge = (tipo: "sorriso" | "harmonizacao") => {
    if (tipo === "sorriso") {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <Smile className="mr-1 h-3 w-3" />
          Tratamento Odontológico
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
        <User className="mr-1 h-3 w-3" />
        Harmonização Facial
      </Badge>
    );
  };

  const handlebacktoSimulation = () => {
    setActiveTab("upload");
  };

  if (!originalImage || !simulationResult) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium">
              Nenhuma simulação disponível
            </h3>
            <p className="text-muted-foreground">
              Gere uma simulação na aba "Nova Simulação" para ver os resultados
              aqui
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getTipoIcon(simulationResult.tipo)}
            <div>
              <h2 className="text-xl font-semibold">Resultado da Simulação</h2>
              <p className="text-muted-foreground">
                Compare o antes e depois do tratamento
              </p>
            </div>
          </div>
          {getTipoBadge(simulationResult.tipo)}
        </div>
      </div>

      {/* Comparação de Imagens */}
      <ImageCompare
        imagemAntes={originalImage}
        imagemDepois={simulationResult.image}
        tipo={simulationResult.tipo}
        configuracoes={simulationResult.config?.configuracoes || {}}
        isDrawingMode={isDrawingMode}
        onDrawingModeChange={setIsDrawingMode}
      />

      {/* Tratamento Aplicado */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configurações Aplicadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">
                Configurações utilizadas:
              </p>
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                {getConfiguracaoTexto() || "Nenhuma configuração específica"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Área de Refazer */}
      {showRefazer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Correções por Comando IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="comando">
                Descreva o que você gostaria de ajustar:
              </Label>
              <Textarea
                id="comando"
                placeholder="Ex: Deixar os dentes um pouco menos brancos, ou aumentar mais o volume dos lábios..."
                value={comandoEspecifico}
                onChange={(e) => setComandoEspecifico(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {}}
                disabled={isRefazing || !comandoEspecifico.trim()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {isRefazing ? "Refazendo..." : "Aplicar Correção"}
              </Button>
              <Button variant="outline" onClick={() => setShowRefazer(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações Principais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => handlebacktoSimulation()}
              variant="outline"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {/* <Button
              onClick={() => setShowRefazer(true)}
              variant="outline"
              size="lg"
              disabled={showRefazer}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Correções por Comando
            </Button> */}

            <Button
              disabled={isSavingImage}
              onClick={handleBaixarESalvar}
              size="lg"
            >
              {isSavingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando Imagem..
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Imagem e Salvar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Conclusão */}
      <Dialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Processo Concluído!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-6">
            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-muted-foreground">
                Sua simulação foi baixada e salva no histórico com sucesso
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push("/dashboard/quote/new-quote")}
                className="w-full"
                size="lg"
              >
                <FileText className="mr-2 h-4 w-4" />
                Gerar Orçamento
              </Button>

              <Button
                onClick={() => {
                  setShowCompletionDialog(false);
                  setActiveTab("upload");
                }}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Zap className="mr-2 h-4 w-4" />
                Gerar Nova Simulação
              </Button>

              <Button
                onClick={() => {
                  setShowCompletionDialog(false);
                  setActiveTab("historico");
                  // Ir para aba do histórico
                }}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <History className="mr-2 h-4 w-4" />
                Ir ao Histórico
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Aviso Importante */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Esta simulação é uma projeção para
          planejamento do tratamento. Resultados reais podem variar conforme
          características individuais do paciente.
        </AlertDescription>
      </Alert>
    </div>
  );
};
