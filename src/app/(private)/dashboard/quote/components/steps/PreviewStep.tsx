import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/hooks/use-cotes/use-cotes";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { QuotePreviewPDF } from "../quote/QuotePreviewPDF";
import { useState } from "react";
import { PreviewHeader } from "../preview/PreviewHeader";
import { QuotePreviewSuccess } from "../preview/QuotePreviewSuccess";
import { prepareQuotePdfData } from "@/utils/quoteDataPreparation";
import { useQuoteExport } from "@/hooks/use-quote-export/use-quote-export";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ExportDialog } from "../preview/ExportDialog";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";
import { create } from "domain";
import { useQuoteActions } from "@/hooks/use-cotes/use-cotes-actions";

interface PreviewStepProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  isEditMode?: boolean;
}

export const PreviewStep = ({
  form,
  onSubmit,
  isLoading,
  isEditMode = false,
}: PreviewStepProps) => {
  const { clinic } = useAuth();
  const { dentists } = useAnalytics();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [quoteSaved, setQuoteSaved] = useState(false);
  const { exporting, handleExport } = useQuoteExport();
  const { createQuote } = useQuote();

  const formValues = form.getValues();
  const dentist = dentists?.find((d) => d.id === formValues.dentistId);

  const missingImages = [];
  if (!clinic?.logo) missingImages.push("logo da clínica");
  if (!dentist?.photo) missingImages.push("foto do dentista");

  const handleSaveQuote = () => {
    if (!quoteSaved) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmSave = async () => {
    // Só envia o formulário se ainda não foi salvo
    console.log("formValues", formValues);
    if (!quoteSaved) {
      await onSubmit(formValues);
      setSuccessMessage(
        isEditMode
          ? "Orçamento atualizado com sucesso. Vá até a aba Relatórios para baixar o documento em PDF e alterar o status do orçamento."
          : "Orçamento gerado com sucesso. Vá até a aba Relatórios para baixar o documento em PDF e alterar o status do orçamento."
      );

      return;
    }
    await createQuote(formValues);
    setQuoteSaved(false);
    setShowConfirmDialog(false);
  };

  const handleExportClick = () => {
    setShowExportDialog(true);
  };

  const handleExportDocument = (
    type:
      | "pdf-images"
      | "pdf-no-images"
      | "print-images"
      | "print-no-images"
      | "word"
  ) => {
    //quote-preview-container
    handleExport({
      elementId: "quote-preview-container",
      type,
      patientName: formValues.patientName,
    });
    setShowExportDialog(false);
  };

  if (successMessage) {
    return <QuotePreviewSuccess message={successMessage} />;
  }

  const quotePdfData = prepareQuotePdfData(formValues, clinic, dentist);

  return (
    <>
      <Card className="overflow-visible">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <PreviewHeader
              missingImages={missingImages}
              validityDate={quotePdfData.validUntil}
              onExportClick={handleExportClick}
            />

            <div className="bg-white border rounded-md shadow-sm overflow-auto max-h-[750px]">
              <QuotePreviewPDF quoteData={quotePdfData} />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                onClick={handleSaveQuote}
                disabled={isLoading || quoteSaved}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Salvando...
                  </>
                ) : quoteSaved ? (
                  isEditMode ? (
                    "Orçamento Atualizado"
                  ) : (
                    "Orçamento Salvo"
                  )
                ) : isEditMode ? (
                  "Atualizar Orçamento"
                ) : (
                  "Finalizar e Salvar"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmar {isEditMode ? "atualização" : "criação"} do orçamento
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deseja {isEditMode ? "atualizar" : "salvar"} este orçamento? Você
              poderá baixá-lo em PDF e alterar seu status na aba Relatórios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave}>
              {isEditMode ? "Atualizar" : "Salvar"} Orçamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExportDocument}
        isExporting={exporting}
      />
    </>
  );
};
