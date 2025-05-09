import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuoteQueries } from "@/hooks/use-cotes/use-quote-queries";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/utils/formart";
import { useQuote } from "@/hooks/use-cotes/use-cotes";

export const RecentQuotes = () => {
  const { quotes } = useQuote();
  const { getRecentQuotes } = useQuoteQueries(quotes);
  const { clinic } = useAuth();

  const recentQuotes = getRecentQuotes(5);

  if (!clinic) return null;

  return (
    <Card className=" relative overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow">
      <CardHeader className="bg-[#F1F0FB] pb-4 -my-6 ">
        <CardTitle className="text-primary text-lg pt-5">
          Orçamentos Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {recentQuotes.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              Nenhum orçamento criado ainda.
            </p>
            <a
              href="/quote/new"
              className="text-primary hover:underline mt-2 block"
            >
              Criar novo orçamento
            </a>
          </div>
        ) : (
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Paciente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Dentista
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Data
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentQuotes.map((quote) => {
                  const dentist = clinic?.dentists?.find(
                    (d) => d.id === quote.dentistId
                  );
                  const totalValue = quote.treatments.reduce(
                    (sum, t) => sum + t.price,
                    0
                  );

                  return (
                    <tr key={quote.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm">{quote.patientName}</td>
                      <td className="px-4 py-3 text-sm">
                        {dentist?.name || "Desconhecido"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {format(new Date(quote.createdAt), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        {formatCurrency(totalValue)}
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
  );
};
