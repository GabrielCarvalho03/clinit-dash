// stores/treatmentFormStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Treatment, StandardTreatment } from "@/@types/quotes";
import { toast } from "sonner";

const DEFAULT_TREATMENT_DESCRIPTION =
  "Tratamento odontológico para melhorar a saúde bucal e estética do paciente.";

interface TreatmentFormState {
  standardTreatments: StandardTreatment[];
  localProcedures: StandardTreatment[];
  showCustomForm: boolean;
  customTreatment: {
    name: string;
    description: string;
    image: string;
    price: number;
  };
  priceError: string;
  setShowCustomForm: (value: boolean) => void;
  setCustomTreatment: (
    value: Partial<TreatmentFormState["customTreatment"]>
  ) => void;
  setPriceError: (value: string) => void;
  loadLocalProcedures: () => void;
  setStandardTreatments: (treatments: StandardTreatment[]) => void;
  handleAddStandardTreatment: (
    treatment: StandardTreatment,
    append: (value: Treatment) => void
  ) => void;
  handleAddCustomTreatment: (append: (value: Treatment) => void) => void;
  validatePrices: (treatments: Treatment[]) => boolean;
}

export const useTreatmentForm = create<TreatmentFormState>()(
  persist(
    (set, get) => ({
      standardTreatments: [],
      localProcedures: [],
      showCustomForm: false,
      customTreatment: {
        name: "",
        description: DEFAULT_TREATMENT_DESCRIPTION,
        image: "",
        price: 0,
      },
      priceError: "",

      setShowCustomForm: (value) => set({ showCustomForm: value }),

      setCustomTreatment: (partial) =>
        set((state) => ({
          customTreatment: { ...state.customTreatment, ...partial },
        })),

      setPriceError: (value) => set({ priceError: value }),

      setStandardTreatments: (treatments) =>
        set({ standardTreatments: treatments }),

      loadLocalProcedures: () => {
        try {
          const stored = localStorage.getItem("procedures");
          if (stored) {
            const parsed: StandardTreatment[] = JSON.parse(stored);
            set({ localProcedures: parsed });
          }
        } catch (error) {
          console.error(
            "Erro ao carregar procedimentos do localStorage:",
            error
          );
        }
      },

      handleAddStandardTreatment: (treatment, append) => {
        append({
          id: treatment.id,
          name: treatment.name,
          description: treatment.description,
          price: Number(treatment.price || 0),
          image: treatment.photo || "",
          treatmentImages: [],
        });

        toast("Tratamento adicionado ao orçamento.", {
          description: `${treatment.name} foi adicionado ao orçamento.`,
        });
      },

      handleAddCustomTreatment: (append) => {
        const { customTreatment, setCustomTreatment, setShowCustomForm } =
          get();
        if (!customTreatment.name.trim()) {
          toast.error("Nome obrigatório.", {
            description: `O nome do tratamento é obrigatório.`,
          });

          return;
        }

        append({
          id: `treatment-${Date.now()}`,
          name: customTreatment.name,
          description:
            customTreatment.description || DEFAULT_TREATMENT_DESCRIPTION,
          price: Number(customTreatment.price || 0),
          image: customTreatment.image || "",
          treatmentImages: [],
        });

        setCustomTreatment({
          name: "",
          description: DEFAULT_TREATMENT_DESCRIPTION,
          image: "",
          price: 0,
        });
        setShowCustomForm(false);

        toast("Tratamento adicionado", {
          description: "Tratamento personalizado adicionado ao orçamento.",
        });
      },

      validatePrices: (treatments) => {
        if (!treatments || treatments.length === 0) {
          set({
            priceError: "É necessário adicionar pelo menos um tratamento",
          });
          return false;
        }

        for (const treatment of treatments) {
          if (typeof treatment.price !== "number" || isNaN(treatment.price)) {
            set({
              priceError: `O tratamento "${treatment.name}" precisa ter um preço válido`,
            });
            return false;
          }
        }

        set({ priceError: "" });
        return true;
      },
    }),
    {
      name: "treatment-form-store", // chave no localStorage
      partialize: (state) => ({
        localProcedures: state.localProcedures,
      }),
    }
  )
);
