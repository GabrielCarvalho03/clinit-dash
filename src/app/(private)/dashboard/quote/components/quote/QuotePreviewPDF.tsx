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
import { formatCNPJ } from "@/utils/text-formarter/cnpj-formarter";
import { formatPhone } from "@/utils/text-formarter/phone-formarter";

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
    customOriginalPrice,
    illustrations, 
  } = quoteData;
  
  const illustrationImages = illustrations?.filter(img => img && img.url).slice(0, 4) || [];
  const hasImages = illustrationImages.length > 0;


  const getImageSectionTitle = () => {
    if (treatments.length === 1) {
      return "Imagens com finalidade exclusivamente ilustrativa do procedimento proposto";
    }
    return "Imagens com finalidade exclusivamente ilustrativa dos procedimentos propostos";
  };
  
  // Calculate pricing for display
  const totalValue = treatments.reduce((sum, t) => sum + t.discountPrice, 0);

  const originalTotal = customOriginalPrice
    ? customOriginalPrice +
      treatments.reduce((sum, t) => sum + t.discountPrice, 0)
    : treatments.reduce(
        (sum, t) => sum + (t.originalPrice || t.discountPrice),
        0
      );
  const discountAmount = originalTotal - totalValue;
  const hasDiscount = originalTotal > totalValue;

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
      id={"quote-preview-container"}
      className="font-sans bg-white mx-auto relative"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "6mm 15mm",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        <div className="flex items-center">
          {clinic.logo && (
            <div className="mr-3 flex-shrink-0">
              <img 
              id="logo-clinic"
              src={clinic.logo} alt={clinic.name} className="max-h-12 max-w-12 object-contain rounded-full" style={{
                backgroundColor: "transparent"
              }} />
            </div>
          )}
          <div>
            <h1
            id="clinicName"
            className="text-sm font-bold text-gray-800">{clinic.name}</h1>
            {clinic.cnpj && <p id="clinicCnpj" className="text-xs text-gray-500">{formatCNPJ(clinic.cnpj)}</p>}
            <p id="clinitAddress" className="text-xs text-gray-500">{clinic.address}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">
            Data: {format(new Date(date), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Patient and Dentist Info */}
      <div className="grid grid-cols-2 gap-4 mt-3 mb-3">
        <div>
          <h2 className="font-bold text-sm mb-1 text-gray-800">Paciente</h2>
          <p id="patientName" className="font-medium text-gray-800">{patientName}</p>
        </div>
        <div>
          <h2 className="font-bold text-sm mb-1 text-gray-800">Dentista Responsável</h2>
          <div className="flex items-center">
            {dentist.photo && (
              <img id="dentist-photo" src={dentist.photo} alt={dentist.name} className="w-6 h-6 rounded-full object-cover mr-2" style={{
                backgroundColor: "transparent"
              }} />
            )}
            <div>
              <p 
              id="dentist-name"
              
              className="font-medium text-gray-800 text-sm">{dentist.name}</p>
              <p id="dentist-specialty" className="text-xs text-gray-500">{dentist.specialty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction - now using personalized text */}
      <div className="mb-2">
        <h2 className="text-sm font-bold text-gray-800 mb-1">
          Proposta de Tratamento
        </h2>
        <p className="text-xs text-gray-800 leading-relaxed">
          {introductionText}
        </p>
      </div>

      {/* Treatments */}
      <div className="mb-0">
      <div className="mb-2">
        <h2 className="text-sm font-bold text-gray-800 ">
          Procedimentos Recomendados
        </h2>

        <div id="procedimentosContainer" className="border rounded-md px-2 pt-2 pb-1">
          <div className="space-y-1">
            {treatments.map((treatment, index) => (
              <div  key={index} className="flex justify-between items-start border-b border-gray-100 last:border-b-0 pb-1 last:pb-0">
                <div className="flex-grow pr-3 -mt-[2.5px]">
                  <h3 className="font-semibold text-xs text-gray-800">{treatment.name}</h3>
                  <p id="descriptionTreatment" className="text-xs text-gray-600 mt-0.5 leading-tight">{treatment.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-medium text-xs text-gray-400">
                    {formatCurrency(treatment.discountPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

           {/* Illustrations Section - Positioned before justification */}
           {hasImages && (
       <div className="mb-0">
       <h2 className="text-sm font-bold text-gray-800 ">
         Ilustrações
       </h2>
       <div id="ilustrationsContainer" className="border rounded-md px-3 pt-2">
         <div className="w-full flex flex-wrap justify-center gap-3">
           {illustrationImages.map((img, index) => (
             <div
               key={index}
               className="flex flex-col items-center justify-center"
             >
               <img
                 src={img.url}
                 alt={`Ilustração ${index + 1}`}
                 className="h-44 max-w-[150px] object-contain rounded-sm border border-gray-200"
                 style={{ backgroundColor: "transparent" }}
               />
             </div>
           ))}
         </div>
         <p id="treatment-image-legend" className="text-[8px] text-gray-400 py-[1px] text-center">
           {getImageSectionTitle()}
         </p>
       </div>
     </div>
     
      )}

        {/* Justification */}
        {justification && (
          <div className="my-2 text-sm italic font-semibold text-black  pl-3">
            {justification}
          </div>
        )}

        {/* Pricing Section */}
        <div className="mt-1 bg-gray-50 px-4 py-2 rounded-md  ">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              {hasDiscount && (
                <p className="text-sm font-medium mb-1 text-gray-800">
                  <span>De: </span>
                  <span
                    className="text-gray-500 relative inline-block"
                    style={{ paddingRight: "0.2em" }}
                  >
                    {formatCurrency(originalTotal)}
                    <span
                      id="original-total-line"
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
            <div className="text-right text-sm">
              <p className="text-xl font-bold text-gray-800">
                {/* Add "Por:" before the payment preview text */}
                <span className="mr-1 text-base">Por: {paymentPreviewText}</span> 
              </p>
              {hasDiscount && discountAmount > 0 && (
                <p className="text-sm font-medium text-green-600 mt-0">
                  Você ganhou {formatCurrency(discountAmount)} de desconto!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      

   

     {/* Bottom Section with Payment and Validity */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {/* Payment Conditions */}
        <div>
          <h2 className="font-bold text-sm mb-1 text-gray-800">Condição de pagamento</h2>
          <p className="text-xs whitespace-pre-line text-gray-800">{paymentConditions}</p>
          
          {/* Gift if available */}
          {gift && (
            <div id="giftWapper" className="mt-2 bg-green-50 p-2 rounded-md border border-green-100">
              <h3 className="flex items-center font-bold text-xs text-green-700 mb-1">
                <Gift className="h-3 w-3 mr-1" /> <span id="gift-text"> Brinde Especial</span>
              </h3>
              <p id="gift-description" className="text-xs text-green-700">{gift}</p>
            </div>
          )}
        </div>

        {/* Validity */}
        <div>
          {validUntil && (
            <div className="mb-2">
              <h2 className="font-bold text-sm mb-1 text-gray-800">Validade</h2>
              <p className="text-xs text-gray-800">
                Isso é uma proposta de tratamento pessoal e intransferível, as condições aqui expostas são válidas somente até {format(new Date(validUntil), "dd/MM/yyyy", { locale: ptBR })}.
              </p>
            </div>
          )}

          {/* Observations if available */}
          {observations && (
            <div id="observationWapper">
              <h2 className="font-bold text-sm mb-1 text-gray-800">Observações</h2>
              <p className="-mt-[1.5px] text-xs whitespace-pre-line text-gray-800">{observations}</p>
            </div>
          )}
        </div>
      </div>

     
      <div className="mt-3 pt-2 border-t text-center">
        <p className="font-medium text-xs mb-2 text-gray-800">Para dúvidas e esclarecimentos, ligue ou chame no Whatsapp:</p>
        
        <div 
        id="numberWapper"
        className="flex flex-wrap justify-center gap-3 mb-2">
          {clinic.phoneNumber && (
            <div className="flex items-center">
              <MessageSquareText className="h-3 w-3 text-green-600 mr-1" />
              <span id="phone-text" className="text-xs text-gray-800">{formatPhone(clinic.phoneNumber)}</span>
            </div>
          )}
          
          {clinic.phoneNumber2 && (
            <div className="flex items-center">
              <MessageSquareText className="h-3 w-3 text-green-600 mr-1" />
              <span id="phone-text" className="text-xs text-gray-800">{formatPhone(clinic.phoneNumber2)}</span>
            </div>
          )}
          
          {clinic.socialMedia?.whatsapp && (
            <div className="flex items-center">
              <MessageSquareText className="h-3 w-3 text-green-600 mr-1" />
              <span id="phone-text"  className="text-xs text-gray-800">{clinic.socialMedia.whatsapp}</span>
            </div>
          )}
        </div>

        {/* Social Media Links */}
        {(clinic.socialMedia?.website || clinic.socialMedia?.instagram || clinic.socialMedia?.facebook) && (
          <div className="flex flex-wrap justify-center gap-3">
            {clinic.socialMedia?.website && (
              <div className="flex items-center">
                <Globe className="h-3 w-3 text-gray-800 mr-1" />
                <a id="icon-text" href={clinic.socialMedia.website.startsWith('http') ? clinic.socialMedia.website : `https://${clinic.socialMedia.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-800 hover:underline">
                  {clinic.socialMedia.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            
            {clinic.socialMedia?.instagram && (
              <div className="flex items-center">
                <Instagram className="h-3 w-3 text-gray-800 mr-1" />
                <a id="icon-text" href={`https://instagram.com/${clinic.socialMedia.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-800 hover:underline">
                  {clinic.socialMedia.instagram}
                </a>
              </div>
            )}
            
            {clinic.socialMedia?.facebook && (
              <div className="flex items-center">
                <Facebook className="h-3 w-3 text-gray-800 mr-1" />
                <a id="icon-text" href={clinic.socialMedia.facebook.startsWith('http') ? clinic.socialMedia.facebook : `https://facebook.com/${clinic.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-800 hover:underline">
                  {clinic.socialMedia.facebook.replace(/^https?:\/\/(www\.)?facebook\.com\//, '')}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Clinitt watermark */}
      <div className="absolute right-4 bottom-4 text-xs" style={{
        opacity: 0.3,
        color: "#333"
      }}>
        gerado por clinitt.ai
      </div>
    </div>
  );
};
