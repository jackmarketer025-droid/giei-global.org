import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function generateApplicationPDF(data: any) {
  const doc = new jsPDF();

  // Draw Graduation Cap Icon (Education)
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.setFillColor(240, 247, 255);
  doc.roundedRect(20, 15, 12, 12, 2, 2, 'FD');
  
  // Draw simple graduation cap
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  // Diamond top
  doc.line(22, 21, 26, 18);
  doc.line(26, 18, 30, 21);
  doc.line(30, 21, 26, 24);
  doc.line(26, 24, 22, 21);
  // Cap base
  doc.line(24, 22, 24, 25);
  doc.line(28, 22, 28, 25);
  doc.line(24, 25, 28, 25);
  // Tassel
  doc.line(30, 21, 31, 24);

  // Header
  doc.setTextColor(10, 25, 41); // Dark blue
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Vision-2030", 35, 22);
  
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("GLOBAL IT EXCELLENCE INITIATIVE", 35, 26);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(10, 25, 41);
  doc.text("GIEI, United Kingdom Official Application", 190, 22, { align: 'right' });
  
  // Thin border
  doc.setDrawColor(37, 99, 235); // Blue-600
  doc.setLineWidth(0.1);
  doc.line(20, 32, 190, 32);

  // Tracking ID Highlighted
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(20, 40, 60, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(`ID: ${data.trackingId}`, 25, 48);
  
  // Main Information
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  
  const studentInfo = [
    ["Applicant's Name:", data.fullName],
    ["Mobile Number:", data.phone],
    ["Institution Name:", data.institution],
    ["Class / Year:", data.classYear],
    ["District:", data.district],
    ["Application Fee:", "399/- BDT (Successfully Paid)"]
  ];

  let yPos = 65;
  studentInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value || "N/A", 70, yPos);
    yPos += 10;
  });

  // Bottom Box
  const boxY = 140;
  doc.setDrawColor(37, 99, 235);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, boxY, 170, 35, 3, 3, 'FD');
  
  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235);
  doc.setFont("helvetica", "bold");
  
  const announcement = `Congratulations! Your application to Vision-2030 is successful. Your ID: ${data.trackingId}. The laptop quiz date will be informed via mobile. - GIEI Team`;
  const splitAnnouncement = doc.splitTextToSize(announcement, 160);
  doc.text(splitAnnouncement, 25, boxY + 12);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text("© 2026 Vision-2030 | Managed by Global IT Excellence Initiative (GIEI), UK", 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`Application_Copy_${data.trackingId}.pdf`);
}
