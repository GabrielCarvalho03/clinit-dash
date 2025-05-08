import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download, Printer, Loader2 } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (
    type:
      | "pdf-images"
      | "pdf-no-images"
      | "print-images"
      | "print-no-images"
      | "word"
  ) => void;
  isExporting?: boolean;
}

export const ExportDialog = ({
  open,
  onOpenChange,
  onExport,
  isExporting = false,
}: ExportDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Orçamento</DialogTitle>
          <DialogDescription>
            Escolha como deseja exportar este orçamento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => onExport("pdf-images")}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>Baixar Orçamento (PDF)</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
