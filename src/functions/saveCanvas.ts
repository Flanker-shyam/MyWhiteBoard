import html2canvas from 'html2canvas'; // Import html2canvas for converting canvas to image
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import { fabric } from 'fabric'; // Import fabric for canvas drawing

// Function to handle saving canvas content as image
export const saveAsImage = (canvas:fabric.Canvas) => {
    if (canvas) {
      html2canvas(canvas.getElement(), { useCORS: true }).then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "whiteboard.png";
        link.href = imageData;
        link.click();
      });
    }
  };

  // Function to handle saving canvas content as PDF
  export const saveAsPDF = (canvas:fabric.Canvas) => {
    if (canvas) {
      const pdf = new jsPDF();
      const canvasElement = canvas.getElement();
      const canvasDataURL = canvasElement.toDataURL("image/png");
      const width = canvasElement.width / 4; // Adjust the width to fit in the PDF
      const height = canvasElement.height / 4; // Adjust the height to fit in the PDF
      pdf.addImage(canvasDataURL, "PNG", 0, 0, width, height);
      pdf.save("whiteboard.pdf");
    }
  };
