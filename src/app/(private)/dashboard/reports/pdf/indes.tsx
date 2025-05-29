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
      logoClinic.style.marginTop = "10px";
    }

    const dentistNamenClone = clone.querySelector(
      "#dentist-name"
    ) as HTMLElement;
    if (dentistNamenClone) {
      // dentistNamenClone.style.marginTop = "0px";
    }

    const dentistAreaInClone = clone.querySelector(
      "#dentist-area"
    ) as HTMLElement;
    if (dentistAreaInClone) {
      // dentistAreaInClone.style.marginTop = "-13px";
    }

    // (clone.querySelector("#clinic-cnpj") as HTMLElement).style.marginTop =
    //   "-8px";

    // (clone.querySelector("#clinic-address") as HTMLElement).style.marginTop =
    //   "-13px";

    const DentistPhoto = clone.querySelector(
      "#dentist-photo"
    ) as HTMLImageElement;

    if (DentistPhoto) {
      DentistPhoto.style.width = "40px";
      DentistPhoto.style.height = "40px";
      DentistPhoto.style.borderRadius = "50%";
      DentistPhoto.style.objectFit = "cover";
      DentistPhoto.style.objectPosition = "center right";
      DentistPhoto.style.marginTop = "14px";
    }

    const TreatmentPreview = clone.querySelectorAll("#treatment-preview");

    TreatmentPreview.forEach((TreatmentPreview) => {
      (TreatmentPreview as HTMLElement).style.paddingBottom = "8px";
    });

    const treatmentImageLegend = clone.querySelector(
      "#treatment-image-legend"
    ) as HTMLElement;
    if (treatmentImageLegend) {
      treatmentImageLegend.style.marginTop = "-7px";
    }

    const originalTotalLine = clone.querySelector(
      "#original-total-line"
    ) as HTMLElement;

    if (originalTotalLine) {
      originalTotalLine.style.marginTop = "10px";
    }

    const paymentAndValidity = clone.querySelector(
      "#paymentAndValidity"
    ) as HTMLElement;

    if (paymentAndValidity) {
      paymentAndValidity.style.marginTop = "-30px";
    }

    const giftIcon = clone.querySelector("#gift-icon") as HTMLElement;

    if (giftIcon) {
      giftIcon.style.width = "15px";
      giftIcon.style.height = "15px";
    }
    const giftText = clone.querySelector("#gift-text") as HTMLElement;

    if (giftText) {
      (clone.querySelector("#gift-text") as HTMLElement).style.marginTop =
        "-9px";
    }
    const giftTitle = clone.querySelector("#gift-title") as HTMLElement;

    if (giftTitle) {
      (clone.querySelector("#gift-title") as HTMLElement).style.marginTop =
        "-13px";
    }

    const footer = clone.querySelector("#footer") as HTMLElement;

    if (footer) {
      footer.style.paddingTop = "-10px";
    }

    const phoneIconContainer = clone.querySelector(
      "#phone-icon-container"
    ) as HTMLElement;

    if (phoneIconContainer) {
      phoneIconContainer.style.marginTop = "10px";
    }
    const phoneIconContainer2 = clone.querySelector(
      "#phone-icon-container2"
    ) as HTMLElement;

    if (phoneIconContainer2) {
      phoneIconContainer2.style.marginTop = "10px";
    }

    const phoneIcon = clone.querySelector("#phone-icon") as HTMLElement;
    if (phoneIcon) {
      phoneIcon.style.marginTop = "0px";
    }
    const phoneIcon2 = clone.querySelector("#phone-icon2") as HTMLElement;

    if (phoneIcon2) {
      (clone.querySelector("#phone-icon2") as HTMLElement).style.marginTop =
        "0px";
    }

    const phoneText = clone.querySelector("#phone-text") as HTMLElement;

    if (phoneText) {
      (clone.querySelector("#phone-text") as HTMLElement).style.marginTop =
        "-13px";
    }

    const phoneText2 = clone.querySelector("#phone-text2") as HTMLElement;

    if (phoneText2) {
      (clone.querySelector("#phone-text2") as HTMLElement).style.marginTop =
        "-13px";
    }

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
