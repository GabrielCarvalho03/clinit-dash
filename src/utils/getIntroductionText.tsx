import { PatientGender, PatientProfile } from "@/@types/quotes";

export const getIntroductionText = (
  patientName: string,
  gender?: PatientGender,
  profile?: PatientProfile
): string => {
  const greeting = gender === "female" ? "Prezada" : "Prezado";

  if (!profile) {
    return `${greeting} ${patientName}, com base na avaliação realizada, elaboramos esta proposta de tratamento personalizada para atender às suas necessidades específicas.`;
  }

  switch (profile) {
    case "aesthetic-emotional":
      return `${greeting} ${patientName}, com base na avaliação realizada, elaboramos esta proposta de tratamento para realçar seu sorriso e aumentar sua confiança.`;

    case "aesthetic-rational":
      return `${greeting} ${patientName}, com base na avaliação realizada, elaboramos esta proposta de tratamento com foco na estética e funcionalidade do seu sorriso.`;

    case "health-emotional":
      return `${greeting} ${patientName}, com base na avaliação realizada, elaboramos esta proposta de tratamento para atender às suas necessidades de saúde e bem-estar.`;

    case "health-rational":
      return `${greeting} ${patientName}, com base na avaliação realizada, elaboramos esta proposta de tratamento para melhorar sua saúde bucal de forma eficaz.`;

    default:
      return `${greeting} ${patientName}, com base na avaliação realizada, elaboramos esta proposta de tratamento personalizada para atender às suas necessidades específicas.`;
  }
};
