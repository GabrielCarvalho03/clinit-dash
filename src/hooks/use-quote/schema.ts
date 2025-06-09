import { z } from "zod";

export const quoteSchema = z.object({
  patientName: z.string().min(1, "Nome do paciente é obrigatório"),
  patientGender: z.enum(["male", "female"]).optional(),
  patientProfile: z
    .enum([
      "aesthetic-emotional",
      "aesthetic-rational",
      "health-emotional",
      "health-rational",
      "neutral-general",
    ])
    .optional(),
  patientAge: z.number().min(0).max(120).optional(),
  patientBirthdate: z.date().optional(),
  dentistId: z.string().min(1, "Dentista responsável é obrigatório"),
  ageGroup: z.enum([
    "child",
    "teen",
    "youngAdult",
    "adult",
    "middleAge",
    "senior",
  ]),
  relationship: z.enum([
    "new",
    "sixMonths",
    "oneYear",
    "moreThanYear",
    "moreThanThreeYears",
  ]),
  treatments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Nome do tratamento é obrigatório"),
        description: z.string().min(1, "Descrição do tratamento é obrigatória"),
        price: z.number().min(0, "Preço deve ser maior ou igual a zero"),
        image: z.string().optional(),
        treatmentImage: z.string().optional(),
        treatmentImages: z
          .array(
            z.object({
              url: z.string(),
              type: z.enum(["before-after", "xray", "treatment", "other"]),
              description: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .min(1, "Pelo menos um tratamento é obrigatório"),
  observations: z.string().optional(),
  gift: z.string().optional(),
  anchoragePercentage: z.number().or(z.string()).default(10), // Remover .optional()
  downPayment: z.number().default(0), // Remover .optional()
  installments: z.number().default(1), // Remover .optional()
  paymentConditions: z
    .string()
    .min(1, "Condições de pagamento são obrigatórias"),
  paymentPreviewText: z.string().optional(),
  validityDays: z.number().optional(),
  validityCustomDate: z.date().optional(),
  illustrationImages: z
    .array(
      z.object({
        url: z.string(),
        type: z.string(),
      })
    )
    .optional(),
  customOriginalPrice: z.number().optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
