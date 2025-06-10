import { Quote, QuotePdf } from "@/@types/quotes";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { api } from "@/lib/axios/axios";
import { toast } from "sonner";
import { format } from "date-fns";

type Props = {
  setExporting: React.Dispatch<React.SetStateAction<boolean>>;
  quote?: QuotePdf;
};

// Converte uma imagem externa para base64 via backend
async function convertImgToBase64(img: HTMLImageElement): Promise<void> {
  const src = img.src;
  if (src.startsWith("data:") || src.startsWith("blob:")) return;

  try {
    const response = await api.post("/files/get", { url: src });
    const base64 = response.data.base64;

    // Aguarda a imagem carregar com o novo base64
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.setAttribute("crossorigin", "anonymous");
      img.src = base64;
    });
  } catch (err) {
    console.warn("Erro ao converter imagem para base64:", src, err);
  }
}

export async function generateProposalPDF({ setExporting, quote }: Props) {
  const element = document.getElementById("quote-preview-container");
  if (!element) return;
  setExporting(true);
  try {
    await document.fonts.ready;

    const clone = element.cloneNode(true) as HTMLElement;

    const logoClinic = clone.querySelector("#logo-clinic") as HTMLElement;
    if (logoClinic) {
      logoClinic.style.marginTop = "15px";
    }
    const ClinicCnpj = clone.querySelector("#clinicCnpj") as HTMLElement;

    if (ClinicCnpj) {
      // ClinicCnpj.style.marginTop = "-10px";
    }

    const ClinicAddress = clone.querySelector("#clinitAddress") as HTMLElement;
    if (ClinicAddress) {
      // ClinicAddress.style.marginTop = "-18px";
    }

    const PatientName = clone.querySelector("#patientName") as HTMLElement;

    if (PatientName) {
      PatientName.style.marginTop = "-2px";
      PatientName.style.fontSize = "14px";
    }

    const dentistNamenClone = clone.querySelector(
      "#dentist-name"
    ) as HTMLElement;
    if (dentistNamenClone) {
      dentistNamenClone.style.fontSize = "14px";
      dentistNamenClone.style.marginTop = "-8px";
    }

    const dentistSpecialty = clone.querySelector(
      "#dentist-specialty"
    ) as HTMLElement;
    if (dentistSpecialty) {
      dentistSpecialty.style.marginTop = "-2px";
    }

    const DentistPhoto = clone.querySelector(
      "#dentist-photo"
    ) as HTMLImageElement;

    if (DentistPhoto) {
      DentistPhoto.style.width = "30px";
      DentistPhoto.style.height = "30px";
      DentistPhoto.style.borderRadius = "50%";
      DentistPhoto.style.objectFit = "cover";
      DentistPhoto.style.objectPosition = "center right";
      DentistPhoto.style.marginTop = "5px";
    }

    const procedimentosContainer = clone.querySelector(
      "#procedimentosContainer"
    ) as HTMLElement;

    if (procedimentosContainer) {
      procedimentosContainer.style.marginTop = "8px";
    }

    const treatmentName = clone.querySelectorAll("#treatmentName");
    treatmentName.forEach((treatmentName, index) => {
      (treatmentName as HTMLElement).style.marginTop =
        index === 0 ? "-10px" : "-6px";
    });

    const descriptionTreatment = clone.querySelectorAll(
      "#descriptionTreatment"
    );
    descriptionTreatment.forEach((descriptionTreatment) => {
      (descriptionTreatment as HTMLElement).style.paddingBottom = "4px";
    });

    const ilustrationsMain = clone.querySelector(
      "#ilustrationsMain"
    ) as HTMLElement;
    if (ilustrationsMain) {
      ilustrationsMain.style.marginTop = "-5px";
    }

    const ilustrationsContainer = clone.querySelector(
      "#ilustrationsContainer"
    ) as HTMLElement;

    if (ilustrationsContainer) {
      ilustrationsContainer.style.marginTop = "8px";
    }

    const treatmentImageLegend = clone.querySelector(
      "#treatment-image-legend"
    ) as HTMLElement;
    if (treatmentImageLegend) {
      treatmentImageLegend.style.marginTop = "-7px";
      treatmentImageLegend.style.marginBottom = "5px";
    }

    const originalTotalLine = clone.querySelector(
      "#original-total-line"
    ) as HTMLElement;

    if (originalTotalLine) {
      originalTotalLine.style.marginTop = "9px";
    }

    const giftIcon = clone.querySelector("#gift-icon") as HTMLElement;

    if (giftIcon) {
      giftIcon.style.width = "15px";
      giftIcon.style.height = "15px";
    }
    const giftText = clone.querySelector("#gift-text") as HTMLElement;

    if (giftText) {
      (clone.querySelector("#gift-text") as HTMLElement).style.marginTop =
        "-12px";
    }
    const giftDescription = clone.querySelector(
      "#gift-description"
    ) as HTMLElement;

    if (giftDescription) {
      giftDescription.style.marginTop = "-5px";
      giftDescription.style.paddingBottom = "5px";
    }

    const observationWapper = clone.querySelector(
      "#observationWapper"
    ) as HTMLElement;

    if (observationWapper) {
      observationWapper.style.marginTop = "-5px";
    }

    const numberWapper = clone.querySelector("#numberWapper") as HTMLElement;

    if (numberWapper) {
      numberWapper.style.marginTop = "10px";
    }

    const giftWapper = clone.querySelector("#giftWapper") as HTMLElement;

    if (giftWapper) {
      giftWapper.style.marginTop = "15px";
      giftWapper.style.paddingBottom = "10px";
    }

    const phoneIconContainer = clone.querySelector(
      "#phone-icon-container"
    ) as HTMLElement;

    if (phoneIconContainer) {
      phoneIconContainer.style.marginTop = "10px";
    }

    const phoneText = clone.querySelectorAll("#phone-text");

    phoneText.forEach((phoneText) => {
      (phoneText as HTMLElement).style.marginTop = "-13px";
    });

    const IconText = clone.querySelectorAll("#icon-text");

    IconText.forEach((IconText) => {
      (IconText as HTMLElement).style.marginTop = "-13px";
    });

    const globeLink = clone.querySelector("#globe-link") as HTMLElement;

    if (globeLink) {
      (clone.querySelector("#globe-link") as HTMLElement).style.marginTop =
        "-13px";
    }

    const isntagramLink = clone.querySelector("#instagram-link") as HTMLElement;

    if (isntagramLink) {
      (clone.querySelector("#instagram-link") as HTMLElement).style.marginTop =
        "-13px";
    }

    const facebookLink = clone.querySelector("#facebook-link") as HTMLElement;

    if (facebookLink) {
      (clone.querySelector("#facebook-link") as HTMLElement).style.marginTop =
        "-13px";
    }

    document.body.appendChild(clone);
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "-99px";
    clone.style.opacity = "1";
    // clone.style.transform = "scale(2)";
    clone.style.transformOrigin = "top left";

    const allElements = clone.querySelectorAll("*");
    allElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el as Element);
      const elementStyle = (el as HTMLElement).style;
      elementStyle.color = computedStyle.color;
      elementStyle.backgroundColor = computedStyle.backgroundColor;
      elementStyle.borderColor = computedStyle.borderColor;
    });

    const allImages = clone.querySelectorAll("img");
    await Promise.all(
      Array.from(allImages).map((img) => convertImgToBase64(img))
    );

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#FFFFFF",
    });

    document.body.removeChild(clone);

    const imgData = canvas.toDataURL("image/png");

    // Dimensões do canvas (pixels)
    const pxFullWidth = canvas.width;
    const pxFullHeight = canvas.height;

    // Define largura do PDF A4 em mm
    const pdfWidth = 210;

    // Calcula altura proporcional em mm para manter a escala da imagem
    const pdfHeight = (pxFullHeight * pdfWidth) / pxFullWidth;

    // Cria PDF com tamanho customizado (largura A4, altura da imagem)
    const pdf = new jsPDF({
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    // Adiciona a imagem inteira no PDF (1 página só)
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    console.log("quote", quote);

    pdf.save(
      `Proposta-${quote?.patientName}-${format(
        quote?.date ?? "",
        "dd/MM/yyyy"
      )}.pdf`
    );

    const pdfBlobUrl = pdf.output("bloburl");
    window.open(pdfBlobUrl, "_blank");
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    toast.error("Erro ao gerar PDF", {
      description: "Ocorreu um erro ao gerar o PDF.",
    });
  } finally {
    setExporting(false);
  }
}
