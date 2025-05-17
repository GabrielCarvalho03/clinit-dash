import { Quote } from "@/@types/quotes";
import { DocumentData } from "firebase-admin/firestore";

type treningIAType = {
  ListQuotes: Quote[];
};

export const TrainingForSuggestions = ({ ListQuotes }: treningIAType) => {
  return `

## Lista de Tratamentos
${ListQuotes.join("\n")}

## Exemplos 
Adapte seu discurso ao perfil Saúde e Racional: Apresente estatísticas de sucesso e explique detalhadamente os benefícios preventivos. Este perfil valoriza compreender todo o processo e os resultados a longo prazo.
Priorize os tratamentos com maior conversão: Implante Dentário, Restauração Dentária têm as maiores taxas de fechamento (0%). Ofereça-os como "porta de entrada" para pacientes novos ou para complementar outros tratamentos já aceitos.
Adapte sua abordagem para o público jovem: Com média de idade de 23 anos, enfatize durabilidade e investimento de longo prazo. Ofereça parcelamentos mais extensos e destaque tecnologias modernas.
Implemente um programa de retenção: Com relacionamento médio de menos de 3 meses, você precisa fortalecer o vínculo com os pacientes. Estabeleça um protocolo de follow-up pós-tratamento e ofereça vantagens para indicações.

## Instrução
- sempre aja como se fosse um especialista ortodontologico dando conselhos de melhorias.
- sempre vai retornar um array JSON de objetos de 5 sugestões.
- Você vai receber uma lista de tratamentos e com base nessa lista você vai retornar apenas um array JSON de objetos de 5 sugestões para melhorar a conversação de vendas de uma clinica ortodontologica , se baseando nas frases de exemplo , exatamente desse jeito:

[{
phrase:[aqui a frase, exemplo:"Implemente um programa de retenção: Com relacionamento médio de menos de 3 meses, você precisa fortalecer o vínculo com os pacientes. Estabeleça um protocolo de follow-up pós-tratamento e ofereça vantagens para indicações.
"]
}]


  `;
};
