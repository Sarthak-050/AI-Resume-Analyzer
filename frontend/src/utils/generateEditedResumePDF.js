import jsPDF from "jspdf";

export function generateEditedResumePDF(resumeData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 50;
  let y = 60;

  const inkColor = [23, 28, 44];
  const grayColor = [110, 118, 140];
  const brandColor = [192, 38, 211];

  const checkPageBreak = (neededSpace = 40) => {
    if (y + neededSpace > pageHeight - 40) {
      doc.addPage();
      y = 50;
    }
  };

  doc.setTextColor(...inkColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(resumeData.fullName || "Untitled Resume", marginX, y);
  y += 22;

  const contactParts = [resumeData.email, resumeData.phone].filter(Boolean);
  if (contactParts.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text(contactParts.join("   •   "), marginX, y);
    y += 24;
  } else {
    y += 10;
  }

  doc.setDrawColor(...brandColor);
  doc.setLineWidth(1.5);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 26;

  const sectionHeading = (title) => {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...brandColor);
    doc.text(title.toUpperCase(), marginX, y);
    y += 16;
  };

  if (resumeData.summary) {
    sectionHeading("Summary");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...inkColor);
    const wrapped = doc.splitTextToSize(resumeData.summary, pageWidth - marginX * 2);
    doc.text(wrapped, marginX, y);
    y += wrapped.length * 13 + 20;
  }

  if (resumeData.experience?.length) {
    sectionHeading("Experience");

    resumeData.experience.forEach((exp) => {
      checkPageBreak(50);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...inkColor);
      doc.text(exp.title || "", marginX, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...grayColor);
      doc.text(exp.duration || "", pageWidth - marginX, y, { align: "right" });
      y += 14;

      if (exp.company) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(...grayColor);
        doc.text(exp.company, marginX, y);
        y += 14;
      }

      (exp.bullets || []).forEach((bullet) => {
        checkPageBreak(20);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...inkColor);
        doc.text("•", marginX, y);
        const wrapped = doc.splitTextToSize(bullet, pageWidth - marginX * 2 - 14);
        doc.text(wrapped, marginX + 12, y);
        y += wrapped.length * 13 + 4;
      });

      y += 12;
    });
  }

  if (resumeData.education?.length) {
    sectionHeading("Education");

    resumeData.education.forEach((edu) => {
      checkPageBreak(30);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...inkColor);
      doc.text(edu.degree || "", marginX, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...grayColor);
      doc.text(edu.year || "", pageWidth - marginX, y, { align: "right" });
      y += 14;

      if (edu.institution) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(...grayColor);
        doc.text(edu.institution, marginX, y);
        y += 18;
      }
    });
  }

  if (resumeData.skills?.length) {
    sectionHeading("Skills");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...inkColor);
    const wrapped = doc.splitTextToSize(resumeData.skills.join("  •  "), pageWidth - marginX * 2);
    doc.text(wrapped, marginX, y);
  }

  const fileName = `${(resumeData.fullName || "resume").replace(/\s+/g, "_")}-Fixed.pdf`;
  doc.save(fileName);
}