import { Quote } from "@/@types/quotes";
import { DocumentData } from "firebase-admin/firestore";

type treningIAType = {
  ListQuotes: Quote[];
  analiticsObjet: any;
};

export const TrainingForSuggestions = ({
  ListQuotes,
  analiticsObjet,
}: treningIAType) => {
  return `

## Lista de Tratamentos
${ListQuotes.join("\n")}

## obejto para análise
${JSON.stringify(analiticsObjet)}

## Exemplos 
Apresente evidências para o perfil Saúde e Racional: Use estatísticas de sucesso, estudos científicos e explique os benefícios preventivos a longo prazo. Este perfil valoriza compreender todos os aspectos técnicos do tratamento.
Priorize os tratamentos com melhor conversão: Prótese Total Fixa (Protocolo) e Facetas de Porcelana apresentam as maiores taxas de fechamento (100%). Use-os como "porta de entrada" ou combine com outros procedimentos para aumentar o valor do orçamento.
Abordagem para adultos jovens (47 anos): Balance argumentos estéticos e funcionais. Este público busca soluções práticas que melhorem tanto a aparência quanto a saúde - destaque os benefícios completos dos tratamentos.
Fortaleça vínculos com pacientes novos (relacionamento médio: menos de 3 meses): Implemente follow-ups pós-consulta, envie dicas de cuidados e ofereça vantagens para indicações. O objetivo é transformar consultas pontuais em relacionamentos duradouros.

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
