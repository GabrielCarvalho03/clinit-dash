import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "./BarChart";
import { Clinic } from "@/@types/auth";
import { Quote } from "@/@types/quotes";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";

interface QuotesByDentistChartProps {
  clinic: Clinic | null;
  filteredQuotes: Quote[];
}

export const QuotesByDentistChart = ({
  clinic,
  filteredQuotes,
}: QuotesByDentistChartProps) => {
  const { dentists } = useAnalytics();

  const chartData =
    dentists?.map((dentist) => {
      const dentistQuotes = filteredQuotes?.filter(
        (q) => q.dentistId === dentist.id
      );
      const quotesCount = dentistQuotes.length;
      const paidCount = dentistQuotes.filter((q) => q.status === "paid").length;

      return {
        name: dentist.name,
        orçamentos: quotesCount,
        convertidos: paidCount,
      };
    }) || [];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Orçamentos por Dentista</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <BarChart data={chartData} />
      </CardContent>
    </Card>
  );
};
