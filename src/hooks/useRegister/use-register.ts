import { create } from "zustand";
import { useRegisterProps } from "./types";
import { toast } from "sonner";
import { api } from "@/lib/axios/axios";

export const useRegister = create<useRegisterProps>((set) => ({
  loadingRegister: false,
  setLoadingRegister: (loading: boolean) => set({ loadingRegister: loading }),
  onSubmit: async (data, router) => {
    const { setLoadingRegister } = useRegister.getState();
    try {
      setLoadingRegister(true);
      await api.post("/user/create", {
        email: data.email,
        password: data.password,
        ClinicName: data.name,
      });

      toast("Conta criada com sucesso", {
        description: "Você já pode acessar o sistema OdontoAI",
      });
      router.push("/dashboard");
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
