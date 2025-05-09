export const getRelationshipJustification = (relationship: string) => {
  switch (relationship) {
    case "new":
      return "Como forma de boas-vindas à nossa clínica, estamos oferecendo uma condição especial para sua primeira experiência conosco.";
    case "sixMonths":
      return "Por ser um paciente recente, estamos oferecendo uma condição especial para incentivar a continuidade do tratamento.";
    case "oneYear":
      return "Como já acompanha conosco há algum tempo, garantimos uma condição exclusiva como forma de valorização.";
    case "moreThanYear":
      return "Como já é nosso paciente há mais de um ano, aplicamos um desconto especial como forma de reconhecimento pela confiança.";
    case "moreThanThreeYears":
      return "Pela sua longa trajetória conosco, este orçamento conta com uma condição única de agradecimento à sua fidelidade.";
    default:
      return "";
  }
};
