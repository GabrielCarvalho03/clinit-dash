import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Gift } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface GiftSectionProps {
  form: UseFormReturn<any>;
}

export function GiftSection({ form }: GiftSectionProps) {
  return (
    <FormField
      control={form.control}
      name="gift"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            <span>Brinde (opcional)</span>
          </FormLabel>
          <FormControl>
            <Input placeholder="Ex: Kit de higiene bucal gratuito" {...field} />
          </FormControl>
          <p className="text-xs text-muted-foreground">
            Um brinde para aumentar o valor percebido do orçamento.
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
