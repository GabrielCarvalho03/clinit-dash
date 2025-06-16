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
  Trash,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { Label } from "@/components/ui/label";
import { useQuote } from "@/hooks/use-cotes/use-cotes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/utils/formart";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";
import { getUserRefresh } from "@/utils/get-user-refresh";
import { CardInfoReports } from "./components/card-info-reports/card-info-reports";
import { Filter } from "./components/filter/filter";
import { ConfirmeDeleteAlert } from "@/components/alerts/confirme-delete/confirm-delete";
import { PdfPreview } from "./components/pdf-preview/pdf-preview";
import { useReport } from "./hooks/use-reports";
import { SortField } from "./hooks/types";

const Reports = () => {
  const route = useRouter();
  const { isLoading, setClinic, setIsLoading } = useAuth();
  const { dentists, handleGetDentists } = useAnalytics();
  const { loadingDeleteQuote, loadingUpdateQuote, getQuote } = useQuote();
  const {
    dentistFilter,
    periodFilter,
    startDate,
    endDate,
    selectedQuote,
    viewDialogOpen,
    deleteDialogOpen,
    quoteToDelete,
    quoteToUpdate,
    exporting,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    setDentistFilter,
    setPeriodFilter,
    setStartDate,
    setEndDate,
    setViewDialogOpen,
    setDeleteDialogOpen,
    handleEditQuote,
    handleDeleteQuote,
    handleStatusChange,
    confirmDeleteQuote,
    handleViewQuote,
    getFilteredQuotes,
    generateProposalPDF,
    getSortedQuotes,
  } = useReport();

  const filteredQuotes = getFilteredQuotes();
  const sortedQuotes = getSortedQuotes();

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
                <Filter
                  value={dentistFilter}
                  onValueChange={setDentistFilter}
                  label="Dentista"
                  htmlfor="dentist"
                  placeholder="Selecione um dentista"
                  options={[
                    {
                      label: "Todos",
                      value: "all",
                    },
                    ...dentists.map((dentist) => ({
                      label: dentist.name,
                      value: dentist.id,
                    })),
                  ]}
                />

                <Filter
                  value={periodFilter}
                  onValueChange={setPeriodFilter}
                  htmlfor="period"
                  label="Período"
                  placeholder="Selecione um período"
                  options={[
                    {
                      label: "Todo período",
                      value: "all",
                    },
                    {
                      label: "Último mês",
                      value: "month",
                    },
                    {
                      label: "Último trimestre",
                      value: "quarter",
                    },
                    {
                      label: "Último ano",
                      value: "year",
                    },
                    {
                      label: "Personalizado",
                      value: "custom",
                    },
                  ]}
                />
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
                            onClick={() => handleEditQuote(quote.id, route)}
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

      <PdfPreview
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        orçamentName={selectedQuote?.patientName ?? ""}
        disableButtonDownload={exporting}
        isLoading={exporting}
        onDownload={() => {
          generateProposalPDF(selectedQuote ?? undefined);
        }}
        selectedQuote={selectedQuote}
      />

      <ConfirmeDeleteAlert
        deleteDialogOpen={deleteDialogOpen}
        confirmDelete={confirmDeleteQuote}
        setDeleteDialogOpen={setDeleteDialogOpen}
        description="Tem certeza que deseja excluir este orçamento? Esta ação não pode
              ser desfeita."
      />
    </div>
  );
};

export default Reports;
