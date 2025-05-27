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
import { formatCurrency } from "@/utils/formart";
import { Input } from "@/components/ui/input";

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
  const [anchorageType, setAnchorageType] = useState("preset");
  const [customAnchorage, setCustomAnchorage] = useState("");
  const [customAnchorageType, setCustomAnchorageType] = useState("percentage");
  const [customAnchorageValue, setCustomAnchorageValue] = useState("");

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

  useEffect(() => {
    const treatments = form.getValues("treatments") || [];
    const anchoragePercentage = form.getValues("anchoragePercentage") || 0;
    const discountedTotal = treatments.reduce(
      (sum: any, t: any) => sum + (t.price || 0),
      0
    );

    let originalTotal = discountedTotal * (1 + anchoragePercentage / 100);

    if (
      anchorageType === "custom" &&
      customAnchorageType === "value" &&
      customAnchorageValue
    ) {
      originalTotal = discountedTotal + parseFloat(customAnchorageValue);
    }

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

    if (discountedTotal > 0) {
      form.setValue("paymentPreviewText", paymentPreviewText);
      form.setValue("paymentConditions", paymentPreviewText);
    }
  }, [
    installments,
    downPayment,
    form.watch("anchoragePercentage"),
    form.watch("treatments"),
    form.watch("customOriginalPrice"), // ✅ Adicionado!
  ]);

  const handlePaymentConditionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    form.setValue("paymentConditions", e.target.value);
  };

  const handleCustomAnchorageValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCustomAnchorageValue(value);
    if (
      anchorageType === "custom" &&
      customAnchorageType === "value" &&
      value
    ) {
      form.setValue("customOriginalPrice", parseFloat(value));
      form.setValue("anchoragePercentage", 0);
      form.trigger("customOriginalPrice");
    }
  };

  const handleCustomAnchorageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCustomAnchorage(value);
    if (
      anchorageType === "custom" &&
      customAnchorageType === "percentage" &&
      value
    ) {
      form.setValue("anchoragePercentage", parseFloat(value));
      form.setValue("customOriginalPrice", undefined);
      form.trigger("anchoragePercentage");
    }
  };

  const handleAnchorageChange = (value: string) => {
    if (value === "custom") {
      setAnchorageType("custom");
      if (customAnchorageType === "percentage" && customAnchorage) {
        form.setValue("anchoragePercentage", parseFloat(customAnchorage));
      } else if (customAnchorageType === "value" && customAnchorageValue) {
        form.setValue("anchoragePercentage", 0);
        form.setValue("customOriginalPrice", parseFloat(customAnchorageValue));
      }
    } else {
      setAnchorageType("preset");
      form.setValue("anchoragePercentage", parseInt(value, 10));
      form.setValue("customOriginalPrice", undefined);
    }
    form.trigger("anchoragePercentage");
  };
  console.log("originalTotal", previewValues.originalTotal);

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
      <PricePreview
        {...previewValues}
        installments={installments}
        originalTotal={previewValues.originalTotal}
      />
      <FormField
        control={form.control}
        name="anchoragePercentage"
        defaultValue={10}
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Ancoragem de Preço</FormLabel>
            <Select onValueChange={handleAnchorageChange} defaultValue="10">
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
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {anchorageType === "custom" && (
              <div className="space-y-3 p-3 border rounded-md bg-gray-50">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="customAnchorageType"
                      value="percentage"
                      checked={customAnchorageType === "percentage"}
                      onChange={(e) => setCustomAnchorageType(e.target.value)}
                    />
                    <span className="text-sm">Percentual (%)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="customAnchorageType"
                      value="value"
                      checked={customAnchorageType === "value"}
                      onChange={(e) => setCustomAnchorageType(e.target.value)}
                    />
                    <span className="text-sm">Valor (R$)</span>
                  </label>
                </div>

                {customAnchorageType === "percentage" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Digite o percentual"
                      min="0"
                      max="100"
                      value={customAnchorage}
                      onChange={handleCustomAnchorageChange}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">R$</span>
                    <Input
                      type="number"
                      placeholder="Digite o valor original"
                      min="0"
                      value={customAnchorageValue}
                      onChange={handleCustomAnchorageValueChange}
                      className="w-40"
                    />
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {customAnchorageType === "percentage"
                    ? "Percentual de acréscimo sobre o preço dos tratamentos."
                    : "Valor que aparecerá como preço original (será mostrado riscado)."}
                </p>
              </div>
            )}

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
