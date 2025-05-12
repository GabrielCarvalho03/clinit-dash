"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuoteSteps } from "@/app/(private)/dashboard/quote/components/steps/QuoteSteps";
import { useQuote } from "@/hooks/use-cotes/use-cotes";
import { useRouter } from "next/navigation";

const EditQuote = () => {
  const { draftQuote } = useQuote();
  const route = useRouter();

  // If no quote is being edited, redirect to reports
  useEffect(() => {
    if (!draftQuote || draftQuote.id.indexOf("draft-") === 0) {
      route.push("/dashboard/reports");
    }
  }, [draftQuote, route]);

  const handleBackToReports = () => {
    route.push("/dashboard/reports");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Editar Orçamento
          </h1>
          <p className="text-muted-foreground">
            Faça alterações no orçamento existente.
          </p>
        </div>
        <Button variant="outline" onClick={handleBackToReports}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Relatórios
        </Button>
      </div>

      <QuoteSteps isEdit={true} />
    </div>
  );
};

export default EditQuote;
