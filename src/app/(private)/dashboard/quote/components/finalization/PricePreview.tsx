import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formart";

interface PricePreviewProps {
  originalTotal: number;
  discountedTotal: number;
  installments: number;
  paymentPreviewText: string;
}

export function PricePreview({
  originalTotal,
  discountedTotal,
  installments,
  paymentPreviewText,
}: PricePreviewProps) {
  return (
    <Card className="p-4 bg-muted/30">
      <h3 className="font-medium mb-2">Previsão de Valores</h3>
      <div className="space-y-2">
        {originalTotal !== discountedTotal && (
          <div className="flex justify-between">
            <span>Valor Original:</span>
            <s className="text-muted-foreground">
              {formatCurrency(originalTotal)}
            </s>
          </div>
        )}
        <div className="flex justify-between font-medium">
          <span>Valor com Desconto:</span>
          <span className="text-primary">
            {formatCurrency(discountedTotal)}
          </span>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
          <span>Como aparecerá no orçamento:</span>
          <span className="font-semibold text-primary">
            {paymentPreviewText}
          </span>
        </div>
      </div>
    </Card>
  );
}
