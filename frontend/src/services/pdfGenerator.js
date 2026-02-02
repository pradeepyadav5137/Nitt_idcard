
import { jsPDF } from 'jspdf';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

export const generateStudentPDF = (data) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;

  // Outer Border
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, contentWidth, pageHeight - 2 * margin);

  // Logo (Top Left)
  try {
    // Attempt to add logo if available
    doc.addImage('/assets/logo.png', 'PNG', margin + 2, margin + 2, 22, 22);
  } catch (e) {
    console.log('Logo not found, skipping image');
  }

  // Header Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('TAMIL NADU, INDIA-620015', pageWidth / 2, 26, { align: 'center' });

  doc.setFontSize(14);
  doc.text('STUDENT APPLICATION FOR DUPLICATE IDENTITY CARD', pageWidth / 2, 36, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('(to be filled by the student)', pageWidth / 2, 42, { align: 'center' });

  let y = 47;
  doc.setLineWidth(0.2);

  // Helper for drawing cells
  const drawCell = (x, y, w, h, text, isLabel = false, fontSize = 9) => {
    doc.rect(x, y, w, h);
    if (text) {
      doc.setFont('helvetica', isLabel ? 'bold' : 'normal');
      doc.setFontSize(fontSize);
      const splitText = doc.splitTextToSize(String(text), w - 4);
      doc.text(splitText, x + 2, y + (h / 2) - ((splitText.length - 1) * 2) + 1);
    }
  };

  // Personal Info Table
  // Row 1: Name, Roll No, Branch
  drawCell(margin, y, 35, 14, 'Name of the\nStudent', true);
  drawCell(margin + 35, y, 75, 14, (data.name || '').toUpperCase());
  drawCell(margin + 110, y, 20, 14, 'Roll No.', true);
  drawCell(margin + 130, y, 30, 14, data.rollNo || '');
  drawCell(margin + 160, y, 30, 14, `Branch\n${data.branch || ''}`, true);
  y += 14;

  // Row 2: Parent, Blood Group, DOB
  drawCell(margin, y, 35, 10, "Parent's Name", true);
  drawCell(margin + 35, y, 75, 10, data.fatherName || '');
  drawCell(margin + 110, y, 20, 10, 'Blood\nGroup', true, 8);
  drawCell(margin + 130, y, 25, 10, data.bloodGroup || '');
  drawCell(margin + 155, y, 15, 10, 'D.O.B', true);
  drawCell(margin + 170, y, 20, 10, formatDate(data.dob));
  y += 10;

  // Row 3: Contact No, Email
  drawCell(margin, y, 35, 10, 'Contact No.', true);
  drawCell(margin + 35, y, 75, 10, data.phone || '');
  drawCell(margin + 110, y, 25, 10, 'Email ID', true);
  drawCell(margin + 135, y, 55, 10, data.email || '');
  y += 10;

  // Row 4: Address
  drawCell(margin, y, 35, 25, 'Address', true);
  drawCell(margin + 35, y, 155, 25, data.permanentAddress || '');
  y += 25;

  // Details of loss Table
  drawCell(margin, y, 85, 10, 'Where the ID has been lost (please tick mark)', true, 8);
  drawCell(margin + 85, y, 55, 10, 'Within the Campus', true);
  drawCell(margin + 140, y, 50, 10, 'During Travelling', true);
  y += 10;

  drawCell(margin, y, 85, 10, 'Damaged (If so, please return the damaged one)', true, 8);
  drawCell(margin + 85, y, 55, 10, 'At home', true);
  drawCell(margin + 140, y, 50, 10, 'Any other: Pl. specify:', true, 8);
  y += 10;

  drawCell(margin, y, 85, 10, 'Have you ever lost the Identity Card before', true, 8);
  drawCell(margin + 85, y, 105, 10, 'If so When (Month/year)', true);
  y += 10;

  drawCell(margin, y, 85, 10, '', false);
  drawCell(margin + 85, y, 105, 10, 'How many times you have been issued duplicate ID Cards', true, 8);
  y += 10;

  drawCell(margin, y, 85, 10, 'Number of books issued to you with your ID Card', true, 8);
  drawCell(margin + 85, y, 105, 10, '', false);
  y += 10;

  drawCell(margin, y, 85, 20, 'Fee for Duplicate ID Card Rs. 500/- (copy of receipt should be attached)', true, 8);
  drawCell(margin + 85, y, 35, 10, 'Receipt No.', true);
  drawCell(margin + 120, y, 40, 10, 'Amount (Rs.)', true);
  drawCell(margin + 160, y, 30, 10, 'Date', true);
  y += 10;
  drawCell(margin + 85, y, 35, 10, '', false);
  drawCell(margin + 120, y, 40, 10, '', false);
  drawCell(margin + 160, y, 30, 10, '', false);
  y += 10;

  // Declaration
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DECLARATION', pageWidth / 2, y + 5, { align: 'center' });
  y += 12;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  const declaration = "I hereby declare that the information given by me is correct. I am also aware that the Identity Card declared to have lost by me has been irrecoverably lost and in case anyone makes wrong use of the same and or any claim based on the usage of this Identity Card, I am fully responsible for the same. I will be liable for all the future losses/damages/consequences that may incur to the Institute, which shall be made good by me without making any counter claim. In the event, if it is traced, old ID will be surrendered immediately to the Institute.";
  const splitDeclaration = doc.splitTextToSize(declaration, contentWidth - 10);
  doc.text(splitDeclaration, margin + 5, y, { align: 'justify' });

  y += 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Date: ${formatDate(new Date())}`, margin + 5, y);
  doc.text(`Name: ${(data.name || '').toUpperCase()}`, margin + 40, y);
  doc.text(`Roll No: ${data.rollNo || ''}`, margin + 110, y);
  doc.text('Signature', margin + 165, y);

  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('(Office Use – Department/Section Level)', pageWidth / 2, y, { align: 'center' });

  y += 5;
  drawCell(margin, y, 100, 18, 'Clearance from Head of the Department for issuing\nDuplicate ID', true, 9);
  drawCell(margin + 100, y, contentWidth - 100, 18, '', false);
  y += 18;
  drawCell(margin, y, 100, 18, 'Library Clearance after making necessary changes in the\ndatabase', true, 9);
  drawCell(margin + 100, y, contentWidth - 100, 18, '', false);

  return doc;
};

export const generateFacultyStaffPDF = (data) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;

  // Outer Border
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, contentWidth, pageHeight - 2 * margin);

  // Logo (Top Left)
  try {
    doc.addImage('/assets/logo.png', 'PNG', margin + 2, margin + 2, 22, 22);
  } catch (e) {
    console.log('Logo not found, skipping image');
  }

  // Header Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('TAMIL NADU, INDIA-620015', pageWidth / 2, 26, { align: 'center' });

  doc.setFontSize(13);
  doc.text('STAFF APPLICATION FOR DUPLICATE IDENTITY CARD', pageWidth / 2, 36, { align: 'center' });

  doc.setFontSize(10);
  doc.text('(DESIGNATION/OTHER OFFICIAL CHANGES)', pageWidth / 2, 42, { align: 'center' });
  doc.setFont('helvetica', 'italic');
  doc.text('(to be filled by the staff)', pageWidth / 2, 48, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);

  let y = 53;
  const rowHeight = 8;

  // Fields
  const drawField = (label, value, x, y, width, labelWidth) => {
    doc.rect(x, y, width, rowHeight);
    doc.line(x + labelWidth, y, x + labelWidth, y + rowHeight);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, x + 2, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || ''), x + labelWidth + 2, y + 5);
  };

  drawField('Name of the Staff', data.staffName || data.name, margin, y, contentWidth - 50, 45);
  y += rowHeight;

  // Staff No, Designation
  doc.rect(margin, y, contentWidth - 50, rowHeight);
  doc.line(margin + 45, y, margin + 45, y + rowHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('Staff No.', margin + 2, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.staffNo || '', margin + 47, y + 5);
  doc.line(margin + 90, y, margin + 90, y + rowHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('Designation', margin + 92, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.designation || '', margin + 122, y + 5);
  y += rowHeight;

  // Title, Gender, Blood Group
  doc.rect(margin, y, contentWidth - 50, rowHeight);
  doc.line(margin + 45, y, margin + 45, y + rowHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('Title: Prof. / Dr./', margin + 2, y + 4);
  doc.text('Mr. / Ms. / Mrs.', margin + 2, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(data.title || '', margin + 47, y + 5);
  doc.line(margin + 90, y, margin + 90, y + rowHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('Gender: M/F', margin + 92, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.gender || '', margin + 115, y + 5);
  doc.line(margin + 125, y, margin + 125, y + rowHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('Blood Group', margin + 127, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(data.bloodGroup || '', margin + 127, y + 7);
  y += rowHeight;

  // Dept / Section, D.O.B
  doc.rect(margin, y, contentWidth - 50, rowHeight);
  doc.line(margin + 45, y, margin + 45, y + rowHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('Dept./ Section', margin + 2, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.department || '', margin + 47, y + 5);
  doc.line(margin + 125, y, margin + 125, y + rowHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('D.O.B', margin + 127, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(data.dob), margin + 140, y + 5);
  y += rowHeight;

  // Date of Joining, Date of Retirement
  doc.rect(margin, y, contentWidth - 50, rowHeight);
  doc.line(margin + 45, y, margin + 45, y + rowHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Joining', margin + 2, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(data.joiningDate), margin + 47, y + 5);
  doc.line(margin + 90, y, margin + 90, y + rowHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Retirement', margin + 92, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(data.retirementDate), margin + 127, y + 5);
  y += rowHeight;

  // Contact No
  drawField('Contact No.', data.phone, margin, y, contentWidth - 50, 45);
  y += rowHeight;

  // Email ID
  drawField('Email ID', data.email, margin, y, contentWidth - 50, 45);
  y += rowHeight;

  // Photo Box
  doc.rect(margin + contentWidth - 50, 53, 50, y - 53);
  doc.setFontSize(8);
  doc.text('Recent Passport Size', margin + contentWidth - 45, 65);
  doc.text('Photo', margin + contentWidth - 30, 70);

  // Address
  doc.rect(margin, y, contentWidth, rowHeight * 3);
  doc.line(margin + 45, y, margin + 45, y + rowHeight * 3);
  doc.setFont('helvetica', 'bold');
  doc.text('Address', margin + 15, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.address || '', margin + 47, y + 5, { maxWidth: contentWidth - 50 });
  y += rowHeight * 3;

  // Request Category
  doc.rect(margin, y, contentWidth, rowHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('Request Category', pageWidth / 2, y + 5, { align: 'center' });
  y += rowHeight;

  doc.rect(margin, y, contentWidth, rowHeight);
  doc.rect(margin + 2, y + 2, 4, 4);
  doc.setFontSize(8);
  doc.text('A – New Appointment/Transfer/Promotion/Redesignation (From __________ To ___________ )', margin + 8, y + 5);
  y += rowHeight;

  doc.rect(margin, y, contentWidth, rowHeight * 2);
  doc.rect(margin + 2, y + 2, 4, 4);
  doc.text('B – Lost Card/Damaged/Correction – Corrections to be made (If any) Photo Change//Mobile No./', margin + 8, y + 5);
  doc.text('/Address', margin + 8, y + 10);
  y += rowHeight * 2;

  // Payment Details
  doc.rect(margin, y, contentWidth, rowHeight * 2);
  doc.line(margin + 35, y, margin + 35, y + rowHeight * 2);
  doc.line(margin + 75, y, margin + 75, y + rowHeight * 2);
  doc.line(margin + 140, y, margin + 140, y + rowHeight * 2);
  doc.line(margin + 75, y + rowHeight, contentWidth + margin, y + rowHeight);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Details', margin + 2, y + 5);
  doc.setFontSize(7);
  doc.text('(For Category B Only Rs. 500)', margin + 2, y + 9);
  doc.text('*Attach the Payment Receipt', margin + 2, y + 13);

  doc.setFontSize(9);
  doc.text('Challan No.', margin + 37, y + rowHeight + 5);
  doc.text('Date:', margin + 142, y + rowHeight + 5);
  y += rowHeight * 2;

  // Data boxes
  drawField('Data Available in ID Card', '', margin, y, contentWidth, 45);
  y += rowHeight;
  drawField('Data to be Changed', data.dataToChange?.join(', ') || '', margin, y, contentWidth, 45);
  y += rowHeight;
  drawField('Office Order No. Details', '', margin, y, contentWidth, 45);
  y += rowHeight;

  // Declaration
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('DECLARATION', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.text('I hereby declare that the above particulars of facts and information stated are true, correct and complete', pageWidth / 2, y, { align: 'center' });
  doc.text('to the best of my belief and knowledge.', pageWidth / 2, y + 5, { align: 'center' });
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Staff Signature', contentWidth - 5, y, { align: 'right' });

  // Competent Authority
  y += 5;
  doc.rect(margin, y, contentWidth, 35);
  doc.line(margin, y + 10, margin + contentWidth, y + 10);
  doc.line(margin + 120, y, margin + 120, y + 10);
  doc.setFontSize(9);
  doc.text('Signature of the HoD with Office Seal', margin + 2, y + 7);
  doc.text('Certified by Supdt. Estt.', margin + 122, y + 7);

  doc.text('Competent Authority', pageWidth / 2, y + 18, { align: 'center' });
  doc.text('Registrar', pageWidth / 2, y + 33, { align: 'center' });

  y += 35;
  doc.rect(margin, y, contentWidth, 25);
  doc.setFontSize(9);
  doc.text('Office use Only:', margin + 2, y + 5);
  doc.text('Application Number: ________________________ Date: ___________________', margin + 2, y + 13);
  doc.text('Signature of the ID card Distributor: ___________________________________', margin + 2, y + 21);

  y += 30;
  doc.setFontSize(8);
  doc.text('*Note: Applicant should come in person to submit application form and to collect new card after handing over old card.', margin + 2, y);

  return doc;
};
