import { create } from "zustand";
import { useRegisterProps } from "./types";
import { toast } from "sonner";
import { api } from "@/lib/axios/axios";
import { treatmentDefaultList } from "@/app/(private)/dashboard/treatments/hooks/use-treataments/treatments-default-list";

export const useRegister = create<useRegisterProps>((set) => ({
  loadingRegister: false,
  setLoadingRegister: (loading: boolean) => set({ loadingRegister: loading }),
  onSubmit: async (data, router) => {
    const { setLoadingRegister } = useRegister.getState();
    try {
      setLoadingRegister(true);
      const resUser = await api.post("/user/create", {
        email: data.email,
        password: data.password,
        ClinicName: data.name,
      });

      treatmentDefaultList.map(async (treatment) => {
        await api.post("/treatments/create", {
          clinicId: resUser.data.clinicId,
          name: treatment.name,
          description: treatment.description,
          image: treatment.image,
          price: treatment.price,
        });
      });

      toast("Conta criada com sucesso", {
        description: "Você já pode acessar o sistema OdontoAI",
      });
      router.push("/onboarding");
    } catch (error) {
      toast.error("Erro ao criar conta", {
        description:
          error instanceof Error ? error.message : "Tente novamente mais tarde",
      });
    } finally {
      setLoadingRegister(false);
    }
  },
}));
