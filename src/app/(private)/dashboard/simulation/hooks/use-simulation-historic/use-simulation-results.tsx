import { create } from "zustand";
import { UseSimulatioHistoric } from "./types";
import { api } from "@/lib/axios/axios";
import { useAuth } from "@/hooks/use-auth/use-auth";

export const useSimulationHistoric = create<UseSimulatioHistoric>((set) => ({
  simulationHistoric: [],
  setSimulationHistoric: (historic) => set({ simulationHistoric: historic }),

  getHistoric: async () => {
    const { clinic } = useAuth.getState();
    const { setSimulationHistoric } = useSimulationHistoric.getState();

    try {
      const response = await api.post("/simulations/get", {
        clinicId: clinic?.id,
      });

      setSimulationHistoric(response.data.simulations);
      return response.data.simulations;
    } catch (error) {
      console.error("Erro ao obter o histórico de simulações:", error);
      return [];
    }
  },

  saveHistoric: async (simulacao) => {
    const { clinic } = useAuth.getState();
    const { setSimulationHistoric, simulationHistoric } =
      useSimulationHistoric.getState();
    const simulationAdapter = {
      id: simulacao.id,
      createdAt: simulacao.createdAt,
      tipo: simulacao.tipo,
      resultado: simulacao.resultado,
      photo: simulacao.photo,
      clinicId: clinic?.id,
    };
    try {
      const res = await api.post("/simulations/create", simulationAdapter);
      setSimulationHistoric([res.data.data, ...simulationHistoric]);
    } catch (error) {
      console.error("Erro ao salvar a simulação no histórico:" + error);
    }
  },
}));
