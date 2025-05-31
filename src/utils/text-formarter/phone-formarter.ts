export const formatPhone = (value: string) => {
  value = value.replace(/\D/g, ""); // Remove tudo que não for número

  if (value.length <= 10) {
    // Formato fixo: (99) 9999-9999
    return value
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 14);
  } else {
    // Formato celular: (99) 99999-9999
    return value
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }
};
