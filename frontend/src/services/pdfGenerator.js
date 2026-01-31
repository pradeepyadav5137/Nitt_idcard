
import { jsPDF } from 'jspdf';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  } catch {
    return dateString;
  }
};

export const generateStudentPDF = (data) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;

  // Outer Border
  doc.rect(margin, margin, contentWidth, 277);

  // Header Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('NATIONAL INSTITUTE OF TECHNOLOGY TIRUCHIRAPPALLI', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('TAMIL NADU, INDIA-620015', pageWidth / 2, 26, { align: 'center' });

  doc.setFontSize(13);
  doc.text('STUDENT APPLICATION FOR DUPLICATE IDENTITY CARD', pageWidth / 2, 36, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text('(to be filled by the student)', pageWidth / 2, 42, { align: 'center' });

  // Main Info Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);

  let y = 47;
  const rowHeight = 10;

  // Row 1: Name, Roll No, Branch
  doc.rect(margin, y, contentWidth, rowHeight * 2);
  doc.line(margin + 50, y, margin + 50, y + rowHeight * 2); // Name end
  doc.line(margin + 110, y, margin + 110, y + rowHeight * 2); // Roll No end
  doc.line(margin + 110 + 30, y, margin + 110 + 30, y + rowHeight * 2); // Branch label end

  doc.text('Name of the', margin + 5, y + 7);
  doc.text('Student', margin + 5, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.text(data.name || '', margin + 55, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('Roll No.', margin + 112, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.rollNo || '', margin + 145, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('Branch', margin + 175, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.branch || '', margin + 175, y + 17, { maxWidth: 20 });

  y += rowHeight * 2;

  // Row 2: Parent's Name, Blood Group, D.O.B
  doc.rect(margin, y, contentWidth, rowHeight);
  doc.line(margin + 50, y, margin + 50, y + rowHeight);
  doc.line(margin + 110, y, margin + 110, y + rowHeight);
  doc.line(margin + 140, y, margin + 140, y + rowHeight);
  doc.line(margin + 170, y, margin + 170, y + rowHeight);

  doc.setFont('helvetica', 'bold');
  doc.text("Parent's Name", margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(data.fatherName || '', margin + 55, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('Blood', margin + 112, y + 4);
  doc.text('Group', margin + 112, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.bloodGroup || '', margin + 145, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('D.O.B', margin + 172, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(data.dob), margin + 185, y + 7);

  y += rowHeight;

  // Row 3: Contact No, Email ID
  doc.rect(margin, y, contentWidth, rowHeight);
  doc.line(margin + 50, y, margin + 50, y + rowHeight);
  doc.line(margin + 110, y, margin + 110, y + rowHeight);
  doc.line(margin + 130, y, margin + 130, y + rowHeight);

  doc.setFont('helvetica', 'bold');
  doc.text('Contact No.', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(data.phone || '', margin + 55, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('Email ID', margin + 112, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(data.email || '', margin + 135, y + 7);

  y += rowHeight;

  // Row 4: Address
  doc.rect(margin, y, contentWidth, rowHeight * 3);
  doc.line(margin + 50, y, margin + 50, y + rowHeight * 3);
  doc.setFont('helvetica', 'bold');
  doc.text('Address', margin + 20, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(data.address || data.permanentAddress || '', margin + 55, y + 7, { maxWidth: contentWidth - 60 });

  y += rowHeight * 3;

  // Section 2: Details of loss/damage
  doc.setFont('helvetica', 'bold');
  doc.rect(margin, y, contentWidth, rowHeight);
  doc.text('Where the ID has been lost (please tick mark)', margin + 2, y + 7);
  doc.line(margin + 90, y, margin + 90, y + rowHeight);
  doc.text('Within the Campus', margin + 95, y + 7);
  doc.line(margin + 150, y, margin + 150, y + rowHeight);
  doc.text('During Travelling', margin + 155, y + 7);
  y += rowHeight;

  doc.rect(margin, y, contentWidth, rowHeight);
  doc.text('Damaged (If so, please return the damaged one)', margin + 2, y + 4, { maxWidth: 85 });
  doc.line(margin + 90, y, margin + 90, y + rowHeight);
  doc.text('At home', margin + 95, y + 7);
  doc.line(margin + 150, y, margin + 150, y + rowHeight);
  doc.text('Any other: Pl. specify:', margin + 155, y + 5);
  y += rowHeight;

  doc.rect(margin, y, contentWidth, rowHeight);
  doc.text('Have you ever lost the Identity Card before', margin + 2, y + 4, { maxWidth: 85 });
  doc.line(margin + 90, y, margin + 90, y + rowHeight);
  doc.text('If so When (Month/year)', margin + 95, y + 7);
  y += rowHeight;

  doc.rect(margin, y, contentWidth, rowHeight);
  doc.line(margin + 90, y, margin + 90, y + rowHeight);
  doc.text('How many times you have been issued duplicate ID Cards', margin + 95, y + 4, { maxWidth: 90 });
  y += rowHeight;

  doc.rect(margin, y, contentWidth, rowHeight);
  doc.text('Number of books issued to you with your ID Card', margin + 2, y + 4, { maxWidth: 85 });
  doc.line(margin + 90, y, margin + 90, y + rowHeight);
  y += rowHeight;

  doc.rect(margin, y, contentWidth, rowHeight * 2);
  doc.text('Fee for Duplicate ID Card Rs. 500/- (copy of receipt should be attached)', margin + 2, y + 4, { maxWidth: 85 });
  doc.line(margin + 90, y, margin + 90, y + rowHeight * 2);
  doc.text('Receipt No.', margin + 92, y + rowHeight + 7);
  doc.line(margin + 125, y + rowHeight, margin + 125, y + rowHeight * 2);
  doc.text('Amount (Rs.)', margin + 127, y + rowHeight + 7);
  doc.line(margin + 165, y + rowHeight, margin + 165, y + rowHeight * 2);
  doc.text('Date', margin + 167, y + rowHeight + 7);
  doc.line(margin + 90, y + rowHeight, margin + contentWidth + margin, y + rowHeight);
  y += rowHeight * 2;

  // Declaration
  doc.setFontSize(11);
  doc.text('DECLARATION', pageWidth / 2, y + 10, { align: 'center' });
  y += 15;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  const declaration = "I hereby declare that the information given by me is correct. I am also aware that the Identity Card declared to have lost by me has been irrecoverably lost and in case anyone makes wrong use of the same and or any claim based on the usage of this Identity Card, I am fully responsible for the same. I will be liable for all the future losses/damages/consequences that may incur to the Institute, which shall be made good by me without making any counter claim. In the event, if it is traced, old ID will be surrendered immediately to the Institute.";
  doc.text(declaration, margin + 5, y, { maxWidth: contentWidth - 10, align: 'justify' });

  y += 25;
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, margin + 5, y);
  doc.text(`Name: ${data.name || ''}`, margin + 40, y);
  doc.text(`Roll No: ${data.rollNo || ''}`, margin + 100, y);
  doc.text('Signature', margin + 160, y);

  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('(Office Use – Department/Section Level)', pageWidth / 2, y, { align: 'center' });

  y += 5;
  doc.rect(margin, y, contentWidth, 40);
  doc.line(margin + 100, y, margin + 100, y + 40);
  doc.line(margin, y + 20, margin + contentWidth, y + 20);

  doc.text('Clearance from Head of the Department for issuing Duplicate ID', margin + 2, y + 7, { maxWidth: 90 });
  doc.text('Library Clearance after making necessary changes in the database', margin + 2, y + 27, { maxWidth: 90 });

  doc.save(`NITT_Duplicate_ID_${data.rollNo || 'application'}.pdf`);
};

export const generateFacultyStaffPDF = (data) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;

  // Outer Border
  doc.rect(margin, margin, contentWidth, 277);

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
    doc.text(label, x + 2, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || ''), x + labelWidth + 2, y + 5);
  };

  drawField('Name of the Staff', data.staffName || data.name, margin, y, contentWidth - 50, 45);
  y += rowHeight;

  // Staff No, Designation
  doc.rect(margin, y, contentWidth - 50, rowHeight);
  doc.line(margin + 45, y, margin + 45, y + rowHeight);
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

  // Photo Box (to the right of previous fields)
  doc.rect(margin + contentWidth - 50, 53, 50, y - 53);
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

  doc.text('Payment Details', margin + 2, y + 5);
  doc.text('(For Category B Only Rs. 500)', margin + 2, y + 9);
  doc.text('*Attach the Payment Recipt', margin + 2, y + 13);

  doc.text('Challan No.', margin + 37, y + rowHeight);
  doc.text('Date:', margin + 142, y + rowHeight);
  y += rowHeight * 2;

  // Data boxes
  drawField('Data Available in the ID Card', '', margin, y, contentWidth, 45);
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
  doc.text('I hereby declare that the above particulars of facts and information stated are true, correct and complete', pageWidth / 2, y, { align: 'center' });
  doc.text('to the best of my belief and knowledge.', pageWidth / 2, y + 5, { align: 'center' });
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Staff Signature', contentWidth - 10, y, { align: 'right' });

  // Competent Authority
  y += 5;
  doc.rect(margin, y, contentWidth, 40);
  doc.line(margin, y + 10, margin + contentWidth, y + 10);
  doc.line(margin + 120, y, margin + 120, y + 10);
  doc.text('Signature of the HoD with Office Seal', margin + 2, y + 7);
  doc.text('Certified by Supdt. Estt.', margin + 122, y + 7);

  doc.text('Competent Authority', pageWidth / 2, y + 18, { align: 'center' });
  doc.text('Registrar', pageWidth / 2, y + 38, { align: 'center' });

  y += 40;
  doc.rect(margin, y, contentWidth, 30);
  doc.setFontSize(10);
  doc.text('Office use Only:', margin + 2, y + 5);
  doc.text('Application Number: ________________________ Date: ___________________', margin + 2, y + 15);
  doc.text('Signature of the ID card Distributor: ___________________________________', margin + 2, y + 25);

  y += 35;
  doc.setFontSize(8);
  doc.text('*Note: Applicant should come in person to submit application form and to collect new card after handing over old card.', margin + 2, y);

  doc.save(`NITT_Staff_ID_${data.staffNo || 'application'}.pdf`);
};
