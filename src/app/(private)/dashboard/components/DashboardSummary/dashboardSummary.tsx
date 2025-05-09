import { useAuth } from "@/hooks/use-auth/use-auth";
import { useQuote } from "@/hooks/use-cotes/use-cotes";
import { usePeriodFilter } from "@/hooks/usePeriodFilter/usePeriodFilter";
import { PeriodFilter } from "../filters/PeriodFilter";
import { StatCards } from "../stats/StatCards";
// import { StatCards } from "./stats/StatCards";
import { QuotesByDentistChart } from "../charts/QuotesByDentistChart";

export const DashboardSummary = () => {
  const { clinic } = useAuth();
  const { quotes } = useQuote();

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
  const totalFilteredQuotes = filteredQuotes?.length;
  const paidFilteredQuotes = filteredQuotes?.filter(
    (q) => q.status === "paid"
  ).length;

  const conversionRate =
    totalFilteredQuotes > 0
      ? (paidFilteredQuotes / totalFilteredQuotes) * 100
      : 0;

  const paidFilteredValue = filteredQuotes
    .filter((q) => q.status === "paid")
    .reduce(
      (sum, q) =>
        sum + q.treatments.reduce((t, treatment) => t + treatment.price, 0),
      0
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#F1F0FB] p-4 rounded-lg shadow-sm mb-2">
        <h2 className="text-xl font-semibold text-primary">
          Resumo do Período
        </h2>
        <PeriodFilter
          periodFilter={periodFilter}
          setPeriodFilter={setPeriodFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>

      <StatCards
        clinic={clinic}
        totalFilteredQuotes={totalFilteredQuotes}
        paidFilteredQuotes={paidFilteredQuotes}
        conversionRate={conversionRate}
        paidFilteredValue={paidFilteredValue}
      />

      <QuotesByDentistChart clinic={clinic} filteredQuotes={filteredQuotes} />
    </div>
  );
};
