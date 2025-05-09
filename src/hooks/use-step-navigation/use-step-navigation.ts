import { create } from "zustand";
import { Quote } from "@/@types/quotes";
import { StepNavigationState } from "./types";

export const useStepNavigation = create<StepNavigationState>((set, get) => ({
  step: 1,

  setStep: (step: number) => set({ step }),

  handleNext: async (form, draftQuote, setDraftQuote) => {
    const { step, setStep } = get();

    const stepFields: Record<number, string[]> = {
      1: ["patientName", "dentistId", "ageGroup", "relationship"],
      2: ["treatments", "observations"],
      3: ["paymentConditions", "downPayment", "installments"],
    };

    const currentStepFields = stepFields[step] || [];

    const isValid = await form.trigger(currentStepFields as any);
    if (isValid && step < 4) {
      const currentValues = form.getValues();
      const draftData: Quote = {
        id: draftQuote?.id || `draft-${Date.now()}`,
        ...currentValues,
        patientName: currentValues.patientName || "",
        dentistId: currentValues.dentistId || "",
        ageGroup: currentValues.ageGroup || "adult",
        relationship: currentValues.relationship || "new",
        treatments: currentValues.treatments || [],
        observations: currentValues.observations || "",
        downPayment: currentValues.downPayment || 0,
        installments: currentValues.installments || 0,
        paymentConditions: currentValues.paymentConditions || "",
        createdAt: draftQuote?.createdAt || new Date(),
        status: draftQuote?.status || "draft",
      };

      setDraftQuote(draftData);
      setStep(step + 1);
    }
  },

  handlePrevious: (_form, draftQuote, setDraftQuote) => {
    const { step, setStep } = get();
    if (step > 1) {
      const currentStep = step - 1;
      setStep(currentStep);
    }
  },

  handleCancel: (isEdit, setDraftQuote, router) => {
    setDraftQuote(null);
    if (isEdit) {
      router.push("/reports");
    } else {
      router.push("/dashboard");
    }
  },
}));
