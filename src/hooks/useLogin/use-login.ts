import { create } from "zustand";
import { useLoginProps } from "./types";
import { LoginSchemaData } from "./schema";
import { toast } from "sonner";
import { api } from "@/lib/axios/axios";
import { useAuth } from "../use-auth/use-auth";
import { treatmentDefaultList } from "../use-treataments/treatments-default-list";

export const useLogin = create<useLoginProps>((set) => ({
  loadingLogin: false,
  setLoadingLogin: (loadingLogin) => set({ loadingLogin }),
  onSubmit: async (data: LoginSchemaData, router) => {
    const { setLoadingLogin } = useLogin.getState();
    const { setClinic, clinic } = useAuth.getState();
    try {
      setLoadingLogin(true);
      const res = await api.post("/user/get", {
        email: data.email,
        password: data.password,
      });

      setClinic({
        ...clinic,
        id: res.data.user.id,
        name: res.data.user.ClinicName,
      });

      toast("Login realizado com sucesso", {
        description: "Bem-vindo ao sistema OdontoAI",
      });

      if (res.data.user.firstLogin == true) {
 
        router.push("/onboarding");
        return;
      }
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erro ao realizar login", {
        description:
          error instanceof Error ? error.message : "Verifique suas credenciais",
      });
    } finally {
      setLoadingLogin(false);
    }
  },
}));
