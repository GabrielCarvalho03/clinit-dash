import { PatientGender, PatientProfile } from "@/@types/quotes";
import { ReactNode } from "react";

export const getIntroductionText = (
  patientName: string,
  gender?: PatientGender,
  profile?: PatientProfile
): ReactNode => {
  const greeting = gender === "female" ? "Prezada" : "Prezado";

  const bold = <strong> </strong>;

  if (!profile) {
    return (
      <>
        {greeting} {patientName}, com base na avaliação realizada, elaboramos
        esta proposta de tratamento personalizada especialmente para você, para
        atender às suas necessidades específicas.
      </>
    );
  }

  switch (profile) {
    case "aesthetic-emotional":
      return (
        <>
          {greeting} {patientName}, com base na avaliação realizada, elaboramos
          esta proposta de tratamento especialmente para você, para realçar seu
          sorriso e aumentar sua confiança.
        </>
      );
    case "aesthetic-rational":
      return (
        <>
          {greeting} {patientName}, com base na avaliação realizada, elaboramos
          esta proposta de tratamento especialmente para você, com foco na
          estética e funcionalidade do seu sorriso.
        </>
      );
    case "health-emotional":
      return (
        <>
          {greeting} {patientName}, com base na avaliação realizada, elaboramos
          esta proposta de tratamento especialmente para você, para atender às
          suas necessidades de saúde e bem-estar.
        </>
      );
    case "health-rational":
      return (
        <>
          {greeting} {patientName}, com base na avaliação realizada, elaboramos
          esta proposta de tratamento especialmente para você, para melhorar sua
          saúde bucal de forma eficaz.
        </>
      );
    default:
      return (
        <>
          {greeting} {patientName}, com base na avaliação realizada, elaboramos
          esta proposta de tratamento especialmente para você.
        </>
      );
  }
};
