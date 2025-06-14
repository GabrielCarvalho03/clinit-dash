import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { QuotePdf } from "@/@types/quotes";
import path from "path";
import WhatsapIcon from "../../../../../../../public/png/whatsapp_logo.png";
import globe from "../../../../../../../public/png/globe.png";
import instagram from "../../../../../../../public/png/instagram.png";
import facebook from "../../../../../../../public/png/facebook.png";
import giftIcon from "../../../../../../../public/png/gift.png";

// --- 1. REGISTRO DE FONTES ---
// É CRÍTICO que você registre as fontes que seu Tailwind CSS usa
// para garantir a fidelidade visual.
// Vou usar fontes padrão como 'Helvetica' e 'Helvetica-Bold' para simplificar,
// mas você deve substituir pelas suas fontes reais (ex: 'Roboto', 'Inter', etc.)
// e fornecer o src para o arquivo .ttf/.otf.
// Exemplo se você usa Roboto:
Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v48/KFO5CnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmkC3kaWzU.woff2",
});

Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v48/KFO5CnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmkC3kaWzU.woff2",
  fontWeight: "bold", // Ou 700
  fontStyle: "normal",
});

Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v48/KFO5CnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmkC3kaWzU.woff2",
  fontWeight: "normal", // Ou 400
  fontStyle: "italic",
});

Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v48/KFO5CnqEu92Fr1Mu53ZEC9_Vu3r1gIhOszmkC3kaWzU.woff2",
  fontWeight: "bold", // Ou 700
  fontStyle: "italic",
});

// --- 2. CORES E CONSTANTES ---
const primaryGreen = "#36AE7C"; // Verde do Clinitt.ai (ajuste se necessário)
const lightGrayBorder = "#E0E0E0"; // Borda
const textGray800 = "#1F2937"; // Equivalente ao text-gray-800 do Tailwind
const textGray500 = "#6B7280"; // Equivalente ao text-gray-500 do Tailwind
const textGray600 = "#4B5563"; // Equivalente ao text-gray-600 do Tailwind
const green50 = "#ECFDF5"; // bg-green-50
const green100 = "#D1FAE5"; // border-green-100
const green700 = "#047857"; // text-green-700
const green600 = "#059669"; // text-green-600

