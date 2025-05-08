import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formart";
import { Clinic } from "@/@types/auth";
import { Quote } from "@/@types/quotes";

interface StatCardsProps {
  clinic: Clinic | null;
  totalFilteredQuotes: number;
  paidFilteredQuotes: number;
  conversionRate: number;
  paidFilteredValue: number;
}

export const StatCards = ({
  clinic,
  totalFilteredQuotes,
  paidFilteredQuotes,
  conversionRate,
  paidFilteredValue,
}: StatCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-white hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Total de Orçamentos
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-[#F1F0FB] flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {totalFilteredQuotes}
          </div>
          <p className="text-xs text-muted-foreground">
            {paidFilteredQuotes} orçamentos convertidos
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Dentistas Ativos
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-[#F1F0FB] flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {clinic?.dentists?.length || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Cadastrados no sistema
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Taxa de Conversão
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-[#F1F0FB] flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {conversionRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(paidFilteredValue)} em vendas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
