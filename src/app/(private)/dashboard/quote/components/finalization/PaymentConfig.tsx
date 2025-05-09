import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface PaymentConfigProps {
  form: UseFormReturn<any>;
  downPayment: number;
  setDownPayment: (value: number) => void;
  installments: number;
  setInstallments: (value: number) => void;
}

export function PaymentConfig({
  form,
  downPayment,
  setDownPayment,
  installments,
  setInstallments,
}: PaymentConfigProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="downPayment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entrada (R$)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Opcional, deixe vazio se não houver entrada"
                value={downPayment || ""}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : 0;
                  setDownPayment(value);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="installments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Parcelas</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                step="1"
                placeholder="Opcional, deixe vazio se não for parcelado"
                value={installments || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseInt(e.target.value, 10)
                    : 0;
                  setInstallments(value);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