// Funções de formatação (para usar no ambiente do Node.js/Navegador onde o React-PDF roda)
// Se essas funções vêm de um arquivo utilitário externo, você precisaria importá-las
// ou recriar uma versão simples aqui.
const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace(".", ",")}`;
const formatCNPJ = (cnpj: string) =>
  cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
const formatPhone = (phone: string) =>
  phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
const getIntroductionText = (name: string, gender: string, profile: string) =>
  `Prezado(a) ${name}, com base na avaliação realizada, elaboramos esta proposta de tratamento especialmente para você, para atender às suas necessidades de saúde e bem-estar.`;

// --- 3. ESTILOS DO DOCUMENTO PDF ---
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "15mm", // 15mm de padding horizontal
    paddingVertical: "8mm", // 6mm de padding vertical
    fontFamily: "Roboto", // Usar a fonte registrada
    color: textGray800,
    fontSize: 9, // Tamanho de fonte padrão para a maioria dos textos
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: "5px", // Equivalente a pb-3
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB", // border-gray-200
    marginBottom: 2, // Espaçamento após o header
  },
  clinicInfo: {
    flexDirection: "row", // Para logo e texto lado a lado
    alignItems: "flex-start", // Alinha o topo do logo com o topo do texto
  },
  clinicLogoContainer: {
    marginRight: 8, // mr-3 (aproximado)
    marginTop: 0, // Ajuste para alinhar com o design do PDF
  },
  clinicLogo: {
    width: 30, // max-w-12 (aprox. 48px)
    height: 30, // max-h-12 (aprox. 48px)
    borderRadius: 24, // rounded-full (metade da largura/altura)
    objectFit: "cover",
  },
  clinicTextInfo: {
    flexDirection: "column",
  },
  clinicName: {
    fontSize: 10, // text-sm
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginBottom: 2, // mb-1 (aproximado)
  },
  clinicDetails: {
    fontSize: 8, // text-xs
    color: textGray500,
    lineHeight: 1.2,
  },
  dateText: {
    fontSize: 10, // text-sm
    fontFamily: "Roboto",
    fontWeight: "bold", // font-medium
    color: textGray800,
    marginTop: 15, // Ajuste para alinhar com o logo
  },

  // Patient and Dentist Info
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8, // mt-3
    marginBottom: 10, // mb-3
  },
  infoColumn: {
    width: "48%", // Divide em duas colunas
  },
  infoTitle: {
    fontSize: 9, // text-sm
    fontFamily: "Roboto",
    fontWeight: "bold", // font-bold
    marginBottom: 4, // mb-1 (aproximado)
    color: textGray800,
  },
  infoValue: {
    fontSize: 10, // text-sm
    fontFamily: "Roboto", // font-medium
    color: textGray800,
  },
  dentistInfoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dentistPhoto: {
    width: 24, // w-6
    height: 24, // h-6
    borderRadius: 12, // rounded-full
    objectFit: "cover",
    marginRight: 8, // mr-2
    marginTop: "-2px",
  },
  dentistName: {
    fontSize: 10, // text-sm
    fontFamily: "Roboto", // font-medium
    marginTop: "-4px",
    color: textGray800,
  },
  dentistSpecialty: {
    fontSize: 8, // text-xs
    color: textGray500,
  },

  // Proposta de Tratamento
  sectionHeading: {
    fontSize: 9, // text-sm
    fontFamily: "Roboto", // font-bold
    fontWeight: "bold",
    color: textGray800,
    marginBottom: 4, // mb-1
    marginTop: 10, // Espaçamento entre seções
  },

  sectionProposta: {
    fontSize: 9, // text-sm
    fontFamily: "Roboto", // font-bold
    fontWeight: "bold",
    color: textGray800,
    marginBottom: 4, // mb-1
    marginTop: 5, // Espaçamento entre seções
  },
  TextProcedimentos: {
    fontSize: 9, // text-sm
    fontFamily: "Roboto", // font-bold
    fontWeight: "bold",
    color: textGray800,
    marginBottom: 4, // mb-1
    marginTop: "-5px", // Espaçamento entre seções
  },

  sectionIlustrações: {
    fontSize: 9, // text-sm
    fontFamily: "Roboto", // font-bold
    fontWeight: "bold",
    color: textGray800,
    marginBottom: 4, // mb-1
    marginTop: 8, // Espaçamento entre seções
  },

  introductionText: {
    fontSize: 9, // text-xs
    color: textGray800,
    lineHeight: 1.5, // leading-relaxed
    marginBottom: 10, // mb-2
  },

  // Procedimentos Recomendados
  proceduresContainer: {
    borderWidth: 1,
    borderColor: lightGrayBorder,
    borderRadius: 4, // rounded-md
    paddingHorizontal: 8, // px-2
    paddingTop: 4, // pt-2
    paddingBottom: 4, // pb-1
    // marginTop: "-20px",
  },
  procedureItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1, // border-b
    borderBottomColor: "#F3F4F6", // border-gray-100
    paddingBottom: 2, // pb-1
    marginBottom: 4,
  },
  lastProcedureItem: {
    borderBottomWidth: 0, // last:border-b-0
    paddingBottom: 0, // last:pb-0
    marginBottom: 0, // Sem espaço no último
  },
  procedureDetails: {
    flexGrow: 1,
    paddingRight: 12, // pr-3
  },
  procedureName: {
    fontSize: 9, // text-xs
    fontFamily: "Roboto",
    fontWeight: "bold", // font-semibold
    color: textGray800,
    marginBottom: 2, // Ajuste para -mt-[2.5px]
  },
  procedureDescription: {
    fontSize: 9, // text-xs
    color: textGray600,
    lineHeight: 1.2, // leading-tight
  },
  procedurePrice: {
    fontSize: 7, // text-xs
    fontFamily: "Roboto", // font-medium
    color: textGray500, // text-gray-400
    whiteSpace: "nowrap", // Para evitar que o preço quebre linha
  },

  // Ilustrações
  illustrationsContainer: {
    borderWidth: 1,
    borderColor: lightGrayBorder,
    borderRadius: 4,
    paddingHorizontal: 12, // px-3
    paddingTop: 8, // pt-2
    paddingBottom: 1, // Pequeno padding bottom para a legenda
  },
  illustrationsRow: {
    flexDirection: "row",
    flexWrap: "nowrap", // Permite quebra de linha se muitas imagens
    justifyContent: "center",
    gap: 12, // gap-3 (equivalente em pixels)
    marginBottom: 0, // Espaço entre as imagens e a legenda
  },
  illustrationImageWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1, // Adiciona um pouco de espaço abaixo de cada imagem se houver várias
  },
  illustrationImage: {
    maxHeight: 140, // h-44 (aprox. 176px), ajustar para 140px como no PDF de exemplo
    maxWidth: 150, // max-w-[150px]
    objectFit: "cover",
    borderRadius: 2, // rounded-sm
    borderWidth: 1,
    borderColor: "#E5E7EB", // border-gray-200
  },
  illustrationLegend: {
    fontSize: 5, // text-[8px]
    color: textGray500, // text-gray-400
    paddingVertical: 1, // py-[1px]
    textAlign: "center",
  },

  // Justification
  justificationText: {
    marginTop: 9, // my-2
    marginBottom: 0, // my-2
    fontSize: 10, // text-sm
    fontFamily: "Roboto", // font-semibold
    fontWeight: "bold",
    fontStyle: "italic",
    color: "black", // text-black
  },

  // Pricing Section
  pricingSection: {
    marginTop: 5, // mt-1
    backgroundColor: "#F9FAFB", // bg-gray-50
    paddingHorizontal: 16, // px-4
    paddingVertical: 4, // py-2
    borderRadius: 4, // rounded-md
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pricingSolo: {
    marginTop: 5, // mt-1
    backgroundColor: "#F9FAFB", // bg-gray-50
    paddingHorizontal: 16, // px-4
    paddingVertical: 4, // py-2
    borderRadius: 4, // rounded-md
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  originalPriceWrapper: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  originalPriceText: {
    fontSize: 10, // text-sm
    fontFamily: "Roboto", // font-medium
    color: textGray800,
    marginBottom: 4, // mb-1
  },
  originalPriceValue: {
    color: textGray500, // text-gray-500
    position: "relative", // Para a linha riscada
    textDecoration: "line-through",
  },
  strikethrough: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 1, // Linha mais fina
    backgroundColor: "#000",
    transform: "translateY(-40%)",
  },
  finalPriceDisplay: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    fontSize: 12, // text-sm
  },
  finalPriceValue: {
    fontSize: 11, // text-xl
    fontFamily: "Roboto", // font-bold
    fontWeight: "bold",

    color: textGray800,
  },
  finalPriceLabel: {
    marginRight: 4, // mr-1
    fontSize: 11, // text-base
  },
  discountText: {
    fontSize: 10, // text-sm
    fontFamily: "Roboto",
    fontWeight: "500", // font-medium
    color: "#00a63e", // text-green-600
    paddingTop: 2,
  },

  // Bottom Section (Payment and Validity)
  bottomGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "-2px",
  },
  bottomColumn: {
    width: "48%", // Divide em duas colunas
  },
  paymentText: {
    fontSize: 9, // text-xs
    color: textGray800,
    whiteSpace: "pre-line", // Para quebrar linha no PDF
    lineHeight: 1.4,
  },

  ObservationText: {
    fontSize: 9, // text-xs
    color: textGray800,
    whiteSpace: "pre-line", // Para quebrar linha no PDF
    lineHeight: 1.4,
  },
  giftWrapper: {
    marginTop: 8, // mt-2
    backgroundColor: green50, // bg-green-50
    padding: 8, // p-2
    borderRadius: 4, // rounded-md
    borderWidth: 1,
    borderColor: green100, // border-green-100
  },
  giftHeading: {
    flexDirection: "row",
    alignItems: "center",
    fontFamily: "Roboto",
    fontWeight: "bold", // font-bold
    fontSize: 9, // text-xs
    color: green700, // text-green-700
    marginBottom: 4, // mb-1
  },
  giftIcon: {
    width: 8, // h-3 w-3 (aprox. 12px)
    height: 8,
    marginRight: 4, // mr-1
  },
  giftDescription: {
    fontSize: 9, // text-xs
    color: green700, // text-green-700
  },
  validityTextContent: {
    fontSize: 9, // text-xs
    color: textGray800,
    lineHeight: 1.4,
  },

  // Contact Section
  contactSection: {
    marginTop: 8, // mt-3
    paddingTop: 4, // pt-2
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB", // border-gray-200
    flexDirection: "column",
    alignItems: "center",
  },
  contactMainText: {
    fontSize: 9, // text-xs
    fontFamily: "Roboto",
    fontWeight: "bold", // font-medium
    color: textGray800,
    marginBottom: 4, // mb-2
    textAlign: "center",
  },
  phoneNumbersContainer: {
    marginTop: "-1px",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    gap: 12, // gap-3 (aprox. 12px)
    marginBottom: 4, // mb-2
  },
  phoneNumberText: {
    fontSize: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4, // Para ajustar o espaçamento se o gap não for suficiente
  },
  contactIcon: {
    width: 10, // h-3 w-3
    height: 10,
    marginRight: 3, // mr-1
    color: green600, // text-green-600
  },
  socialMediaContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    gap: 12, // gap-3
  },
  socialMediaLink: {
    fontSize: 9, // text-xs
    color: textGray800,
    textDecoration: "none", // Remove sublinhado padrão
  },

  // Footer Watermark
  footerWatermark: {
    position: "absolute",
    right: 15, // right-4 (equivalente a 15mm)
    bottom: 15, // bottom-4 (equivalente a 15mm)
    fontSize: 7, // text-xs (reduzido um pouco para watermark)
    color: "#6B7280", // Mais escuro que text-gray-400 para opacidade 0.3
    opacity: 0.5, // Ajusta a opacidade
  },
});

interface MyPDFDocumentProps {
  quoteData: QuotePdf;
}

export const MyPDFDocument = ({ quoteData }: MyPDFDocumentProps) => {
  const {
    clinic,
    dentist,
    patientName,
    patientGender,
    patientProfile,
    date,
    validUntil,
    treatments,
    gift,
    observations,
    justification,
    paymentConditions,
    paymentPreviewText,
    customOriginalPrice,
    illustrations,
    anchoragePercentage,
  } = quoteData;

  const illustrationImages =
    illustrations?.filter((img) => img && img.url).slice(0, 4) || [];
  const hasImages = illustrationImages.length > 0;

  const getImageSectionTitle = () => {
    if (treatments.length === 1) {
      return "Imagem com finalidade exclusivamente ilustrativa do procedimento proposto";
    }
    return "Imagens com finalidade exclusivamente ilustrativa dos procedimentos propostos";
  };

  const totalValue = treatments.reduce((sum, t) => sum + t.discountPrice, 0);
  const originalTotal = customOriginalPrice
    ? customOriginalPrice
    : treatments.reduce(
        (sum, t) => sum + (t.originalPrice || t.discountPrice),
        0
      );
  const discountAmount = originalTotal - totalValue;
  const hasDiscount = originalTotal > totalValue;

  const introductionText = getIntroductionText(
    patientName,
    patientGender || "masculino", // Ajuste para valor padrão
    patientProfile || "paciente" // Ajuste para valor padrão
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.clinicInfo}>
            {clinic.logo && (
              <View style={styles.clinicLogoContainer}>
                <Image style={styles.clinicLogo} src={clinic.logo} />
              </View>
            )}
            <View style={styles.clinicTextInfo}>
              <Text style={styles.clinicName}>{clinic.name}</Text>
              {clinic.cnpj && (
                <Text style={styles.clinicDetails}>
                  {formatCNPJ(clinic.cnpj)}
                </Text>
              )}
              <Text style={styles.clinicDetails}>{clinic.address}</Text>
            </View>
          </View>
          <Text style={styles.dateText}>
            Data: {format(new Date(date), "dd/MM/yyyy", { locale: ptBR })}
          </Text>
        </View>

        {/* Patient and Dentist Info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>Paciente</Text>
            <Text style={styles.infoValue}>{patientName}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>Dentista Responsável</Text>
            <View style={styles.dentistInfoContent}>
              <Image style={styles.dentistPhoto} src={dentist.photo} />

              <View>
                <Text style={styles.dentistName}>{dentist.name}</Text>
                <Text style={styles.dentistSpecialty}>{dentist.specialty}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Introduction */}
        <Text style={styles.sectionProposta}>Proposta de Tratamento</Text>
        <Text style={styles.introductionText}>{introductionText}</Text>

        {/* Treatments */}
        <Text style={styles.TextProcedimentos}>Procedimentos Recomendados</Text>
        <View style={styles.proceduresContainer}>
          {treatments.map((treatment, index) => (
            <View
              style={[
                styles.procedureItem,
                index === treatments.length - 1 ? styles.lastProcedureItem : {},
              ]}
            >
              <View style={styles.procedureDetails}>
                <Text style={styles.procedureName}>{treatment.name}</Text>
                <Text style={styles.procedureDescription}>
                  {treatment.description}
                </Text>
              </View>
              <Text style={styles.procedurePrice}>
                {formatCurrency(treatment.discountPrice)}
              </Text>
            </View>
          ))}
        </View>

        {/* Illustrations Section */}
        {hasImages && (
          <>
            <Text style={styles.sectionIlustrações}>Ilustrações</Text>
            <View style={styles.illustrationsContainer}>
              <View style={styles.illustrationsRow}>
                {illustrationImages.map((img, index) => (
                  <View key={index} style={styles.illustrationImageWrapper}>
                    <Image style={styles.illustrationImage} src={img.url} />
                  </View>
                ))}
              </View>
              <Text style={styles.illustrationLegend}>
                {getImageSectionTitle()}
              </Text>
            </View>
          </>
        )}

        {/* Justification */}
        {justification && (
          <Text style={styles.justificationText}>{justification}</Text>
        )}

        {/* Pricing Section */}
        <View
          style={
            anchoragePercentage || customOriginalPrice
              ? styles.pricingSection
              : styles.pricingSolo
          }
        >
          {hasDiscount && (
            <View style={styles.originalPriceWrapper}>
              <Text style={styles.originalPriceText}>
                De:{" "}
                <Text style={styles.originalPriceValue}>
                  {formatCurrency(originalTotal)}
                  <View style={styles.strikethrough} />
                </Text>
              </Text>
            </View>
          )}
          <View style={styles.finalPriceDisplay}>
            <Text style={styles.finalPriceValue}>
              <Text style={styles.finalPriceLabel}>Por:</Text>{" "}
              {paymentPreviewText}
            </Text>
            {hasDiscount && discountAmount > 0 && (
              <Text style={styles.discountText}>
                Você ganhou {formatCurrency(discountAmount)} de desconto!
              </Text>
            )}
          </View>
        </View>

        {/* Bottom Section with Payment and Validity */}
        <View style={styles.bottomGrid}>
          {/* Payment Conditions */}
          <View style={styles.bottomColumn}>
            <Text style={styles.sectionHeading}>Condição de pagamento</Text>
            <Text style={styles.paymentText}>{paymentConditions}</Text>
            {gift && (
              <View style={styles.giftWrapper}>
                <View style={styles.giftHeading}>
                  {/* Ícone de presente (substitua pelo seu SVG/PNG) */}
                  <Image style={styles.giftIcon} src={giftIcon.src} />
                  <Text>Brinde Especial</Text>
                </View>
                <Text style={styles.giftDescription}>{gift}</Text>
              </View>
            )}
          </View>

          {/* Validity */}
          <View style={styles.bottomColumn}>
            {validUntil && (
              <>
                <Text style={styles.sectionHeading}>Validade</Text>
                <Text style={styles.validityTextContent}>
                  Isso é uma proposta de tratamento pessoal e intransferível, as
                  condições aqui expostas são válidas somente até{" "}
                  {format(new Date(validUntil), "dd/MM/yyyy", { locale: ptBR })}
                  .
                </Text>
              </>
            )}
            {/* Observations if available */}
            {observations && (
              <>
                <Text style={styles.sectionHeading}>Observações</Text>
                <Text style={styles.ObservationText}>{observations}</Text>
              </>
            )}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactMainText}>
            Para dúvidas e esclarecimentos, ligue ou chame no Whatsapp:
          </Text>
          <View style={styles.phoneNumbersContainer}>
            {clinic.phoneNumber && (
              <View style={styles.contactItem}>
                {/* Ícone de Whatsapp/Telefone (substitua pelo seu SVG/PNG) */}
                <Image style={styles.contactIcon} src={WhatsapIcon.src} />
                <Text style={styles.phoneNumberText}>
                  {formatPhone(clinic.phoneNumber)}
                </Text>
              </View>
            )}
            {clinic.phoneNumber2 && (
              <View style={styles.contactItem}>
                {/* Ícone de Whatsapp/Telefone (substitua pelo seu SVG/PNG) */}
                <Image style={styles.contactIcon} src={WhatsapIcon.src} />
                <Text style={styles.phoneNumberText}>
                  {formatPhone(clinic.phoneNumber2)}
                </Text>
              </View>
            )}
            {clinic.socialMedia?.whatsapp && (
              <View style={styles.contactItem}>
                {/* Ícone de Whatsapp (substitua pelo seu SVG/PNG) */}
                <Image
                  style={styles.contactIcon}
                  src={path.join(
                    process.cwd(),
                    "public",
                    "svg",
                    "message-square.svg"
                  )}
                />
                <Text style={styles.phoneNumberText}>
                  {clinic.socialMedia.whatsapp}
                </Text>
              </View>
            )}
          </View>

          {/* Social Media Links */}
          {(clinic.socialMedia?.website ||
            clinic.socialMedia?.instagram ||
            clinic.socialMedia?.facebook) && (
            <View style={styles.socialMediaContainer}>
              {clinic.socialMedia?.website && (
                <View style={styles.contactItem}>
                  {/* Ícone de Globo (substitua pelo seu SVG/PNG) */}
                  <Image style={styles.contactIcon} src={globe.src} />
                  <Text style={styles.socialMediaLink}>
                    {clinic.socialMedia.website.replace(/^https?:\/\//, "")}
                  </Text>
                </View>
              )}
              {clinic.socialMedia?.instagram && (
                <View style={styles.contactItem}>
                  {/* Ícone de Instagram (substitua pelo seu SVG/PNG) */}
                  <Image style={styles.contactIcon} src={instagram.src} />
                  <Text style={styles.socialMediaLink}>
                    {clinic.socialMedia.instagram.replace("@", "")}
                  </Text>
                </View>
              )}
              {clinic.socialMedia?.facebook && (
                <View style={styles.contactItem}>
                  {/* Ícone de Facebook (substitua pelo seu SVG/PNG) */}
                  <Image style={styles.contactIcon} src={facebook.src} />
                  <Text style={styles.socialMediaLink}>
                    {clinic.socialMedia.facebook.replace(
                      /^https?:\/\/(www\.)?facebook\.com\//,
                      ""
                    )}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Footer Watermark */}
        <Text style={styles.footerWatermark} fixed>
          gerado por clinitt.ai
        </Text>
      </Page>
    </Document>
  );
};
