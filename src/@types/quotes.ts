export type QuoteStatus = "draft" | "final" | "paid" | "follow";

export interface Treatment {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  treatmentImage?: string;
  treatmentImages?: {
    url: string;
    type: "before-after" | "xray" | "treatment" | "other";
    description?: string;
  }[];
}

export interface StandardTreatment {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
}

export type PatientGender = "male" | "female";
export type PatientProfile =
  | "aesthetic-emotional"
  | "aesthetic-rational"
  | "health-emotional"
  | "health-rational";

export interface Quote {
  id: string;
  patientName: string;
  dentistId: string;
  createdAt: Date;
  status: QuoteStatus;
  patientGender?: PatientGender;
  patientProfile?: PatientProfile;
  patientAge?: number;
  patientBirthdate?: Date;
  ageGroup: "child" | "teen" | "youngAdult" | "adult" | "middleAge" | "senior";
  relationship:
    | "new"
    | "sixMonths"
    | "oneYear"
    | "moreThanYear"
    | "moreThanThreeYears";
  treatments: Treatment[];
  observations?: string;
  gift?: string;
  anchoragePercentage?: number;
  downPayment?: number;
  installments?: number;
  paymentConditions: string;
  paymentPreviewText?: string;
  validityDays?: number;
  validityCustomDate?: Date;
  attachment?: string;
}

// PDF export interface
export interface QuotePdf {
  clinic: {
    name: string;
    address: string;
    logo?: string;
    description?: string;
    phoneNumber: string;
    phoneNumber2?: string;
    cnpj?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      website?: string;
      whatsapp?: string;
    };
  };
  dentist: {
    name: string;
    specialty: string;
    photo?: string;
  };
  patientName: string;
  patientGender?: PatientGender;
  patientProfile?: PatientProfile;
  date: Date;
  validUntil?: Date;
  treatments: {
    name: string;
    description: string;
    image?: string;
    treatmentImage?: string;
    treatmentImages?: {
      url: string;
      type: "before-after" | "xray" | "treatment" | "other";
      description?: string;
    }[];
    originalPrice?: number;
    discountPrice: number;
  }[];
  gift?: string;
  observations?: string;
  justification?: string;
  paymentConditions: string;
  paymentPreviewText: string;
  downPayment?: number;
  installments?: number;
}

export type AgeGroup = Quote["ageGroup"];
export type Relationship = Quote["relationship"];
