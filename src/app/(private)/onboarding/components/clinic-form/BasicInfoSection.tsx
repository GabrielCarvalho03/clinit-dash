import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Phone, Building2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FileUpload } from "@/components/file-upload/file-upload";
import { ClinicFormData } from "./schema";
import { formatCNPJ } from "@/utils/text-formarter/cnpj-formarter";
import { formatPhone } from "@/utils/text-formarter/phone-formarter";

interface BasicInfoSectionProps {
  form: UseFormReturn<ClinicFormData>;
  logoPreview: string | null;
  handleLogoUpload: (file: File, preview: string) => void;
}

export const BasicInfoSection = ({
  form,
  logoPreview,
  handleLogoUpload,
}: BasicInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <FileUpload
            onFileUploaded={handleLogoUpload}
            initialPreview={logoPreview ?? ""}
            label="Logo da Clínica"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Envie uma imagem em formato JPG, PNG ou GIF (máx. 5MB).
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Clínica *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome da clínica" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ *</FormLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <Input
                      className="rounded-l-none"
                      placeholder="00.000.000/0000-00"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(formatCNPJ(e.target.value))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone de contato principal *</FormLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Phone className="h-4 w-4" />
                    </span>
                    <Input
                      className="rounded-l-none"
                      placeholder="(00) 00000-0000"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone de contato secundário</FormLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                      <Phone className="h-4 w-4" />
                    </span>
                    <Input
                      className="rounded-l-none"
                      placeholder="(00) 00000-0000"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço Completo *</FormLabel>
            <FormControl>
              <Input
                placeholder="Rua, número, bairro, cidade, estado, CEP"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
