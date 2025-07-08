export type SimulationHistoric = {
  id: string;
  createdAt: string;
  tipo: string;
  resultado: string;
  photo: string;
};

export interface UseSimulatioHistoric {
  simulationHistoric: SimulationHistoric[];
  setSimulationHistoric: (historic: SimulationHistoric[]) => void;
  getHistoric: () => Promise<SimulationHistoric[]>;
  saveHistoric: (simulacao: SimulationHistoric) => Promise<void>;
}
