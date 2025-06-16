import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Loader2 } from "lucide-react";
import { QuotePreviewPDF } from "../../../quote/components/quote/QuotePreviewPDF";
import { QuotePdf } from "@/@types/quotes";

type PdfPreviewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orçamentName: string;
  disableButtonDownload?: boolean;
  onDownload?: () => void;
  isLoading?: boolean;
  selectedQuote?: QuotePdf | null;
};

export const PdfPreview = ({
  open,
  orçamentName,
  disableButtonDownload,
  isLoading,
  selectedQuote,
  onOpenChange,
  onDownload,
}: PdfPreviewProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <div className="flex-1">Orçamento: {orçamentName}</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={disableButtonDownload || isLoading}
                onClick={onDownload}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Download className="h-4 w-4 mr-1" />
                )}
                Baixar orçamento
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>Visualize o orçamento completo</DialogDescription>
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
  );
};
