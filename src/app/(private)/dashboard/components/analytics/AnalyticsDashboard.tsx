"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePeriodFilter } from "@/hooks/usePeriodFilter/usePeriodFilter";
import { PeriodFilter } from "../filters/PeriodFilter";
import { ProfileAnalyticsCard } from "./ProfileAnalyticsCard";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";
import { ClinicProfileDescription } from "./ClinicProfileDescription";
import { TreatmentRanking } from "./TreatmentRanking";
import { SuggestionsList } from "./SuggestionsList";
import { useQuote } from "@/hooks/use-cotes/use-cotes";
import { useEffect } from "react";

export const AnalyticsDashboard = () => {
  const { quotes } = useQuote();
  const {
    dentistFilter,
    setDentistFilter,
    mostCommonProfileData,
    bestConversionProfileData,
    suggestions,
    treatmentStats,
    dentists,
    getProfileDisplayName,
    getClinicProfileDescription,
    generateAnalytics,
    generateSuggestionWithIA,
  } = useAnalytics();

  // Add period filtering with a proper default empty array
  const {
    periodFilter,
    setPeriodFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    getFilteredQuotes,
  } = usePeriodFilter();
  const filteredQuotes = getFilteredQuotes(quotes);

  // Get profile description based on current filters
  const clinicProfileDescription = getClinicProfileDescription(
    dentistFilter,
    filteredQuotes
  );

  // Generate dynamic titles based on dentist filter
  const profileTitle =
    dentistFilter === "all" ? "Perfil da Clínica" : "Perfil do Dentista";
  const treatmentTitle =
    dentistFilter === "all"
      ? "Tratamentos Mais Orçados"
      : `Tratamentos Mais Orçados (${
          dentists.find((d: any) => d.id === dentistFilter)?.name || "Dentista"
        })`;

  const suggestionsTitle =
    dentistFilter === "all"
      ? "Sugestões de Melhoria"
      : `Sugestões de Melhoria (${
          dentists.find((d: any) => d.id === dentistFilter)?.name || "Dentista"
        })`;

  useEffect(() => {
    generateAnalytics(quotes, filteredQuotes, dentistFilter);
  }, []);

  useEffect(() => {
    generateAnalytics(quotes, filteredQuotes, dentistFilter);
    generateSuggestionWithIA(quotes, dentistFilter);
  }, [dentistFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col bg-[#F1F0FB] p-4 rounded-lg shadow-sm mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-primary">
            Análise de Desempenho
          </h2>
          <p className="text-muted-foreground">
            Insights sobre pacientes, tratamentos e oportunidades de melhoria
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <Select value={dentistFilter} onValueChange={setDentistFilter}>
              <SelectTrigger className="w-[220px] bg-white border-primary/20">
                <SelectValue placeholder="Selecione um dentista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Dentistas</SelectItem>
                {dentists?.map((dentist: any) => (
                  <SelectItem key={dentist.id} value={dentist.id}>
                    {dentist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <PeriodFilter
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileAnalyticsCard
          type="common"
          title="Perfil Mais Comum"
          description="Análise do perfil mais frequente nos orçamentos"
          psychologicalProfile={mostCommonProfileData.psychologicalProfile}
          avgAge={mostCommonProfileData.avgAge}
          relationshipAvg={mostCommonProfileData.relationshipAvg}
          avgTicket={mostCommonProfileData.avgTicket}
          mostCommonTreatment={mostCommonProfileData.mostCommonTreatment}
          getProfileDisplayName={getProfileDisplayName}
        />

        <ProfileAnalyticsCard
          type="conversion"
          title="Perfil com Maior Conversão"
          description="Análise do perfil que mais fecha orçamentos"
          // @ts-ignore
          psychologicalProfile={bestConversionProfileData.psychologicalProfile}
          avgAge={bestConversionProfileData.avgAge}
          relationshipAvg={bestConversionProfileData.relationshipAvg}
          avgTicket={bestConversionProfileData.avgTicket}
          mostCommonTreatment={bestConversionProfileData.mostCommonTreatment}
          getProfileDisplayName={getProfileDisplayName}
        />
      </div>

      <ClinicProfileDescription
        title={profileTitle}
        description={clinicProfileDescription}
      />

      <div className="grid grid-cols-1 gap-6">
        <TreatmentRanking data={treatmentStats} title={treatmentTitle} />
        <SuggestionsList suggestions={suggestions} title={suggestionsTitle} />
      </div>
    </div>
  );
};
