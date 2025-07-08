"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Upload, History, Wand2, CheckCircle } from "lucide-react";
import { SimulationUpload } from "./components/simulation-upload/Simulation-upload";
import { SimulacaoResultados } from "./components/simulation-results/Simulation-results";
import { SimulationHistoric } from "./components/simulation-historic/simulation-historic";
import { toast } from "sonner";
import { useSimulations } from "./hooks/use-simulations/use-simulation-results";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { getUserRefresh } from "@/utils/get-user-refresh";
import { useSimulationHistoric } from "./hooks/use-simulation-historic/use-simulation-results";

const SimulacaoIA = () => {
  const { setActiveTab, activeTab } = useSimulations();
  const { getHistoric } = useSimulationHistoric();
  const { clinic, setClinic, isLoading, setIsLoading } = useAuth();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<string[]>([]);
  const [currentConfig, setCurrentConfig] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [simulationHistory, setSimulationHistory] = useState<any[]>([]);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  const handleSimulationStart = async (config: any) => {
    setIsGenerating(true);
    setCurrentConfig(config);

    console.log("Iniciando simulação com configuração:", config);
    console.log("Prompt automático incluído:", config.prompt);

    // Simula o processo de geração da IA
    toast.loading("Gerando simulação...", { id: "generating" });

    try {
      // Simula o resultado gerado
      const resultadoGerado = "/placeholder.svg"; // Aqui seria a imagem gerada pela IA
      setSimulationResults([resultadoGerado]);

      toast.success("Simulação gerada com sucesso!", { id: "generating" });
    } catch (error) {
      toast.error("Erro ao gerar simulação. Tente novamente.", {
        id: "generating",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulationComplete = (results: string[]) => {
    setSimulationResults(results);
  };

  const handleGoBack = () => {
    setActiveTab("upload");
  };

  const handleSaveSimulation = (simulacao: any) => {
    setSimulationHistory((prev) => [simulacao, ...prev]);
    setActiveTab("historico");
  };

  const loadScreen = async () => {
    await getUserRefresh(setClinic, setIsLoading);
    await getHistoric();
  };
  useEffect(() => {
    if (!clinic?.id) loadScreen();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border border-t-transparent border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Simulação de Tratamentos
          </h1>
          <p className="text-muted-foreground">
            Visualize o resultado dos tratamentos com IA
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
        >
          <Wand2 className="mr-1 h-3 w-3" />
          IA Avançada
        </Badge>
      </div>

      {isGenerating && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div>
                <p className="font-medium text-primary">
                  Gerando sua simulação...
                </p>
                <p className="text-sm text-muted-foreground">
                  Aplicando as configurações selecionadas com IA avançada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-muted/30 w-full justify-start p-1 border-b">
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-10 h-8"
              >
                <Upload className="mr-2 h-4 w-4" />
                Nova Simulação
              </TabsTrigger>
              <TabsTrigger
                value="resultados"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 h-8"
                disabled={simulationResults.length === 0}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Resultados
                {simulationResults.length > 0 && (
                  <CheckCircle className="ml-1 h-3 w-3 text-green-500" />
                )}
              </TabsTrigger>
              <TabsTrigger
                value="historico"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-6 h-8"
              >
                <History className="mr-2 h-4 w-4" />
                Histórico
                {simulationHistory.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 w-4 text-xs">
                    {simulationHistory.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="upload" className="mt-0">
                <SimulationUpload
                  onImageUpload={handleImageUpload}
                  onSimulationStart={handleSimulationStart}
                />
              </TabsContent>

              <TabsContent value="resultados" className="mt-0">
                <SimulacaoResultados
                  originalImage={uploadedImage}
                  results={simulationResults}
                  currentConfig={currentConfig}
                  onSimulationComplete={handleSimulationComplete}
                  onGoBack={handleGoBack}
                  onSave={handleSaveSimulation}
                />
              </TabsContent>

              <TabsContent value="historico" className="mt-0">
                <SimulationHistoric historico={simulationHistory} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulacaoIA;
