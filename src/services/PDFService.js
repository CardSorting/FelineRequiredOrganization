import jsPDF from 'jspdf';

export const generatePDF = (canvas, layout) => {
  if (!canvas) {
    throw new Error('Canvas reference is invalid');
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [layout.pageWidth, layout.pageHeight]
  });

  // Use canvas to draw directly onto the PDF
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate the scaling factor to fit the canvas into the PDF page size
  const scaleX = (layout.pageWidth - 2 * layout.margin) / canvasWidth;
  const scaleY = (layout.pageHeight - 2 * layout.margin) / canvasHeight;
  const scale = Math.min(scaleX, scaleY);

  const imgData = canvas.toDataURL('image/jpeg'); // Use the desired image format

  // Ensure scaling factors are valid
  if (isNaN(scale) || scale <= 0) {
    throw new Error('Invalid scale factor calculated');
  }

  pdf.addImage(
    imgData,
    'JPEG', 
    layout.margin,
    layout.margin,
    canvasWidth * scale,
    canvasHeight * scale
  );

  return pdf;
};

export const addCropMarks = (pdf, layout) => {
  const { bleed, pageWidth, pageHeight, cardWidth, cardHeight } = layout;

  pdf.setLineWidth(0.2);
  pdf.setDrawColor(0);

  for (let col = 0; col < layout.cardsPerRow; col++) {
    for (let row = 0; row < layout.cardsPerColumn; row++) {
      const x = layout.cardPositions[row * layout.cardsPerRow + col].x + layout.bleed;
      const y = layout.cardPositions[row * layout.cardsPerRow + col].y + layout.bleed;

      pdf.line(x, y, x, y - bleed);
      pdf.line(x, y, x - bleed, y);
      pdf.line(x + cardWidth, y, x + cardWidth, y - bleed);
      pdf.line(x + cardWidth, y, x + cardWidth + bleed, y);
      pdf.line(x, y + cardHeight, x, y + cardHeight + bleed);
      pdf.line(x, y + cardHeight, x - bleed, y + cardHeight);
      pdf.line(x + cardWidth, y + cardHeight, x + cardWidth, y + cardHeight + bleed);
      pdf.line(x + cardWidth, y + cardHeight, x + cardWidth + bleed, y + cardHeight);
    }
  }
};

export const addBleedLine = (pdf, layout) => {
  const { bleed, pageWidth, pageHeight } = layout;

  pdf.setLineWidth(0.2);
  pdf.setDrawColor(255, 0, 0);

  pdf.rect(bleed, bleed, pageWidth - 2 * bleed, pageHeight - 2 * bleed, 'S');
};

export const savePDF = (pdf) => {
  pdf.save('cards.pdf');
};