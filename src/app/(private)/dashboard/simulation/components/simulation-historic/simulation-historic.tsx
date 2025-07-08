import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Eye,
  Share2,
  Calendar,
  Smile,
  User,
  MoreVertical,
  Trash2,
  Search,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useSimulationHistoric } from "../../hooks/use-simulation-historic/use-simulation-results";
import { subDays } from "date-fns";
import { api } from "@/lib/axios/axios";

interface SimulacaoHistoricoProps {
  historico?: any[];
}

export const SimulationHistoric = ({}: SimulacaoHistoricoProps) => {
  const { simulationHistoric, setSimulationHistoric } = useSimulationHistoric();
  const [filtroData, setFiltroData] = useState<string>("");
  const [filtroOrdem, setFiltroOrdem] = useState<string>("data-desc");
  const [busca, setBusca] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [imagemVisualizada, setImagemVisualizada] = useState<string | null>(
    null
  );

  const handleDownload = async (id: string, thumbnail: string) => {
    const response = await fetch(thumbnail);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `simulacao-resultado-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // limpa da memória
    toast.success(`Download do resultado da simulação #${id} iniciado!`);
  };

  const handleView = (thumbnail: string) => {
    setImagemVisualizada(thumbnail);
  };

  const handleShare = (link: string) => {
    navigator.clipboard.writeText(link);
    window.open(link, "_blank");
    toast.success("Link copiado para a área de transferência!");
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await api.post("/simulations/delete", { id });
      const filteredRemovedSimulation = simulationHistoric.filter(
        (simulacao) => simulacao.id !== id
      );
      setSimulationHistoric(filteredRemovedSimulation);
      toast.success(`Simulação #${id} removida do histórico`);
    } catch (error) {
      toast.error("Erro ao deletar simulação");
    } finally {
      setIsDeleting(false);
    }
  };

  const getTipoBadge = (tipo: string) => {
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

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatarHora = (data: string) => {
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfiguracaoTexto = (item: any) => {
    if (item.tipo === "sorriso") {
      const config = item.configuracoes;
      const detalhes = [];
      if (config?.corDentes) detalhes.push(`Cor: ${config?.corDentes}`);
      if (config?.aspectoDentes)
        detalhes.push(`Aspecto: ${config?.aspectoDentes}`);
      if (config?.alinhamento)
        detalhes.push(`Alinhamento: ${config?.alinhamento}`);
      return detalhes.join(", ") || "Tratamento odontológico";
    } else {
      const procedimentos = item.configuracoes.procedimentos || [];
      return procedimentos.length > 0
        ? procedimentos.join(", ")
        : "Harmonização facial";
    }
  };

  const historicoFiltrado = simulationHistoric
    .filter((item) => {
      const matchBusca =
        busca === "" ||
        item.id.toString().includes(busca) ||
        getConfiguracaoTexto(item).toLowerCase().includes(busca.toLowerCase());

      const dataItem = subDays(new Date(item.createdAt), 1);
      const dataFiltro = subDays(new Date(filtroData), 1);

      const matchData =
        filtroData === "" || dataItem.getTime() >= dataFiltro.getTime();

      console.log("matchBusca:", dataFiltro);

      return matchBusca && matchData;
    })
    .sort((a, b) => {
      switch (filtroOrdem) {
        case "data-asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "data-desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "tipo-az":
          return a.tipo.localeCompare(b.tipo);
        case "tipo-za":
          return b.tipo.localeCompare(a.tipo);
        default:
          return 0;
      }
    });

  if (simulationHistoric.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium">
              Nenhuma simulação encontrada
            </h3>
            <p className="text-muted-foreground">
              Suas simulações aparecerão aqui após serem salvas
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por ID ou configuração..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        <Input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          className="w-full sm:w-32 h-9"
        />

        <Select value={filtroOrdem} onValueChange={setFiltroOrdem}>
          <SelectTrigger className="w-full sm:w-36 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data-desc">Mais recente</SelectItem>
            <SelectItem value="data-asc">Mais antiga</SelectItem>
            <SelectItem value="id-desc">ID maior</SelectItem>
            <SelectItem value="id-asc">ID menor</SelectItem>
            <SelectItem value="tipo-az">Tipo A-Z</SelectItem>
            <SelectItem value="tipo-za">Tipo Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {historicoFiltrado.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhuma simulação encontrada com os filtros aplicados
            </p>
          </div>
        ) : (
          historicoFiltrado.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted/50 rounded-lg overflow-hidden border">
                      <img
                        src={item.photo}
                        alt={`Simulação ${item.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">
                          Simulação #{item.id}
                        </h3>
                        {getTipoBadge(item.tipo)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatarData(item.createdAt)} às{" "}
                        {formatarHora(item.createdAt)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getConfiguracaoTexto(item)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(item.photo)}
                      className="h-8 px-2"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(item.id, item.photo)}
                      className="h-8 px-2"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleShare(item.photo)}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Compartilhar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600"
                        >
                          {isDeleting ? (
                            <Loader2 className="mr-2 h-4 w-4  text-red-600 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {historicoFiltrado.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando {historicoFiltrado.length} de {simulationHistoric.length}{" "}
          simulação(ões)
        </div>
      )}

      {/* Dialog para visualizar imagem */}
      <Dialog
        open={!!imagemVisualizada}
        onOpenChange={() => setImagemVisualizada(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">
            Visualizar resultado da simulação
          </DialogTitle>
          {imagemVisualizada && (
            <div className="p-4">
              <img
                src={imagemVisualizada}
                alt="Resultado da simulação"
                className="w-full h-auto object-contain rounded-lg max-h-[70vh]"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
