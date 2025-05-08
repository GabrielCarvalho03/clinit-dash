import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuotePreviewSuccessProps {
  message?: string;
}

export const QuotePreviewSuccess = ({ message }: QuotePreviewSuccessProps) => {
  const route = useRouter();

  const handleGoToReports = () => {
    route.push("/reports");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Alert className="mb-6 bg-green-50 border-green-200">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
        <AlertDescription className="text-green-700">
          {message ||
            "Orçamento gerado com sucesso. Vá até a aba Relatórios para baixar o documento em PDF e alterar o status do orçamento."}
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button onClick={handleGoToReports} className="px-6">
          Ir para Relatórios
        </Button>
      </div>
    </div>
  );
};
