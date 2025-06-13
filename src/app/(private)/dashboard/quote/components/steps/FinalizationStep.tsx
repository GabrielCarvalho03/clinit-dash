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
  // --- ESTADOS REINTEGRADOS (solicitados por você) ---
  const [validityType, setValidityType] = useState(
    form.getValues("validityCustomDate") ? "custom" : "days"
  );
  const [installments, setInstallments] = useState(
    form.getValues("installments") || 1
  );
  const [downPayment, setDownPayment] = useState(
    form.getValues("downPayment") || 0
  );

  // Estado de controle para a Ancoragem (a correção principal)
  const [anchorageMode, setAnchorageMode] = useState<"preset" | "custom">(
    form.getValues("customOriginalPrice") ? "custom" : "preset"
  );

  // Estado para os valores da pré-visualização
  const [previewValues, setPreviewValues] = useState({
    originalTotal: 0,
    discountedTotal: 0,
    paymentPreviewText: "",
  });

  // --- LÓGICA E CÁLCULOS ---

  // useEffect principal para recalcular os totais.
  useEffect(() => {
    const treatments = form.getValues("treatments") || [];
    const discountedTotal = treatments.reduce(
      (sum: number, t: any) => sum + (t.price || 0),
      0
    );

    const customOriginalPrice = form.getValues("customOriginalPrice");
    const anchoragePercentage = form.getValues("anchoragePercentage");

    let originalTotal = 0;

    // Lógica de cálculo da ancoragem (corrigida)
    if (anchorageMode === "custom" && customOriginalPrice > 0) {
      originalTotal = customOriginalPrice;
    } else {
      originalTotal = discountedTotal * (1 + (anchoragePercentage || 0) / 100);
    }

    // Lógica de pré-visualização de pagamento
    let paymentPreviewText = "";
    if (discountedTotal <= 0) {
      paymentPreviewText = formatCurrency(0);
    } else if (installments > 0) {
      const remainingAfterDownPayment = discountedTotal - downPayment;
      const installmentValue =
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
      paymentPreviewText,
    });

    // Sincroniza o resultado com o formulário
    if (discountedTotal > 0) {
      form.setValue("paymentPreviewText", paymentPreviewText);
      form.setValue("paymentConditions", paymentPreviewText);
    }
  }, [
    anchorageMode,
    downPayment, // Re-adicionado
    installments, // Re-adicionado
    form.watch("treatments"),
    form.watch("anchoragePercentage"),
    form.watch("customOriginalPrice"),
  ]);

  console.log("anchoragePercentage", form.getValues("anchoragePercentage"));
  // --- MANIPULADORES DE EVENTOS ---

  // Handler da Validade (reintegrado como no original)
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

  // Handler da Ancoragem (corrigido)
  const handleAnchorageChange = (value: string) => {
    if (value === "custom") {
      setAnchorageMode("custom");
      form.setValue("anchoragePercentage", 0);
    } else {
      setAnchorageMode("preset");
      form.setValue("anchoragePercentage", parseInt(value, 10));
      form.setValue("customOriginalPrice", undefined);
    }
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

      <PricePreview
        originalTotal={previewValues.originalTotal}
        discountedTotal={previewValues.discountedTotal}
        paymentPreviewText={previewValues.paymentPreviewText}
        installments={installments}
      />

      <FormField
        control={form.control}
        name="anchoragePercentage"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Ancoragem de Preço</FormLabel>
            <Select
              onValueChange={handleAnchorageChange}
              value={
                anchorageMode === "custom"
                  ? "custom"
                  : form.getValues("anchoragePercentage")
                  ? String(form.getValues("anchoragePercentage")) // Certifique-se que é String
                  : String(field.value || "0")
              }
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
                <SelectItem value="50">50% (Máxima)</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {anchorageMode === "custom" && (
              <div className="space-y-3 p-3 border rounded-md bg-gray-50">
                <p className="text-sm font-medium">
                  Defina o valor original (de)
                </p>
                <FormField
                  control={form.control}
                  name="customOriginalPrice"
                  render={({ field: customField }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          R$
                        </span>
                        <Input
                          type="number"
                          placeholder="Digite o valor"
                          min="0"
                          {...customField}
                          onChange={(e) =>
                            customField.onChange(
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              A ancoragem de preço mostrará um valor "de" maior para aumentar a
              percepção de desconto.
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
        name="paymentConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição das Condições de Pagamento</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ex: 10x de R$ 200 ou à vista com 10% de desconto"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Este texto é preenchido automaticamente, mas você pode editá-lo.
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
