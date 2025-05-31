import { useFieldArray } from "react-hook-form";
import { Info } from "lucide-react";
import { TreatmentList } from "@/app/(private)/dashboard/treatments/components/treatments/TreatmentList";
import { useTreatmentForm } from "@/hooks/use-treatment-form/use-treatment-form";
import { Form } from "@/components/ui/form";
import { AvailableTreatmentsAccordion } from "@/app/(private)/dashboard/quote/components/treatment/AvailableTreatmentsAccordion";
import { ObservationsField } from "@/app/(private)/dashboard/quote/components/treatment/ObservationsField";
import { useState } from "react";
import { UseTreataments } from "@/hooks/use-treataments/use-treataments";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TreatmentDrawer } from "../TreatmentDrawer/TreatmentDrawer";
import { IllustrationsUpload } from "../IllustrationsUpload/IllustrationsUpload";

export function TreatmentStep({ form }: any) {
  const { procedures } = UseTreataments();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "treatments",
  });

  const {
    standardTreatments,
    showCustomForm,
    setShowCustomForm,
    customTreatment,
    setCustomTreatment,
    priceError,
    handleAddStandardTreatment,
    handleAddCustomTreatment,
  } = useTreatmentForm();

  const treatments = form.watch("treatments") || [];
  const treatmentCount = treatments.length;
  const isAtLimit = treatmentCount >= 3;

  const handleAddTreatment = (treatment: any) => {
    if (isAtLimit) {
      return;
    }
    handleAddStandardTreatment(treatment, append);
  };

  const handleAddCustom = () => {
    if (isAtLimit) {
      return;
    }
    handleAddCustomTreatment(append);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Tratamentos</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Adicione todos os tratamentos necessários para o orçamento do paciente.
        </p>
      </div>

      {/* Informação com fundo branco e contraste melhorado */}
      <div className="bg-white border-2 border-primary/30 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <div className="font-semibold text-primary mb-1">
              Estratégia de apresentação otimizada
            </div>
            <div className="text-foreground">
              Limitamos a 3 tratamentos para manter a apresentação clara e
              focada, facilitando a decisão do paciente. Para orçamentos
              maiores, recomendamos criar um novo orçamento após finalizar este.
            </div>
            <div className="text-primary font-medium text-sm mt-2">
              <strong>Atual:</strong> {treatmentCount} de 3 tratamentos
            </div>
          </div>
        </div>
      </div>

      {/* Alerta quando atingir o limite */}
      {isAtLimit && (
        <Alert className="border-destructive/30 bg-destructive/10">
          <Info className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <div className="font-medium mb-1">
              Limite de tratamentos atingido
            </div>
            <div className="text-sm text-foreground/80">
              Você atingiu o limite de 3 tratamentos. Para adicionar mais
              procedimentos, sugerimos finalizar este orçamento e criar um novo
              para facilitar a apresentação ao cliente.
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-base font-medium">Tratamentos do Orçamento</h3>
        <Form {...form}>
          <TreatmentList
            fields={fields}
            form={form}
            remove={remove}
            priceError={priceError}
          />
        </Form>
      </div>

      <TreatmentDrawer
        treatments={procedures}
        onAdd={handleAddTreatment}
        disabled={false}
        showCustomForm={showCustomForm}
        setShowCustomForm={setShowCustomForm}
        customTreatment={customTreatment}
        setCustomTreatment={setCustomTreatment}
        onAddCustom={handleAddCustom}
      />

      <IllustrationsUpload form={form} />

      <ObservationsField form={form} />
      
      <div className="bg-muted/50 border rounded-md p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Dica:</strong> É necessário adicionar pelo menos um tratamento e informar o preço para cada um deles.
        </p>
      </div>
    </div>
  );
}
