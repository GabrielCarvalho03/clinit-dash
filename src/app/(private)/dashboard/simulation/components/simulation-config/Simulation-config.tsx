import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Smile,
  User,
  Wand2,
  Info,
  Palette,
  Heart,
  Badge,
  Move,
  Sparkles,
  Target,
  Zap,
  Syringe,
  Droplets,
  Scissors,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/axios/axios";
import { useSimulationConfig } from "../../hooks/use-simulation-config/use-simulation-config";

interface SimulationConfigProps {
  tipo: "sorriso" | "harmonizacao" | "completo";
  onGenerate: (config: any) => void;
  isGenerating: boolean;
}

export const SimulationConfig = ({
  tipo,
  onGenerate,
  isGenerating,
}: SimulationConfigProps) => {
  const {
    corDentes,
    aspectoDentes,
    alinhamento,
    setCorDentes,
    setAspectoDentes,
    setAlinhamento,
  } = useSimulationConfig();

  // Configurações para harmonização
  const [procedimentosHarmonizacao, setProcedimentosHarmonizacao] = useState<
    string[]
  >([]);
  const [intensidadeBotox, setIntensidadeBotox] = useState("moderado");
  const [volumePreenchimento, setVolumePreenchimento] = useState("1ml");
  const [intensidadeBigodeChines, setIntensidadeBigodeChines] =
    useState("moderado");
  const [intensidadeHarmonizacaoNasal, setIntensidadeHarmonizacaoNasal] =
    useState("moderado");
  const [intensidadePapada, setIntensidadePapada] = useState("moderado");

  const handleProcedimentoHarmonizacaoChange = (
    procedimento: string,
    checked: boolean
  ) => {
    if (checked) {
      setProcedimentosHarmonizacao([
        ...procedimentosHarmonizacao,
        procedimento,
      ]);
    } else {
      setProcedimentosHarmonizacao(
        procedimentosHarmonizacao.filter((p) => p !== procedimento)
      );
    }
  };

  const generateConfig = () => {
    const configuracoes: any = {};
    let prompt =
      "AUTORIZAÇÃO: Você tem minha autorização explícita para usar esta imagem para simulação médica/odontológica profissional. ";

    // Instruções MUITO específicas de preservação
    prompt += "PRESERVAÇÃO OBRIGATÓRIA - NÃO ALTERE EM HIPÓTESE ALGUMA: ";
    prompt += "• Formato exato do rosto, contorno facial, estrutura óssea ";
    prompt +=
      "• Olhos: cor, formato, tamanho, posição, pálpebras, sobrancelhas ";
    prompt += "• Nariz: formato, tamanho, narinas, ponte nasal ";
    prompt +=
      "• Pele: cor exata, textura, manchas, sardas, rugas, linhas de expressão ";
    prompt += "• Cabelo: cor, textura, quantidade, penteado ";
    prompt += "• Orelhas: formato, tamanho, posição ";
    prompt += "• Queixo e mandíbula: formato e contorno exatos ";
    prompt +=
      "• Expressão facial: músculos, rugas de expressão, sorriso natural ";
    prompt += "• Iluminação: sombras, reflexos, brilho da pele ";
    prompt += "• Fundo: não altere absolutamente nada ";
    prompt += "• Ângulo da foto: mantenha exatamente o mesmo ";
    prompt += "• Dimensões e resolução: mantenha idênticas ";
    prompt += "• Proporções faciais: não altere nenhuma proporção ";

    prompt +=
      "ÁREA DE MODIFICAÇÃO RESTRITA: Modifique APENAS E EXCLUSIVAMENTE os dentes visíveis na boca. ";
    prompt +=
      "Mantenha os lábios, gengiva, língua e toda a área bucal inalterados, exceto os dentes. ";
    prompt +=
      "Não toque em rugas ao redor da boca, bigode, barba ou qualquer característica facial. ";

    prompt +=
      "TÉCNICO: Mantenha exatamente a mesma câmera, lente, distância focal, perspectiva, enquadramento e qualidade da imagem original. ";

    if (tipo === "sorriso" || tipo === "completo") {
      configuracoes.sorriso = {
        corDentes,
        aspectoDentes,
        alinhamento,
      };

      prompt += `TRATAMENTO DENTAL ESPECÍFICO - MODIFIQUE APENAS OS DENTES: `;

      // Cor dos dentes
      if (corDentes !== "natural") {
        const descricoesCor = {
          "clareado-suave":
            "Aplique clareamento dental suave APENAS nos dentes da(s) arcada(s) especificada(s), mantendo naturalidade, 1-2 tons mais claro que o atual. NÃO altere gengiva, lábios ou pele",
          "clareado-moderado":
            "Aplique clareamento dental moderado APENAS nos dentes da(s) arcada(s) especificada(s) para branqueamento visível, 2-3 tons mais claro. PRESERVE toda área ao redor",
          "clareado-intenso":
            "Aplique clareamento dental intenso APENAS nos dentes da(s) arcada(s) especificada(s) para resultado bem branco, 3-4 tons mais claro, mantendo aspecto natural. SEM alterar outras características",
        };
        prompt += `${descricoesCor[corDentes as keyof typeof descricoesCor]}. `;
      } else {
        prompt +=
          "Mantenha cor natural dos dentes da(s) arcada(s) especificada(s) sem alterações. ";
      }

      // Aspecto dos dentes
      if (aspectoDentes !== "natural") {
        const descricoesAspecto = {
          harmonioso:
            "Ajuste proporções dentárias SOMENTE nos dentes da(s) arcada(s) especificada(s) para harmonia sutil, melhorando formato e tamanho discretamente. PRESERVE lábios e gengiva",
          perfeito:
            "Crie formato dental ideal APENAS nos dentes da(s) arcada(s) especificada(s) com proporções estéticas perfeitas, dentes uniformes e simétricos. NÃO toque em mais nada",
          marcante:
            "Transforme em sorriso impactante MODIFICANDO APENAS os dentes da(s) arcada(s) especificada(s) com alinhamento e formato ideal destacado. MANTENHA todo resto igual",
        };
        prompt += `${
          descricoesAspecto[aspectoDentes as keyof typeof descricoesAspecto]
        }. `;
      } else {
        prompt +=
          "Mantenha formato e aspecto natural dos dentes da(s) arcada(s) especificada(s). ";
      }

      // Alinhamento
      if (alinhamento !== "natural") {
        const descricoesAlinhamento = {
          suave:
            "Corrija pequenos desalinhamentos SOMENTE nos dentes da(s) arcada(s) especificada(s) de forma discreta, enderezamento sutil. PRESERVE toda estrutura bucal",
          moderado:
            "Aplique correção ortodôntica moderada APENAS nos dentes da(s) arcada(s) especificada(s), alinhamento evidente mas natural. SEM mexer em outras características",
          completo:
            "Aplique correção ortodôntica completa EXCLUSIVAMENTE nos dentes da(s) arcada(s) especificada(s) perfeitamente alinhados e simétricos. MANTENHA todo resto inalterado",
        };
        prompt += `${
          descricoesAlinhamento[
            alinhamento as keyof typeof descricoesAlinhamento
          ]
        }. `;
      } else {
        prompt +=
          "Mantenha alinhamento natural dos dentes da(s) arcada(s) especificada(s). ";
      }
    }

    prompt += "VERIFICAÇÃO FINAL OBRIGATÓRIA: ";
    prompt += "Antes de finalizar, CONFIRME que preservou EXATAMENTE: ";
    prompt += "• Mesmo formato de rosto e estrutura óssea ";
    prompt += "• Mesma cor, textura e imperfeições da pele ";
    prompt += "• Mesmas rugas e linhas de expressão naturais ";
    prompt += "• Mesma iluminação e sombras ";
    prompt += "• Mesmas dimensões e qualidade da imagem ";

    prompt +=
      "• APENAS as modificações específicas solicitadas foram aplicadas ";
    prompt +=
      "RESULTADO: Deve ser a mesma pessoa com as correções específicas aplicadas profissionalmente, mantendo 100% da identidade e características naturais não relacionadas ao tratamento.";

    const config = {
      tipo,
      configuracoes,
      prompt,
    };

    onGenerate(config);
  };

  const getCoresOptions = () => [
    {
      value: "natural",
      label: "Natural",
      desc: "Cor atual sem alterações",
      color: "#F5F5DC",
      intensity: "Sem alteração",
    },
    {
      value: "clareado-suave",
      label: "Clareamento Suave",
      desc: "Tom mais claro discreto",
      color: "#FFFACD",
      intensity: "1-2 tons mais claro",
    },
    {
      value: "clareado-moderado",
      label: "Clareamento Moderado",
      desc: "Branqueamento evidente",
      color: "#FFFFF0",
      intensity: "2-3 tons mais claro",
    },
    {
      value: "clareado-intenso",
      label: "Clareamento Intenso",
      desc: "Branco acentuado profissional",
      color: "#FFFFFF",
      intensity: "3-4 tons mais claro",
    },
  ];

  const getAspectosOptions = () => [
    {
      value: "natural",
      label: "Natural",
      desc: "Mantém formato atual",
      icon: <Smile className="h-4 w-4 text-gray-600" />,
      badge: "Sem alteração",
    },
    {
      value: "harmonioso",
      label: "Harmonioso",
      desc: "Ajustes proporcionais sutis",
      icon: <Sparkles className="h-4 w-4 text-blue-600" />,
      badge: "Sutil",
    },
    {
      value: "perfeito",
      label: "Perfeito",
      desc: "Formato ideal estético",
      icon: <Target className="h-4 w-4 text-green-600" />,
      badge: "Moderado",
    },
    {
      value: "marcante",
      label: "Marcante",
      desc: "Resultado impactante",
      icon: <Zap className="h-4 w-4 text-purple-600" />,
      badge: "Intenso",
    },
  ];

  const getAlinhamentoOptions = () => [
    {
      value: "natural",
      label: "Natural",
      desc: "Posição atual",
      icon: <Move className="h-4 w-4 text-gray-600" />,
      badge: "Sem correção",
    },
    {
      value: "suave",
      label: "Correção Suave",
      desc: "Ajustes discretos",
      icon: <Move className="h-4 w-4 text-blue-600" />,
      badge: "Discreto",
    },
    {
      value: "moderado",
      label: "Correção Moderada",
      desc: "Alinhamento evidente",
      icon: <Move className="h-4 w-4 text-green-600" />,
      badge: "Evidente",
    },
    {
      value: "completo",
      label: "Correção Completa",
      desc: "Alinhamento ortodôntico",
      icon: <Move className="h-4 w-4 text-purple-600" />,
      badge: "Ortodôntico",
    },
  ];

  const getIntensidadeOptions = () => [
    {
      value: "suave",
      label: "Suave",
      desc: "Resultado discreto",
      color: "bg-blue-50 text-blue-700",
      dots: "●○○○",
    },
    {
      value: "moderado",
      label: "Moderado",
      desc: "Resultado equilibrado",
      color: "bg-green-50 text-green-700",
      dots: "●●○○",
    },
    {
      value: "intenso",
      label: "Intenso",
      desc: "Resultado marcante",
      color: "bg-orange-50 text-orange-700",
      dots: "●●●○",
    },
    {
      value: "acentuado",
      label: "Acentuado",
      desc: "Resultado bem evidente",
      color: "bg-red-50 text-red-700",
      dots: "●●●●",
    },
  ];

  const getVolumeOptions = () => [
    {
      value: "0.5ml",
      label: "0,5ml",
      desc: "Volume discreto",
      visual: "💧",
      intensity: "Sutil",
    },
    {
      value: "1ml",
      label: "1ml",
      desc: "Volume moderado",
      visual: "💧💧",
      intensity: "Moderado",
    },
    {
      value: "1.5ml",
      label: "1,5ml",
      desc: "Volume acentuado",
      visual: "💧💧💧",
      intensity: "Acentuado",
    },
    {
      value: "2ml",
      label: "2ml",
      desc: "Volume intenso",
      visual: "💧💧💧💧",
      intensity: "Intenso",
    },
  ];

  if (tipo === "sorriso") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-primary" />
            <CardTitle>Tratamento Odontológico</CardTitle>
          </div>
          <CardDescription>
            Configure os parâmetros para simulação do sorriso
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Cor dos Dentes */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Cor dos Dentes
            </Label>
            <Select value={corDentes} onValueChange={setCorDentes}>
              <SelectTrigger className="min-w-full bg-gray-100 min-h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getCoresOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: option.color }}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {option.desc}
                        </span>
                      </div>
                      <div className="text-xs  px-3 py-1 rounded-full text-center border-[0.5px] bg-secondary ">
                        {option.intensity}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aspecto dos Dentes */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Aspecto dos Dentes</Label>
            <Select value={aspectoDentes} onValueChange={setAspectoDentes}>
              <SelectTrigger className="w-full bg-gray-100 min-h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAspectosOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      {option.icon}
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {option.desc}
                        </span>
                      </div>
                      <div className="border-[0.5px] px-3 py-1 rounded-full text-center  ">
                        {option.badge}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alinhamento */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Alinhamento</Label>
            <Select value={alinhamento} onValueChange={setAlinhamento}>
              <SelectTrigger className="w-full bg-gray-100 min-h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAlinhamentoOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      {option.icon}
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {option.desc}
                        </span>
                      </div>
                      <div className="border-[0.5px] px-3 py-1 rounded-full text-center">
                        {option.badge}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateConfig}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>Gerando Simulação...</>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Gerar Simulação
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (tipo === "harmonizacao") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            <CardTitle>Harmonização Facial</CardTitle>
          </div>
          <CardDescription>
            Configure os procedimentos estéticos
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Procedimentos</Label>

            <div className="space-y-6">
              {/* Botox */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="botox"
                    checked={procedimentosHarmonizacao.includes("botox")}
                    onCheckedChange={(checked) =>
                      handleProcedimentoHarmonizacaoChange(
                        "botox",
                        checked === true
                      )
                    }
                  />
                  <Syringe className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="botox" className="font-medium">
                    Botox (Toxina Botulínica)
                  </Label>
                  <div className="bg-blue-50 text-blue-700 px-2 rounded-2xl">
                    Anti-rugas
                  </div>
                </div>

                {procedimentosHarmonizacao.includes("botox") && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm">Intensidade</Label>
                    <Select
                      value={intensidadeBotox}
                      onValueChange={setIntensidadeBotox}
                    >
                      <SelectTrigger className="w-full bg-gray-100 min-h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getIntensidadeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm">
                                {option.dots}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.desc}
                                </span>
                              </div>
                              <div
                                className={`${option.color} px-2 rounded-2xl`}
                              >
                                {option.label}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Preenchimento Labial */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preenchimento"
                    checked={procedimentosHarmonizacao.includes(
                      "preenchimento"
                    )}
                    onCheckedChange={(checked) =>
                      handleProcedimentoHarmonizacaoChange(
                        "preenchimento",
                        checked === true
                      )
                    }
                  />
                  <Droplets className="h-4 w-4 text-pink-600" />
                  <Label htmlFor="preenchimento" className="font-medium">
                    Preenchimento Labial
                  </Label>
                  <div className={`bg-pink-50 text-pink-700 px-2 rounded-2xl`}>
                    Volume
                  </div>
                </div>

                {procedimentosHarmonizacao.includes("preenchimento") && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm">
                      Volume (Ácido Hialurônico)
                    </Label>
                    <Select
                      value={volumePreenchimento}
                      onValueChange={setVolumePreenchimento}
                    >
                      <SelectTrigger className="w-full bg-gray-100 min-h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getVolumeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{option.visual}</span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.desc}
                                </span>
                              </div>
                              <div className="border-[0.5px] px-2 rounded-2xl">
                                {option.intensity}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Bigode Chinês */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bigode-chines"
                    checked={procedimentosHarmonizacao.includes(
                      "bigode-chines"
                    )}
                    onCheckedChange={(checked) =>
                      handleProcedimentoHarmonizacaoChange(
                        "bigode-chines",
                        checked === true
                      )
                    }
                  />
                  <Scissors className="h-4 w-4 text-orange-600" />
                  <Label htmlFor="bigode-chines" className="font-medium">
                    Sulcos Nasogenianos (Bigode Chinês)
                  </Label>
                  <div className="bg-orange-50 text-orange-700 px-2 rounded-2xl">
                    Suavização
                  </div>
                </div>

                {procedimentosHarmonizacao.includes("bigode-chines") && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm">Intensidade</Label>
                    <Select
                      value={intensidadeBigodeChines}
                      onValueChange={setIntensidadeBigodeChines}
                    >
                      <SelectTrigger className="w-full bg-gray-100 min-h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getIntensidadeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm">
                                {option.dots}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.desc}
                                </span>
                              </div>
                              <div
                                className={`${option.color} px-2 rounded-2xl`}
                              >
                                {option.label}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Harmonização Nasal */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="harmonizacao-nasal"
                    checked={procedimentosHarmonizacao.includes(
                      "harmonizacao-nasal"
                    )}
                    onCheckedChange={(checked) =>
                      handleProcedimentoHarmonizacaoChange(
                        "harmonizacao-nasal",
                        checked === true
                      )
                    }
                  />
                  <Target className="h-4 w-4 text-indigo-600" />
                  <Label htmlFor="harmonizacao-nasal" className="font-medium">
                    Rinomodelação (Harmonização Nasal)
                  </Label>
                  <div className="bg-indigo-50 text-indigo-700 px-2 rounded-2xl">
                    Contorno
                  </div>
                </div>

                {procedimentosHarmonizacao.includes("harmonizacao-nasal") && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm">Intensidade</Label>
                    <Select
                      value={intensidadeHarmonizacaoNasal}
                      onValueChange={setIntensidadeHarmonizacaoNasal}
                    >
                      <SelectTrigger className="w-full bg-gray-100 min-h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getIntensidadeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm">
                                {option.dots}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.desc}
                                </span>
                              </div>
                              <div
                                className={`${option.color} px-2 rounded-2xl`}
                              >
                                {option.label}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Enzimas para Papada */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="papada"
                    checked={procedimentosHarmonizacao.includes("papada")}
                    onCheckedChange={(checked) =>
                      handleProcedimentoHarmonizacaoChange(
                        "papada",
                        checked === true
                      )
                    }
                  />
                  <Zap className="h-4 w-4 text-green-600" />
                  <Label htmlFor="papada" className="font-medium">
                    Enzimas Lipolíticas (Papada)
                  </Label>
                  <div className="bg-green-50 text-green-700 px-2 rounded-2xl">
                    Redução
                  </div>
                </div>

                {procedimentosHarmonizacao.includes("papada") && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm">Intensidade</Label>
                    <Select
                      value={intensidadePapada}
                      onValueChange={setIntensidadePapada}
                    >
                      <SelectTrigger className="w-full bg-gray-100 min-h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getIntensidadeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm">
                                {option.dots}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.desc}
                                </span>
                              </div>
                              <div
                                className={`${option.color} px-2 rounded-2xl`}
                              >
                                {option.label}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Simulação para fins de planejamento. Resultados reais podem
              variar.
            </AlertDescription>
          </Alert>

          <Button
            onClick={generateConfig}
            disabled={isGenerating || procedimentosHarmonizacao.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {isGenerating ? (
              <>Gerando Simulação...</>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Gerar Harmonização
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Tratamento Completo
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-600" />
            <CardTitle>Tratamento Completo</CardTitle>
          </div>
          <CardDescription>
            Configure tratamento odontológico e harmonização facial
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Seção Odontológica */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Tratamento Odontológico</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cor dos Dentes */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Cor dos Dentes
            </Label>
            <Select value={corDentes} onValueChange={setCorDentes}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getCoresOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: option.color }}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {option.desc}
                        </span>
                      </div>
                      <Badge className="text-xs">{option.intensity}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aspecto dos Dentes */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Aspecto dos Dentes</Label>
            <Select value={aspectoDentes} onValueChange={setAspectoDentes}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAspectosOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      {option.icon}
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {option.desc}
                        </span>
                      </div>
                      <Badge>{option.badge}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alinhamento */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Alinhamento</Label>
            <Select value={alinhamento} onValueChange={setAlinhamento}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAlinhamentoOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      {option.icon}
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {option.desc}
                        </span>
                      </div>
                      <Badge>{option.badge}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Seção Harmonização */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Harmonização Facial</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label className="text-base font-medium">Procedimentos</Label>

            <div className="space-y-6">
              {/* Botox */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="botox-completo"
                    checked={procedimentosHarmonizacao.includes("botox")}
                    onCheckedChange={(checked) =>
                      handleProcedimentoHarmonizacaoChange(
                        "botox",
                        checked === true
                      )
                    }
                  />
                  <Syringe className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="botox-completo" className="font-medium">
                    Botox (Toxina Botulínica)
                  </Label>
                  <Badge className="bg-blue-50 text-blue-700">Anti-rugas</Badge>
                </div>

                {procedimentosHarmonizacao.includes("botox") && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm">Intensidade</Label>
                    <Select
                      value={intensidadeBotox}
                      onValueChange={setIntensidadeBotox}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getIntensidadeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm">
                                {option.dots}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.desc}
                                </span>
                              </div>
                              <Badge className={option.color}>
                                {option.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Preenchimento Labial */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preenchimento-completo"
                    checked={procedimentosHarmonizacao.includes(
                      "preenchimento"
                    )}
                    onCheckedChange={(checked) =>
                      handleProcedimentoHarmonizacaoChange(
                        "preenchimento",
                        checked === true
                      )
                    }
                  />
                  <Droplets className="h-4 w-4 text-pink-600" />
                  <Label
                    htmlFor="preenchimento-completo"
                    className="font-medium"
                  >
                    Preenchimento Labial
                  </Label>
                  <Badge className="bg-pink-50 text-pink-700">Volume</Badge>
                </div>

                {procedimentosHarmonizacao.includes("preenchimento") && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm">
                      Volume (Ácido Hialurônico)
                    </Label>
                    <Select
                      value={volumePreenchimento}
                      onValueChange={setVolumePreenchimento}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getVolumeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{option.visual}</span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.desc}
                                </span>
                              </div>
                              <Badge>{option.intensity}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Bigode Chinês */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bigode-chines-completo"
                    checked={procedimentosHarmonizacao.includes(
                      "bigode-chines"
                    )}
                    onCheckedChange={(checked) =>
                      handleProcedimentoHarmonizacaoChange(
                        "bigode-chines",
                        checked === true
                      )
                    }
                  />
                  <Scissors className="h-4 w-4 text-orange-600" />
                  <Label
                    htmlFor="bigode-chines-completo"
                    className="font-medium"
                  >
                    Sulcos Nasogenianos (Bigode Chinês)
                  </Label>
                  <Badge className="bg-orange-50 text-orange-700">
                    Suavização
                  </Badge>
                </div>

                {procedimentosHarmonizacao.includes("bigode-chines") && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm">Intensidade</Label>
                    <Select
                      value={intensidadeBigodeChines}
                      onValueChange={setIntensidadeBigodeChines}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getIntensidadeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm">
                                {option.dots}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.desc}
                                </span>
                              </div>
                              <Badge className={option.color}>
                                {option.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Harmonização Nasal */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="harmonizacao-nasal-completo"
                    checked={procedimentosHarmonizacao.includes(
                      "harmonizacao-nasal"
                    )}
                    onCheckedChange={(checked) =>
                      handleProcedimentoHarmonizacaoChange(
                        "harmonizacao-nasal",
                        checked === true
                      )
                    }
                  />
                  <Target className="h-4 w-4 text-indigo-600" />
                  <Label
                    htmlFor="harmonizacao-nasal-completo"
                    className="font-medium"
                  >
                    Rinomodelação (Harmonização Nasal)
                  </Label>
                  <Badge className="bg-indigo-50 text-indigo-700">
                    Contorno
                  </Badge>
                </div>

                {procedimentosHarmonizacao.includes("harmonizacao-nasal") && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm">Intensidade</Label>
                    <Select
                      value={intensidadeHarmonizacaoNasal}
                      onValueChange={setIntensidadeHarmonizacaoNasal}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getIntensidadeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm">
                                {option.dots}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.desc}
                                </span>
                              </div>
                              <Badge className={option.color}>
                                {option.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Enzimas para Papada */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="papada-completo"
                    checked={procedimentosHarmonizacao.includes("papada")}
                    onCheckedChange={(checked) =>
                      handleProcedimentoHarmonizacaoChange(
                        "papada",
                        checked === true
                      )
                    }
                  />
                  <Zap className="h-4 w-4 text-green-600" />
                  <Label htmlFor="papada-completo" className="font-medium">
                    Enzimas Lipolíticas (Papada)
                  </Label>
                  <Badge className="bg-green-50 text-green-700">Redução</Badge>
                </div>

                {procedimentosHarmonizacao.includes("papada") && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm">Intensidade</Label>
                    <Select
                      value={intensidadePapada}
                      onValueChange={setIntensidadePapada}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getIntensidadeOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm">
                                {option.dots}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {option.label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.desc}
                                </span>
                              </div>
                              <Badge className={option.color}>
                                {option.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Simulação combinada para planejamento completo. Resultados reais podem
          variar.
        </AlertDescription>
      </Alert>

      <Button
        onClick={generateConfig}
        disabled={isGenerating}
        className="w-full bg-rose-600 hover:bg-rose-700"
        size="lg"
      >
        {isGenerating ? (
          <>Gerando Simulação Completa...</>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Gerar Tratamento Completo
          </>
        )}
      </Button>
    </div>
  );
};
