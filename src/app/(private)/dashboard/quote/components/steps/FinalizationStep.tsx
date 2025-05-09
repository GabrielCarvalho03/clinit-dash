import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { PricePreview } from "../finalization/PricePreview";
import { PaymentConfig } from "../finalization/PaymentConfig";
import { QuoteValidity } from "../finalization/QuoteValidity";
import { GiftSection } from "../finalization/GiftSection";
import { formatCurrency } from "@/utils/formart"; // Added formatCurrency import

export function FinalizationStep({ form }: any) {
  const [validityType, setValidityType] = useState(
    form.getValues("validityCustomDate") ? "custom" : "days"
  );
  const [installments, setInstallments] = useState(
    form.getValues("installments") || 1
  );
  const [downPayment, setDownPayment] = useState(
    form.getValues("downPayment") || 0
  );
  const [previewValues, setPreviewValues] = useState({
    originalTotal: 0,
    discountedTotal: 0,
    installmentValue: 0,
    paymentPreviewText: "",
  });

  const handleValidityTypeChange = (value: string) => {
    setValidityType(value);
    if (value === "days") {
      form.setValue("validityCustomDate", undefined);
      form.setValue("validityDays", 7);
    } else if (value === "custom") {
      form.setValue("validityDays", undefined);
      if (!form.getValues("validityCustomDate")) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        form.setValue("validityCustomDate", defaultDate);
      }
    }
  };

  // Calculate total prices and installment values
  useEffect(() => {
    const treatments = form.getValues("treatments") || [];
    const anchoragePercentage = form.getValues("anchoragePercentage") || 0;
    const discountedTotal = treatments.reduce(
      (sum: any, t: any) => sum + (t.price || 0),
      0
    );
    const originalTotal = discountedTotal * (1 + anchoragePercentage / 100);
    let installmentValue = 0;
    let paymentPreviewText = "";

    if (installments > 0) {
      const remainingAfterDownPayment = discountedTotal - downPayment;
      installmentValue =
        remainingAfterDownPayment > 0
          ? remainingAfterDownPayment / installments
          : 0;

      if (downPayment > 0) {
        paymentPreviewText = `${formatCurrency(
          downPayment
        )} + ${installments}x de ${formatCurrency(installmentValue)}`;
      } else {
        paymentPreviewText =
          installments > 1
            ? `${installments}x de ${formatCurrency(installmentValue)}`
            : `${formatCurrency(discountedTotal)}`;
      }
    } else {
      paymentPreviewText = `${formatCurrency(discountedTotal)}`;
    }

    setPreviewValues({
      originalTotal,
      discountedTotal,
      installmentValue,
      paymentPreviewText,
    });

    // Set payment preview text to form
    if (discountedTotal > 0) {
      form.setValue("paymentPreviewText", paymentPreviewText);
      // Also set the payment conditions with the same text
      form.setValue("paymentConditions", paymentPreviewText);
    }
  }, [
    installments,
    downPayment,
    form.watch("anchoragePercentage"),
    form.watch("treatments"),
  ]);

  // Handle payment conditions manual change
  const handlePaymentConditionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    form.setValue("paymentConditions", e.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Condições de Pagamento e Validade
        </h2>
        <p className="text-muted-foreground text-sm">
          Defina as condições de pagamento e a validade do orçamento.
        </p>
      </div>

      <PricePreview {...previewValues} installments={installments} />

      <FormField
        control={form.control}
        name="anchoragePercentage"
        defaultValue={10}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Ancoragem de Preço</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(parseInt(value, 10));
                form.trigger("anchoragePercentage");
              }}
              defaultValue="10"
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o percentual de ancoragem" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0">Sem ancoragem</SelectItem>
                <SelectItem value="10">10% (Leve)</SelectItem>
                <SelectItem value="20">20% (Moderada)</SelectItem>
                <SelectItem value="30">30% (Alta)</SelectItem>
                <SelectItem value="40">40% (Muito alta)</SelectItem>
                <SelectItem value="50">50% (Máxima)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              A ancoragem de preço mostrará um valor inicial maior para aumentar
              a percepção de desconto.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <PaymentConfig
        form={form}
        downPayment={downPayment}
        setDownPayment={setDownPayment}
        installments={installments}
        setInstallments={setInstallments}
      />

      <FormField
        control={form.control}
        name="paymentPreviewText"
        render={({ field }) => <input type="hidden" {...field} />}
      />

      <FormField
        control={form.control}
        name="paymentConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condições de Pagamento</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ex: 10x de R$ 200 ou à vista com 10% de desconto"
                onChange={handlePaymentConditionsChange}
                value={field.value || ""}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Este texto aparecerá na seção de condições de pagamento do
              orçamento.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <QuoteValidity
        form={form}
        validityType={validityType}
        handleValidityTypeChange={handleValidityTypeChange}
      />

      <GiftSection form={form} />
    </div>
  );
}
