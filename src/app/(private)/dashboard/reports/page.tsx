"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  DownloadCloud,
  Edit,
  Eye,
  Loader2,
  Download,
  Trash,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuote } from "@/hooks/use-cotes/use-cotes";
import { format, addDays, parseISO, subMonths, subYears } from "date-fns";
import { de, ptBR } from "date-fns/locale";
import { formatCurrency } from "@/utils/formart";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuotePreviewPDF } from "@/app/(private)/dashboard/quote/components/quote/QuotePreviewPDF";
import { QuotePdf } from "@/@types/quotes";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { prepareQuotePdfData } from "@/utils/quoteDataPreparation";
import { useRouter } from "next/navigation";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";
import { getUserRefresh } from "@/utils/get-user-refresh";
import { MyPDFDocument } from "./pdf/rerender";
import { pdf } from "@react-pdf/renderer";
import { api } from "@/lib/axios/axios";
import { CardInfoReports } from "./components/card-info-reports/card-info-reports";

type SortField = "patient" | "dentist" | "date" | "value" | "status";
type SortOrder = "asc" | "desc";

const Reports = () => {
  const route = useRouter();
  const { clinic, isLoading, setClinic, setIsLoading } = useAuth();
  const { dentists, handleGetDentists } = useAnalytics();
  const {
    quotes,
    loadingDeleteQuote,
    loadingUpdateQuote,
    editQuote,
    updateQuoteStatus,
    deleteQuote,
    getQuote,
  } = useQuote();

  const [dentistFilter, setDentistFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isPreview, setIsPreview] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<QuotePdf | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);
  const [quoteToUpdate, setQuoteToUpdate] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filteredQuotes = quotes?.filter((quote) => {
    if (dentistFilter !== "all" && quote.dentistId !== dentistFilter) {
      return false;
    }

    if (periodFilter !== "all") {
      const quoteDate = new Date(quote.createdAt);
      const now = new Date();

      if (periodFilter === "month") {
        const oneMonthAgo = subMonths(now, 1);
        if (quoteDate < oneMonthAgo) return false;
      } else if (periodFilter === "quarter") {
        const threeMonthsAgo = subMonths(now, 3);
        if (quoteDate < threeMonthsAgo) return false;
      } else if (periodFilter === "year") {
        const oneYearAgo = subYears(now, 1);
        if (quoteDate < oneYearAgo) return false;
      } else if (periodFilter === "custom") {
        if (startDate && quoteDate < startDate) return false;
        if (endDate) {
          const nextDay = addDays(endDate, 1);
          if (quoteDate >= nextDay) return false;
        }
      }
    }

    return true;
  });

  const totalQuotes = filteredQuotes.length;
  const totalValue = filteredQuotes.reduce(
    (sum, q) =>
      sum + q.treatments.reduce((t, treatment) => t + treatment.price, 0),
    0
  );

  const paidQuotesCount = filteredQuotes.filter(
    (q) => q.status === "paid"
  ).length;
  const paidQuotesValue = filteredQuotes
    .filter((q) => q.status === "paid")
    .reduce(
      (sum, q) =>
        sum + q.treatments.reduce((t, treatment) => t + treatment.price, 0),
      0
    );
  const conversionRate =
    totalQuotes > 0 ? (paidQuotesCount / totalQuotes) * 100 : 0;

  async function getBase64FromUrl(url: string): Promise<string> {
    // Se a URL já for Base64 ou Blob, retorna ela mesma
    if (url.startsWith("data:") || url.startsWith("blob:")) {
      return url;
    }

    try {
      const response = await api.post("/files/get", { url });
      // Assume que a resposta.data.base64 já inclui o prefixo 'data:image/jpeg;base64,' ou similar
      return response.data.base64;
    } catch (err) {
      console.warn("Erro ao converter imagem para base64:", url, err);
      // Retorna uma string vazia ou um placeholder em caso de erro,
      // ou você pode re-throw o erro se quiser que a geração do PDF falhe.
      return ""; // Ou uma URL de imagem de placeholder genérica
    }
  }

  async function generateProposalPDF({
    setExporting,
    quote,
  }: {
    setExporting: React.Dispatch<React.SetStateAction<boolean>>;
    quote?: QuotePdf;
  }) {
    const quoteDataForPdf = JSON.parse(JSON.stringify(quote)) as QuotePdf;
    if (!quote) {
      console.error("Nenhum dado de cotação fornecido.");
      return;
    }

    setExporting(true);

    // Logo da clínica
    if (
      quoteDataForPdf.clinic.logo &&
      quoteDataForPdf.clinic.logo.trim() !== ""
    ) {
      quoteDataForPdf.clinic.logo = await getBase64FromUrl(
        quoteDataForPdf.clinic.logo
      );
    }

    // Foto do dentista
    if (
      quoteDataForPdf.dentist.photo &&
      quoteDataForPdf.dentist.photo.trim() !== ""
    ) {
      quoteDataForPdf.dentist.photo = await getBase64FromUrl(
        quoteDataForPdf.dentist.photo
      );
    }

    // Ilustrações (mapeie cada imagem para sua versão Base64)
    if (
      quoteDataForPdf.illustrations &&
      quoteDataForPdf.illustrations.length > 0
    ) {
      const convertedIllustrations = await Promise.all(
        quoteDataForPdf.illustrations.map(async (img) => {
          if (img.url && img.url.trim() !== "") {
            const base64Url = await getBase64FromUrl(img.url);
            return { ...img, url: base64Url };
          }
          return img; // Retorna a imagem original se não tiver URL
        })
      );
      // Filtra ilustrações que falharam na conversão ou não tinham URL
      quoteDataForPdf.illustrations = convertedIllustrations.filter(
        (img) => img.url && img.url.trim() !== ""
      );
    }

    // Ativa o estado de exportando

    try {
      // 1. Crie a instância do seu documento PDF com os dados
      const doc = <MyPDFDocument quoteData={quoteDataForPdf} />;

      // 2. Gere o blob do PDF usando o método 'pdf' do react-pdf/renderer
      const blob = await pdf(doc).toBlob();

      // 3. Defina o nome do arquivo
      const fileName = `Proposta-${quote.patientName}-${format(
        new Date(quote.date),
        "dd-MM-yyyy"
      )}.pdf`;

      // 4. Crie um URL para o Blob
      const url = URL.createObjectURL(blob);

      // ABORDAGEM A: Abrir em uma nova aba (mais comum para visualização)
      window.open(url, "_blank");

      // ABORDAGEM B: Forçar o download usando um link dinâmico (Substitui saveAs)
      // Se você não quer usar file-saver, esta é a alternativa nativa do navegador
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // Define o nome do arquivo para download
      document.body.appendChild(a); // Adiciona o link ao DOM (temporariamente)
      a.click(); // Simula um clique no link para iniciar o download
      document.body.removeChild(a); // Remove o link do DOM

      // Lembre-se de revogar o URL para liberar memória
      URL.revokeObjectURL(url);

      console.log("PDF gerado e aberto/baixado sem file-saver.");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      // toast.error("Erro ao gerar PDF", {
      //   description: "Ocorreu um erro ao gerar o PDF.",
      // });
    } finally {
      setExporting(false); // Desativa o estado de exportando
    }
  }

  const handleEditQuote = (id: string) => {
    editQuote(id);
    route.push("/dashboard/quote/edit-quote");
  };

  const handleDeleteQuote = (id: string) => {
    setQuoteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteQuote = async () => {
    if (quoteToDelete) {
      await deleteQuote(quoteToDelete);
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  };

  const handleViewQuote = (id: string) => {
    const quote = quotes.find((q) => q.id === id);
    if (!quote || !clinic) return;

    const dentist = dentists?.find((d) => d.id === quote.dentistId);
    if (!dentist) return;

    const quotePdfData = prepareQuotePdfData(quote, clinic, dentist);

    setSelectedQuote(quotePdfData);
    setViewDialogOpen(true);
  };

  const handleStatusChange = (
    id: string,
    status: "final" | "paid" | "follow"
  ) => {
    setQuoteToUpdate(id);
    updateQuoteStatus(id, status);
  };

  useEffect(() => {
    loadScreen();
  }, []);

  const loadScreen = async () => {
    const clinicData = await getUserRefresh(setClinic, setIsLoading);
    Promise.all([
      getQuote(clinicData?.id || ""),
      handleGetDentists(clinicData?.id || ""),
    ]);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border border-t-transparent border-primary"></div>
      </div>
    );
  }

  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    let compareValue = 0;

    switch (sortField) {
      case "patient":
        compareValue = a.patientName.localeCompare(b.patientName);
        break;
      case "dentist":
        const dentistA =
          dentists.find((d) => d.id === a.dentistId)?.name || "Desconhecido";
        const dentistB =
          dentists.find((d) => d.id === b.dentistId)?.name || "Desconhecido";
        compareValue = dentistA.localeCompare(dentistB);
        break;
      case "date":
        compareValue =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "value":
        const totalA = a.treatments.reduce((sum, t) => sum + t.price, 0);
        const totalB = b.treatments.reduce((sum, t) => sum + t.price, 0);
        compareValue = totalA - totalB;
        break;
      case "status":
        compareValue = a.status.localeCompare(b.status);
        break;
      default:
        compareValue = 0;
    }

    return sortOrder === "asc" ? compareValue : -compareValue;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Analise o desempenho dos orçamentos da clínica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CardInfoReports
          title="Total de Orçamentos"
          text={totalQuotes.toString()}
        />

        <CardInfoReports
          title="Valor Total Orçado"
          text={formatCurrency(totalValue)}
        />

        <CardInfoReports
          title="Valor Total Vendido"
          text={formatCurrency(paidQuotesValue)}
        />

        <CardInfoReports
          title="Taxa de Conversão"
          text={conversionRate.toFixed(1) + "%"}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Orçamentos Gerados</CardTitle>
              <CardDescription>
                Lista de todos os orçamentos criados pela clínica.
              </CardDescription>
            </div>

            <div className="flex items-center gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dentist">Dentista</Label>
                  <Select
                    value={dentistFilter}
                    onValueChange={setDentistFilter}
                  >
                    <SelectTrigger id="dentist">
                      <SelectValue placeholder="Selecione um dentista" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {dentists?.map((dentist) => (
                        <SelectItem key={dentist.id} value={dentist.id}>
                          {dentist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="period">Período</Label>
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Selecione um período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todo período</SelectItem>
                      <SelectItem value="month">Último mês</SelectItem>
                      <SelectItem value="quarter">Último trimestre</SelectItem>
                      <SelectItem value="year">Último ano</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {periodFilter === "custom" && (
                <div className="flex gap-2 items-end">
                  <div>
                    <Label>De</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[130px] pl-3 text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          {startDate ? (
                            format(startDate, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          disabled={(date) =>
                            endDate ? date > endDate : false
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Até</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[130px] pl-3 text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          {endDate ? (
                            format(endDate, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) =>
                            startDate ? date < startDate : false
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              <Button variant="outline" size="icon" disabled>
                <DownloadCloud className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredQuotes.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum orçamento encontrado para o período selecionado.
              </p>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left ">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-medium hover:bg-transparent"
                        onClick={() => handleSort("patient")}
                      >
                        Paciente
                        {getSortIcon("patient")}
                      </Button>
                    </th>
                    <th className="text-left ">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-medium hover:bg-transparent"
                        onClick={() => handleSort("dentist")}
                      >
                        Dentista
                        {getSortIcon("dentist")}
                      </Button>
                    </th>
                    <th className="text-left ">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-medium hover:bg-transparent"
                        onClick={() => handleSort("date")}
                      >
                        Data
                        {getSortIcon("date")}
                      </Button>
                    </th>
                    <th className="text-right ">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-medium hover:bg-transparent ml-auto"
                        onClick={() => handleSort("value")}
                      >
                        Valor
                        {getSortIcon("value")}
                      </Button>
                    </th>
                    <th className="text-center ">
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-medium hover:bg-transparent"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        {getSortIcon("status")}
                      </Button>
                    </th>
                    <th className="text-right p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedQuotes.map((quote) => {
                    const dentist = dentists?.find(
                      (d) => d.id === quote.dentistId
                    );
                    const total = quote.treatments.reduce(
                      (sum, t) => sum + t.price,
                      0
                    );

                    return (
                      <tr key={quote.id} className="border-b hover:bg-muted/30">
                        <td className="p-3">{quote.patientName}</td>
                        <td className="p-3">
                          {dentist?.name || "Desconhecido"}
                        </td>
                        <td className="p-3">
                          {format(new Date(quote.createdAt), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </td>
                        <td className="p-3 text-right">
                          {formatCurrency(total)}
                        </td>
                        <td className="p-3 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`
                                ${
                                  quote.status === "draft"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200"
                                    : ""
                                }
                                ${
                                  quote.status === "final"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                                    : ""
                                }
                                ${
                                  quote.status === "paid"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                                    : ""
                                }
                                ${
                                  quote.status === "follow"
                                    ? "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
                                    : ""
                                }
                              `}
                              >
                                {loadingUpdateQuote &&
                                quote.id === quoteToUpdate ? (
                                  <Loader2 className="animate-spin" />
                                ) : (
                                  <>
                                    {quote.status === "draft" && "Rascunho"}
                                    {quote.status === "final" && "Finalizado"}
                                    {quote.status === "paid" && "Pago"}
                                    {quote.status === "follow" && "Follow"}
                                  </>
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(quote.id, "paid")
                                }
                              >
                                Pago
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(quote.id, "follow")
                                }
                              >
                                Follow
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(quote.id, "final")
                                }
                              >
                                Finalizado
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditQuote(quote.id)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewQuote(quote.id)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteQuote(quote.id)}
                            title="Excluir"
                          >
                            {loadingDeleteQuote &&
                            quoteToDelete === quote.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                            ) : (
                              <Trash className="h-4 w-4 text-red-500" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <div className="flex-1">
                Orçamento: {selectedQuote?.patientName}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={exporting}
                  onClick={() => {
                    generateProposalPDF({
                      setExporting,
                      quote: selectedQuote || undefined,
                    });
                  }}
                >
                  {exporting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Download className="h-4 w-4 mr-1" />
                  )}
                  Baixar orçamento
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              Visualize o orçamento completo
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedQuote && (
              <QuotePreviewPDF
                quoteData={selectedQuote}
                id="quote-view-container"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteQuote}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Reports;
