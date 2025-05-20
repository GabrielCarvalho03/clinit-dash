import { formatCurrency } from "@/utils/formart";
import { QuotePdf } from "@/@types/quotes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MessageSquareText,
  Gift,
  Globe,
  Instagram,
  FacebookIcon,
  Facebook,
} from "lucide-react";
import { getIntroductionText } from "@/utils/getIntroductionText";

interface QuotePreviewPDFProps {
  quoteData: QuotePdf;
  id?: string;
}

export const QuotePreviewPDF = ({
  quoteData,
  id = "quote-preview-container",
}: QuotePreviewPDFProps) => {
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
    downPayment,
    installments,
  } = quoteData;

  // Calculate pricing for display
  const totalValue = treatments.reduce((sum, t) => sum + t.discountPrice, 0);

  const originalTotal = treatments.reduce(
    (sum, t) => sum + (t.originalPrice || t.discountPrice),
    0
  );
  const discountAmount = originalTotal - totalValue;
  const hasDiscount = originalTotal > totalValue;
  console.log("treatments", discountAmount);

  // Generate personalized introduction text
  const introductionText = getIntroductionText(
    patientName,
    patientGender,
    patientProfile
  );

  // Helper function to display image type in Portuguese
  const getImageTypeText = (type: string) => {
    switch (type) {
      case "before-after":
        return "Antes e Depois";
      case "xray":
        return "Raio-X";
      case "treatment":
        return "Imagem do Tratamento";
      case "other":
        return "Imagem Adicional";
      default:
        return "Imagem";
    }
  };

  return (
    <div
      id="quote-preview-container"
      className="font-sans bg-white mx-auto relative"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "15mm 20mm",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b">
        <div className="flex items-center">
          {clinic.logo && (
            <div className="mr-4 flex-shrink-0">
              <img
                src={clinic.logo}
                alt={clinic.name}
                className="h-16 w-16 object-contain"
                style={{
                  backgroundColor: "transparent",
                  height: "4rem",
                  width: "4rem",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{clinic.name}</h1>
            {clinic.cnpj && (
              <p id="clinic-cnpj" className="text-sm text-gray-500">
                {clinic.cnpj}
              </p>
            )}
            <p id="clinic-address" className="text-xs text-gray-500">
              {clinic.address}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">
            Data:{" "}
            {format(new Date(date), "dd/MM/yyyy", {
              locale: ptBR,
            })}
          </p>
        </div>
      </div>

      {/* Patient and Dentist Info */}
      <div className="grid grid-cols-2 gap-8 mt-4 mb-4">
        <div>
          <h2 className="font-bold text-lg mb-1 text-gray-800">Paciente</h2>
          <p className="font-medium text-gray-800">{patientName}</p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-1 text-gray-800">
            Dentista Responsável
          </h2>
          <div className="flex items-center">
            {dentist.photo && (
              <img
                id="dentist-photo"
                src={dentist.photo}
                alt={dentist.name}
                className="w-10 h-10 rounded-full object-cover mr-2"
                style={{
                  backgroundColor: "transparent",
                }}
              />
            )}
            <div>
              <p id="dentist-name" className="font-medium text-gray-800">
                Dr. {dentist.name}
              </p>
              <p id="dentist-area" className="text-sm text-gray-500">
                {dentist.specialty}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction - now using personalized text */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Proposta de Tratamento
        </h2>
        <p className="text-sm text-gray-800">{introductionText}</p>
      </div>

      {/* Treatments */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Procedimentos Recomendados
        </h2>

        <div className="space-y-4">
          {treatments.map((treatment, index) => (
            <div key={index} className="border rounded-md p-3">
              <div className="flex flex-col md:flex-row">
                {/* Treatment details */}
                <div className="flex-grow md:w-2/5">
                  <h3 className="font-bold text-base text-gray-800">
                    {treatment.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {treatment.description}
                  </p>
                  <p className="font-bold text-base mt-auto text-gray-800">
                    {formatCurrency(
                      treatment.originalPrice || treatment.discountPrice
                    )}
                  </p>
                </div>

                {/* Treatment Images */}
                <div className="md:w-3/5 ml-auto">
                  {treatment.treatmentImages &&
                  treatment.treatmentImages.length > 0 ? (
                    <div className="flex flex-col items-end">
                      <div className="flex justify-end gap-2 mb-1">
                        {treatment.treatmentImages.map((img, imgIndex) => (
                          <div key={imgIndex} className="flex-shrink-0">
                            <img
                              src={img.url}
                              alt={`${getImageTypeText(img.type)}`}
                              className="h-36 object-cover rounded-sm"
                              style={{
                                backgroundColor: "transparent",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right w-full">
                        Imagens com finalidade exclusivamente ilustrativa
                      </p>
                    </div>
                  ) : treatment.treatmentImage ? (
                    <div className="flex flex-col items-end">
                      <div>
                        <img
                          src={treatment.treatmentImage}
                          alt={`Imagem do tratamento: ${treatment.name}`}
                          className="h-36 object-cover rounded-sm"
                          style={{
                            backgroundColor: "transparent",
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right w-full">
                        Imagens com finalidade exclusivamente ilustrativa
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Justification */}
        {justification && (
          <div className="my-3 text-sm italic text-gray-600 border-l-2 border-gray-400 pl-3">
            {justification}
          </div>
        )}

        {/* Pricing Section */}
        <div className="mt-5 bg-gray-50 px-4 py-2 rounded-md  ">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              {hasDiscount && (
                <p className="font-medium mb-1 text-gray-800">
                  <span>De: </span>
                  <span
                    className="text-gray-500 relative inline-block"
                    style={{ paddingRight: "0.2em" }}
                  >
                    {formatCurrency(originalTotal)}
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        right: 0,
                        height: "1px",
                        backgroundColor: "currentColor",
                        transform: "translateY(-40%)",
                        pointerEvents: "none",
                      }}
                    />
                  </span>
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">
                {/* Add "Por:" before the payment preview text */}
                <span className="mr-1">Por:</span> {paymentPreviewText}
              </p>
              {hasDiscount && discountAmount > 0 && (
                <p className="text-sm font-medium text-green-600 mt-1">
                  Você ganhou {formatCurrency(discountAmount)} de desconto!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section with Payment and Validity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Payment Conditions */}
        <div>
          <h2 className="font-bold text-lg mb-2 text-gray-800">
            Condição de pagamento
          </h2>
          <p className="text-sm whitespace-pre-line text-gray-800">
            {paymentConditions}
          </p>

          {/* Gift if available */}
          {gift && (
            <div className="mt-3 bg-green-50 p-3 rounded-md border border-green-100">
              <h3 className="flex items-center font-bold text-sm text-green-700 mb-1">
                <Gift id="gift-icon" className="h-4 w-4 mr-1" />{" "}
                <h1 id="gift-title">Brinde Especial</h1>
              </h3>
              <p id="gift-text" className="text-sm text-green-700">
                {gift}
              </p>
            </div>
          )}
        </div>

        {/* Validity - With updated text format */}
        <div>
          {validUntil && (
            <div className="mb-4">
              <h2 className="font-bold text-lg mb-2 text-gray-800">Validade</h2>
              <p className="text-sm text-gray-800">
                Isso é uma proposta de tratamento pessoal e intransferível, as
                condições aqui expostas são válidas somente até{" "}
                {format(new Date(validUntil), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
                .
              </p>
            </div>
          )}

          {/* Observations if available */}
          {observations && (
            <div>
              <h2 className="font-bold text-lg mb-2 text-gray-800">
                Observações
              </h2>
              <p className="text-sm whitespace-pre-line text-gray-800">
                {observations}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t text-center">
        <p className="font-medium text-sm mb-2 text-gray-800">
          Para dúvidas e esclarecimentos, ligue ou chame no Whatsapp:
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-3">
          {clinic.phoneNumber && (
            <div className="flex items-center">
              <MessageSquareText
                id="phone-icon"
                className="h-4 w-4 text-green-600 mr-1"
              />
              <span id="phone-text" className="text-sm text-gray-800">
                {clinic.phoneNumber}
              </span>
            </div>
          )}

          {clinic.phoneNumber2 && (
            <div className="flex items-center">
              <MessageSquareText
                id="phone-icon2"
                className="h-4 w-4 text-green-600 mr-1"
              />
              <span id="phone-text2" className="text-sm text-gray-800">
                {clinic.phoneNumber2}
              </span>
            </div>
          )}

          {clinic.socialMedia?.whatsapp && (
            <div className="flex items-center">
              <MessageSquareText className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-gray-800">
                {clinic.socialMedia.whatsapp}
              </span>
            </div>
          )}
        </div>

        {/* Social Media Links - All in black color */}
        {(clinic.socialMedia?.website ||
          clinic.socialMedia?.instagram ||
          clinic.socialMedia?.facebook) && (
          <div className="flex flex-wrap justify-center gap-4">
            {clinic.socialMedia?.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-gray-800 mr-1" />
                <a
                  id="globe-link"
                  href={
                    clinic.socialMedia.website.startsWith("http")
                      ? clinic.socialMedia.website
                      : `https://${clinic.socialMedia.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-800 hover:underline"
                >
                  {clinic.socialMedia.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}

            {clinic.socialMedia?.instagram && (
              <div className="flex items-center">
                <Instagram className="h-4 w-4 text-gray-800 mr-1" />
                <a
                  id="instagram-link"
                  href={`https://instagram.com/${clinic.socialMedia.instagram.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-800 hover:underline"
                >
                  {clinic.socialMedia.instagram}
                </a>
              </div>
            )}

            {clinic.socialMedia?.facebook && (
              <div className="flex items-center">
                <Facebook className="h-4 w-4 text-gray-800 mr-1" />
                <a
                  id="facebook-link"
                  href={
                    clinic.socialMedia.facebook.startsWith("http")
                      ? clinic.socialMedia.facebook
                      : `https://facebook.com/${clinic.socialMedia.facebook}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-800 hover:underline"
                >
                  {clinic.socialMedia.facebook.replace(
                    /^https?:\/\/(www\.)?facebook\.com\//,
                    ""
                  )}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Clinitt watermark with low opacity in bottom right corner */}
      <div
        className="absolute right-6 bottom-6 text-xs"
        style={{
          opacity: 0.3,
          color: "#333",
        }}
      >
        gerado por clinitt.ai
      </div>
    </div>
  );
};
