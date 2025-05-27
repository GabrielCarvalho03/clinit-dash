import { addDays } from "date-fns";
import { QuotePdf } from "@/@types/quotes";
import { getRelationshipJustification } from "./relationshipJustifications";
import { getIntroductionText } from "./getIntroductionText";

export const prepareQuotePdfData = (
  formValues: any,
  clinic: any,
  dentist: any
): QuotePdf => {
  let validityDate: Date | undefined = undefined;
  if (formValues.validityCustomDate) {
    validityDate = new Date(formValues.validityCustomDate);
  } else if (formValues.validityDays && formValues.validityDays > 0) {
    validityDate = addDays(new Date(), formValues.validityDays);
  }

  const treatments = formValues.treatments || [];
  const anchoragePercentage = formValues.anchoragePercentage || 0;

  // Process treatments with correct price calculation
  const processedTreatments = treatments.map((t: any) => {
    const basePrice = t.price;
    // Apply anchorage to get the "original" price
    const originalPrice =
      anchoragePercentage > 0
        ? basePrice * (1 + anchoragePercentage / 100)
        : basePrice;

    return {
      name: t.name,
      description: t.description,
      discountPrice: basePrice,
      originalPrice: originalPrice,
      image: t.image,
      treatmentImage: t.treatmentImage,
      treatmentImages: t.treatmentImages,
    };
  });

  return {
    clinic: {
      name: clinic.name,
      address: clinic.address,
      logo: clinic.logo?.toString() || undefined,
      description: clinic.description,
      phoneNumber: clinic.phoneNumber,
      phoneNumber2: clinic.phoneNumber2,
      cnpj: clinic.cnpj,
      socialMedia: clinic.socialMedia,
    },
    dentist: {
      name: dentist?.name,
      specialty: dentist?.specialty,
      photo: dentist?.photo?.toString() || undefined,
    },
    patientName: formValues.patientName,
    patientGender: formValues.patientGender,
    patientProfile: formValues.patientProfile,
    date: new Date(),
    customOriginalPrice: formValues.customOriginalPrice || undefined,
    validUntil: validityDate,
    treatments: processedTreatments,
    gift: formValues.gift,
    observations: formValues.observations,
    justification: getRelationshipJustification(formValues.relationship),
    paymentConditions: formValues.paymentConditions,
    paymentPreviewText:
      formValues.paymentPreviewText || formValues.paymentConditions,
    downPayment: formValues.downPayment || 0,
    installments: formValues.installments || 1,
  };
};
