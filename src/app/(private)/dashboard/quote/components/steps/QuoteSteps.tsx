"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQuote } from "@/hooks/use-cotes/use-cotes";
import { useAuth } from "@/hooks/use-auth/use-auth";
import { PatientStep } from "./PatientStep";
import { TreatmentStep } from "./TreatmentStep";
import { FinalizationStep } from "./FinalizationStep";
import { PreviewStep } from "./PreviewStep";
import { Quote } from "@/@types/quotes";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StepsProgress } from "./StepsProgress";
import { useStepNavigation } from "@/hooks/use-step-navigation/use-step-navigation";
import { QuoteFormData, quoteSchema } from "@/hooks/use-quote/schema";
import { useRouter } from "next/navigation";

interface QuoteStepsProps {
  isEdit?: boolean;
}

export const QuoteSteps = ({ isEdit = false }: QuoteStepsProps) => {
  const [saving, setSaving] = useState(false);
  const [hasCreatedQuote, setHasCreatedQuote] = useState(false);
  const { createQuote, updateQuote, draftQuote, setDraftQuote } = useQuote();
  const { clinic, user } = useAuth();
  const router = useRouter();
  const isEditMode =
    isEdit ||
    (draftQuote && draftQuote.id && draftQuote.id.indexOf("draft-") !== 0);

  const form = useForm<QuoteFormData>({
    //@ts-ignore
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      patientName: "",
      patientGender: "male",
      patientProfile: "aesthetic-emotional", // padrão para perfil do paciente
      patientAge: undefined, // Isso é válido porque é opcional
      patientBirthdate: undefined,
      dentistId: "",
      ageGroup: "adult", // Definido como "adult" por padrão
      relationship: "new", // Definido como "new" por padrão
      treatments: [],
      observations: "", // Pode ser vazio ou algum valor padrão
      gift: "", // Pode ser vazio ou algum valor padrão
      anchoragePercentage: 10,
      downPayment: 0,
      installments: 1,
      paymentConditions: "",
      paymentPreviewText: "",
      validityDays: undefined,
      validityCustomDate: undefined, // Já é opcional no schema
    },
  });

  const { step, handlePrevious, handleNext, handleCancel } =
    useStepNavigation();

  // Reset quote creation state when component mounts or when editing a different quote
  useEffect(() => {
    setHasCreatedQuote(false);
  }, [isEditMode, draftQuote?.id]);

  const onSubmit = (data: QuoteFormData) => {
    if (hasCreatedQuote) {
      return;
    }

    setSaving(true);
    try {
      if (data.treatments.length === 0) {
        toast.error("Erro ao salvar orçamento", {
          description: "É necessário adicionar pelo menos um tratamento",
        });

        setSaving(false);
        return;
      }

      let finalQuote: Quote;

      if (isEditMode) {
        finalQuote = {
          ...draftQuote!,
          ...data,
          status: "final" as const,
        } as Quote;
        updateQuote(finalQuote);

        toast.error("Orçamento atualizado", {
          description: "O orçamento foi atualizado com sucesso.",
        });
      } else {
        finalQuote = {
          ...data,
          id: crypto.randomUUID(),
          dentistId: data.dentistId || user?.id || "",
          createdAt: new Date(),
          status: "final" as const,
        } as Quote;
        createQuote(finalQuote);
      }

      setDraftQuote(null);
      setHasCreatedQuote(true);

      if (isEdit) {
        setTimeout(() => {
          router.push("/reports");
        }, 2000);
      }
    } catch (error) {
      toast.error("Erro ao salvar orçamento", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <PatientStep form={form} />;
      case 2:
        return <TreatmentStep form={form} />;
      case 3:
        return <FinalizationStep form={form} />;
      case 4:
        return (
          <PreviewStep
            form={form}
            onSubmit={onSubmit}
            isLoading={saving}
            isEditMode={isEdit}
          />
        );
      default:
        return <PatientStep form={form} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <StepsProgress
        currentStep={step}
        onStepClick={(step: number) =>
          handleNext(form, draftQuote, setDraftQuote)
        }
      />

      <Form {...form}>
        <form
          onSubmit={
            //@ts-ignore
            form.handleSubmit(onSubmit)
          }
        >
          {renderStepContent()}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => handlePrevious(form, draftQuote, setDraftQuote)}
                className="px-6"
              >
                Voltar
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCancel(isEdit, setDraftQuote, router)}
                className="px-6"
              >
                Cancelar
              </Button>
            )}

            {step < 4 && (
              <Button
                type="button"
                onClick={() => handleNext(form, draftQuote, setDraftQuote)}
                className="px-6"
              >
                Continuar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
