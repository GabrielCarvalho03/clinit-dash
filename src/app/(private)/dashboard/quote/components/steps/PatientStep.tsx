import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { differenceInYears, parse, isValid } from "date-fns";
import { useAnalytics } from "@/hooks/use-analitycs/use-analitycs";

interface PatientStepProps {
  form: UseFormReturn<any>;
}

export const PatientStep = ({ form }: PatientStepProps) => {
  const { clinic } = useAuth();
  const { dentists } = useAnalytics();
  const [age, setAge] = useState<number | null>(null);

  // Calculate age based on birthdate
  useEffect(() => {
    const birthdate = form.getValues("patientBirthdate");
    if (birthdate && birthdate.length === 10) {
      try {
        // Parse the date in DD/MM/YYYY format
        const parsedDate = parse(birthdate, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          const calculatedAge = differenceInYears(new Date(), parsedDate);
          setAge(calculatedAge);
          // Store the age for analytics
          form.setValue("patientAge", calculatedAge);
        } else {
          setAge(null);
        }
      } catch {
        setAge(null);
      }
    } else {
      setAge(null);
    }
  }, [form.watch("patientBirthdate")]);

  // Format and validate the date input to DD/MM/YYYY
  const formatDateInput = (value: string) => {
    // Remove any non-digit characters
    let digits = value.replace(/\D/g, "");

    // Limit to 8 digits (DDMMYYYY)
    digits = digits.slice(0, 8);

    // Format and validate as DD/MM/YYYY
    if (digits.length > 4) {
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4);

      // Validate day (1-31)
      const dayNum = parseInt(day);
      const validDay = dayNum > 0 && dayNum <= 31 ? day : day.slice(0, 1);

      // Validate month (1-12)
      const monthNum = parseInt(month);
      const validMonth =
        monthNum > 0 && monthNum <= 12 ? month : month.slice(0, 1);

      return `${validDay}/${validMonth}/${year}`;
    } else if (digits.length > 2) {
      const day = digits.slice(0, 2);
      const month = digits.slice(2);

      // Validate day (1-31)
      const dayNum = parseInt(day);
      const validDay = dayNum > 0 && dayNum <= 31 ? day : day.slice(0, 1);

      return `${validDay}/${month}`;
    } else {
      // Validate day (1-31)
      const dayNum = parseInt(digits);
      if (dayNum > 31) {
        return "31";
      }
      return digits;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Informações do Paciente</h2>

            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Paciente *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo do paciente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Patient Gender */}
            <FormField
              control={form.control}
              name="patientGender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gênero do Paciente *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="gender-male" />
                        <Label htmlFor="gender-male">Masculino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="gender-female" />
                        <Label htmlFor="gender-female">Feminino</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Patient Profile */}
            <FormField
              control={form.control}
              name="patientProfile"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Perfil Psicológico do Paciente *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      <div className="flex items-start p-3 border rounded-md">
                        <RadioGroupItem
                          value="aesthetic-emotional"
                          id="profile-ae"
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <Label htmlFor="profile-ae" className="font-bold">
                            Estético e Emocional
                          </Label>
                          <p className="text-xs text-gray-600">
                            Valoriza a aparência, autoestima, e um resultado
                            visível de imediato.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 border rounded-md">
                        <RadioGroupItem
                          value="aesthetic-rational"
                          id="profile-ar"
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <Label htmlFor="profile-ar" className="font-bold">
                            Estético e Racional
                          </Label>
                          <p className="text-xs text-gray-600">
                            Deseja resultados estéticos, mas precisa de uma base
                            lógica e justificativa para a escolha.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 border rounded-md">
                        <RadioGroupItem
                          value="health-emotional"
                          id="profile-he"
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <Label htmlFor="profile-he" className="font-bold">
                            Saúde e Emocional
                          </Label>
                          <p className="text-xs text-gray-600">
                            Preocupado com bem-estar e qualidade de vida, e
                            busca por um tratamento que melhore a saúde e a
                            sensação de bem-estar imediato.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 border rounded-md">
                        <RadioGroupItem
                          value="health-rational"
                          id="profile-hr"
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <Label htmlFor="profile-hr" className="font-bold">
                            Saúde e Racional
                          </Label>
                          <p className="text-xs text-gray-600">
                            Focado em soluções que previnem complicações
                            futuras, com base em dados lógicos e soluções a
                            longo prazo.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 border rounded-md col-span-1 md:col-span-2">
                        <RadioGroupItem
                          value="neutral-general"
                          id="profile-ng"
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <Label htmlFor="profile-ng" className="font-bold">
                            Neutro/Generalista{" "}
                            <span className="text-gray-500 font-normal">
                              (menos recomendado)
                            </span>
                          </Label>
                          <p className="text-xs text-gray-600">
                            Abordagem equilibrada e geral, sem foco específico
                            em aspectos emocionais ou racionais.
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Patient Birthdate - Enhanced with strict date validation */}
            <FormField
              control={form.control}
              name="patientBirthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento do Paciente *</FormLabel>
                  <div className="flex gap-3 items-center">
                    <FormControl>
                      <Input
                        placeholder="DD/MM/AAAA"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const formattedDate = formatDateInput(e.target.value);
                          field.onChange(formattedDate);
                        }}
                        maxLength={10}
                      />
                    </FormControl>
                    {age !== null && (
                      <span className="text-sm text-gray-500">
                        {age} {age === 1 ? "ano" : "anos"}
                      </span>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dentistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dentista Responsável *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um dentista" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dentists?.map((dentist) => (
                        <SelectItem key={dentist.id} value={dentist.id}>
                          {dentist.name}{" "}
                          {dentist.specialty ? `- ${dentist.specialty}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tempo de Relacionamento com a Clínica *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new">Novo paciente (1ª visita)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sixMonths" id="sixMonths" />
                        <Label htmlFor="sixMonths">Até 6 meses</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oneYear" id="oneYear" />
                        <Label htmlFor="oneYear">De 6 meses a 1 ano</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="moreThanYear"
                          id="moreThanYear"
                        />
                        <Label htmlFor="moreThanYear">Mais de 1 ano</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="moreThanThreeYears"
                          id="moreThanThreeYears"
                        />
                        <Label htmlFor="moreThanThreeYears">
                          Mais de 3 anos
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
