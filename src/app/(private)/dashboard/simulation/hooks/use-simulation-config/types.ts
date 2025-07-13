type dentColor =
  | "natural"
  | "clareado-suave"
  | "clareado-moderado"
  | "clareado-intenso";

type aspectColor = "natural" | "harmonioso" | "perfeito" | "marcante";
type alinhament = "natural" | "suave" | "moderado" | "completo";

export interface UseSimulationConfig {
  corDentes: dentColor;
  setCorDentes: (value: dentColor) => void;
  aspectoDentes: aspectColor;
  setAspectoDentes: (value: aspectColor) => void;
  alinhamento: alinhament;
  setAlinhamento: (value: alinhament) => void;

  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;

  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}
