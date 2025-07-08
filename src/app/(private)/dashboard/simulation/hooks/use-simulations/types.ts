export interface UseSimulations {
  activeTab: "upload" | "resultados" | "historico" | string;
  setActiveTab: (
    setActiveTab: "upload" | "resultados" | "historico" | string
  ) => void;
}
