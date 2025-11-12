/**
 * PDF Generation Utility for G1Cure Healthcare Platform
 *
 * Generates professional PDF documents for:
 * - Prescriptions
 * - Medical Reports
 * - Lab Reports
 * - Billing Invoices
 * - Medical Records Summary
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface PrescriptionData {
  prescriptionId: string;
  date: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorLicense: string;
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  notes?: string;
  validUntil?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
}

interface MedicalReportData {
  reportId: string;
  reportType: string;
  date: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientId: string;
  doctorName: string;
  chiefComplaint: string;
  diagnosis: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    oxygenSaturation?: number;
    respiratoryRate?: number;
  };
  symptoms?: string[];
  treatment?: string;
  recommendations?: string;
  followUp?: string;
  notes?: string;
}

interface LabReportData {
  reportId: string;
  testName: string;
  testType: string;
  date: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientId: string;
  doctorName: string;
  results: Array<{
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    status: 'Normal' | 'High' | 'Low';
  }>;
  observations?: string;
  recommendations?: string;
  labName?: string;
  labAddress?: string;
}

interface InvoiceData {
  invoiceId: string;
  invoiceDate: string;
  dueDate: string;
  patientName: string;
  patientId: string;
  patientAddress?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  insuranceCoverage?: number;
  patientResponsibility: number;
  paymentStatus: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  clinicEmail?: string;
}

class PDFGenerator {
  private primaryColor = [41, 98, 255]; // #2962FF
  private secondaryColor = [102, 187, 106]; // #66BB6A
  private textColor = [33, 33, 33];
  private grayColor = [117, 117, 117];

  /**
   * Generate prescription PDF
   */
  generatePrescription(data: PrescriptionData): jsPDF {
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    this.addHeader(doc, yPos, data.clinicName || 'G1Cure Healthcare');
    yPos += 25;

    // Add clinic information
    if (data.clinicAddress || data.clinicPhone) {
      doc.setFontSize(9);
      doc.setTextColor(...this.grayColor);
      if (data.clinicAddress) {
        doc.text(data.clinicAddress, 105, yPos, { align: 'center' });
        yPos += 4;
      }
      if (data.clinicPhone) {
        doc.text(`Phone: ${data.clinicPhone}`, 105, yPos, { align: 'center' });
        yPos += 8;
      }
    }

    // Title
    doc.setFontSize(16);
    doc.setTextColor(...this.primaryColor);
    doc.text('PRESCRIPTION', 105, yPos, { align: 'center' });
    yPos += 10;

    // Prescription Info
    doc.setFontSize(9);
    doc.setTextColor(...this.grayColor);
    doc.text(`Prescription ID: ${data.prescriptionId}`, 20, yPos);
    doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 150, yPos);
    yPos += 8;

    // Patient Information
    this.addSection(doc, yPos, 'Patient Information');
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(...this.textColor);
    doc.text(`Name: ${data.patientName}`, 25, yPos);
    yPos += 6;
    doc.text(`Age: ${data.patientAge} years`, 25, yPos);
    doc.text(`Gender: ${data.patientGender}`, 80, yPos);
    yPos += 10;

    // Doctor Information
    this.addSection(doc, yPos, 'Prescribed By');
    yPos += 8;

    doc.text(`Dr. ${data.doctorName}`, 25, yPos);
    yPos += 6;
    doc.text(`${data.doctorSpecialization}`, 25, yPos);
    yPos += 6;
    doc.text(`License: ${data.doctorLicense}`, 25, yPos);
    yPos += 10;

    // Diagnosis
    this.addSection(doc, yPos, 'Diagnosis');
    yPos += 8;

    doc.text(data.diagnosis, 25, yPos, { maxWidth: 160 });
    yPos += Math.ceil(doc.getTextWidth(data.diagnosis) / 160) * 6 + 8;

    // Medications Table
    this.addSection(doc, yPos, 'Medications');
    yPos += 8;

    const medicationsTableData = data.medications.map((med, index) => [
      index + 1,
      med.name,
      med.dosage,
      med.frequency,
      med.duration,
      med.instructions || '-',
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['#', 'Medicine Name', 'Dosage', 'Frequency', 'Duration', 'Instructions']],
      body: medicationsTableData,
      theme: 'striped',
      headStyles: { fillColor: this.primaryColor, textColor: [255, 255, 255] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 },
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Notes
    if (data.notes) {
      this.addSection(doc, yPos, 'Additional Notes');
      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(...this.textColor);
      doc.text(data.notes, 25, yPos, { maxWidth: 160 });
      yPos += Math.ceil(doc.getTextWidth(data.notes) / 160) * 6 + 8;
    }

    // Valid Until
    if (data.validUntil) {
      doc.setFontSize(9);
      doc.setTextColor(...this.grayColor);
      doc.text(`Valid Until: ${new Date(data.validUntil).toLocaleDateString()}`, 20, yPos);
      yPos += 10;
    }

    // Footer with signature line
    yPos = Math.max(yPos, 250);
    doc.setDrawColor(...this.grayColor);
    doc.line(130, yPos, 190, yPos);
    doc.setFontSize(9);
    doc.text('Doctor Signature', 155, yPos + 5, { align: 'center' });

    // Add footer
    this.addFooter(doc);

    return doc;
  }

  /**
   * Generate medical report PDF
   */
  generateMedicalReport(data: MedicalReportData): jsPDF {
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    this.addHeader(doc, yPos, 'G1Cure Healthcare');
    yPos += 25;

    // Title
    doc.setFontSize(16);
    doc.setTextColor(...this.primaryColor);
    doc.text('MEDICAL REPORT', 105, yPos, { align: 'center' });
    yPos += 10;

    // Report Info
    doc.setFontSize(9);
    doc.setTextColor(...this.grayColor);
    doc.text(`Report ID: ${data.reportId}`, 20, yPos);
    doc.text(`Type: ${data.reportType}`, 100, yPos);
    doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 150, yPos);
    yPos += 8;

    // Patient Information
    this.addSection(doc, yPos, 'Patient Information');
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(...this.textColor);
    doc.text(`Name: ${data.patientName}`, 25, yPos);
    doc.text(`Patient ID: ${data.patientId}`, 120, yPos);
    yPos += 6;
    doc.text(`Age: ${data.patientAge} years`, 25, yPos);
    doc.text(`Gender: ${data.patientGender}`, 80, yPos);
    yPos += 10;

    // Doctor Information
    doc.text(`Examined By: Dr. ${data.doctorName}`, 25, yPos);
    yPos += 10;

    // Chief Complaint
    this.addSection(doc, yPos, 'Chief Complaint');
    yPos += 8;
    doc.text(data.chiefComplaint, 25, yPos, { maxWidth: 160 });
    yPos += Math.ceil(doc.getTextWidth(data.chiefComplaint) / 160) * 6 + 8;

    // Vital Signs
    if (data.vitalSigns && Object.keys(data.vitalSigns).length > 0) {
      this.addSection(doc, yPos, 'Vital Signs');
      yPos += 8;

      const vs = data.vitalSigns;
      if (vs.bloodPressure) {
        doc.text(`Blood Pressure: ${vs.bloodPressure} mmHg`, 25, yPos);
        yPos += 6;
      }
      if (vs.heartRate) {
        doc.text(`Heart Rate: ${vs.heartRate} bpm`, 25, yPos);
        doc.text(`Temperature: ${vs.temperature || 'N/A'}°C`, 80, yPos);
        yPos += 6;
      }
      if (vs.oxygenSaturation) {
        doc.text(`SpO2: ${vs.oxygenSaturation}%`, 25, yPos);
        doc.text(`Respiratory Rate: ${vs.respiratoryRate || 'N/A'} breaths/min`, 80, yPos);
        yPos += 6;
      }
      if (vs.weight || vs.height) {
        doc.text(`Weight: ${vs.weight || 'N/A'} kg`, 25, yPos);
        doc.text(`Height: ${vs.height || 'N/A'} cm`, 80, yPos);
        yPos += 6;
      }
      yPos += 4;
    }

    // Symptoms
    if (data.symptoms && data.symptoms.length > 0) {
      this.addSection(doc, yPos, 'Symptoms');
      yPos += 8;
      data.symptoms.forEach((symptom) => {
        doc.text(`• ${symptom}`, 25, yPos);
        yPos += 5;
      });
      yPos += 3;
    }

    // Diagnosis
    this.addSection(doc, yPos, 'Diagnosis');
    yPos += 8;
    doc.text(data.diagnosis, 25, yPos, { maxWidth: 160 });
    yPos += Math.ceil(doc.getTextWidth(data.diagnosis) / 160) * 6 + 8;

    // Treatment
    if (data.treatment) {
      this.addSection(doc, yPos, 'Treatment');
      yPos += 8;
      doc.text(data.treatment, 25, yPos, { maxWidth: 160 });
      yPos += Math.ceil(doc.getTextWidth(data.treatment) / 160) * 6 + 8;
    }

    // Recommendations
    if (data.recommendations) {
      this.addSection(doc, yPos, 'Recommendations');
      yPos += 8;
      doc.text(data.recommendations, 25, yPos, { maxWidth: 160 });
      yPos += Math.ceil(doc.getTextWidth(data.recommendations) / 160) * 6 + 8;
    }

    // Follow-up
    if (data.followUp) {
      doc.setFontSize(9);
      doc.setTextColor(...this.grayColor);
      doc.text(`Follow-up: ${data.followUp}`, 20, yPos);
    }

    // Footer
    this.addFooter(doc);

    return doc;
  }

  /**
   * Generate lab report PDF
   */
  generateLabReport(data: LabReportData): jsPDF {
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    this.addHeader(doc, yPos, data.labName || 'G1Cure Laboratory');
    yPos += 25;

    if (data.labAddress) {
      doc.setFontSize(9);
      doc.setTextColor(...this.grayColor);
      doc.text(data.labAddress, 105, yPos, { align: 'center' });
      yPos += 8;
    }

    // Title
    doc.setFontSize(16);
    doc.setTextColor(...this.primaryColor);
    doc.text('LABORATORY REPORT', 105, yPos, { align: 'center' });
    yPos += 10;

    // Report Info
    doc.setFontSize(9);
    doc.setTextColor(...this.grayColor);
    doc.text(`Report ID: ${data.reportId}`, 20, yPos);
    doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 150, yPos);
    yPos += 4;
    doc.text(`Test: ${data.testName} (${data.testType})`, 20, yPos);
    yPos += 10;

    // Patient Information
    this.addSection(doc, yPos, 'Patient Information');
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(...this.textColor);
    doc.text(`Name: ${data.patientName}`, 25, yPos);
    doc.text(`Patient ID: ${data.patientId}`, 120, yPos);
    yPos += 6;
    doc.text(`Age: ${data.patientAge} years`, 25, yPos);
    doc.text(`Gender: ${data.patientGender}`, 80, yPos);
    yPos += 6;
    doc.text(`Referred By: Dr. ${data.doctorName}`, 25, yPos);
    yPos += 12;

    // Test Results Table
    this.addSection(doc, yPos, 'Test Results');
    yPos += 8;

    const resultsTableData = data.results.map((result) => [
      result.parameter,
      result.value,
      result.unit,
      result.normalRange,
      result.status,
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Parameter', 'Value', 'Unit', 'Normal Range', 'Status']],
      body: resultsTableData,
      theme: 'striped',
      headStyles: { fillColor: this.primaryColor, textColor: [255, 255, 255] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 },
      bodyStyles: {
        fillColor: (rowIndex: number) => {
          const status = data.results[rowIndex].status;
          if (status === 'High' || status === 'Low') {
            return [255, 243, 224]; // Light orange for abnormal
          }
          return undefined;
        },
      },
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Observations
    if (data.observations) {
      this.addSection(doc, yPos, 'Observations');
      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(...this.textColor);
      doc.text(data.observations, 25, yPos, { maxWidth: 160 });
      yPos += Math.ceil(doc.getTextWidth(data.observations) / 160) * 6 + 8;
    }

    // Recommendations
    if (data.recommendations) {
      this.addSection(doc, yPos, 'Recommendations');
      yPos += 8;
      doc.text(data.recommendations, 25, yPos, { maxWidth: 160 });
    }

    // Footer
    this.addFooter(doc);

    return doc;
  }

  /**
   * Generate invoice PDF
   */
  generateInvoice(data: InvoiceData): jsPDF {
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    this.addHeader(doc, yPos, data.clinicName || 'G1Cure Healthcare');
    yPos += 25;

    if (data.clinicAddress || data.clinicPhone) {
      doc.setFontSize(9);
      doc.setTextColor(...this.grayColor);
      if (data.clinicAddress) {
        doc.text(data.clinicAddress, 105, yPos, { align: 'center' });
        yPos += 4;
      }
      if (data.clinicPhone) {
        doc.text(`Phone: ${data.clinicPhone} | Email: ${data.clinicEmail || 'N/A'}`, 105, yPos, {
          align: 'center',
        });
        yPos += 8;
      }
    }

    // Title
    doc.setFontSize(18);
    doc.setTextColor(...this.primaryColor);
    doc.text('INVOICE', 105, yPos, { align: 'center' });
    yPos += 12;

    // Invoice Details
    doc.setFontSize(10);
    doc.setTextColor(...this.textColor);
    doc.text(`Invoice #: ${data.invoiceId}`, 20, yPos);
    doc.text(`Status: ${data.paymentStatus}`, 150, yPos);
    yPos += 6;
    doc.text(`Invoice Date: ${new Date(data.invoiceDate).toLocaleDateString()}`, 20, yPos);
    doc.text(`Due Date: ${new Date(data.dueDate).toLocaleDateString()}`, 150, yPos);
    yPos += 12;

    // Patient Information
    doc.setFontSize(11);
    doc.setTextColor(...this.textColor);
    doc.text('Bill To:', 20, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.text(data.patientName, 20, yPos);
    yPos += 5;
    doc.text(`Patient ID: ${data.patientId}`, 20, yPos);
    yPos += 5;
    if (data.patientAddress) {
      doc.text(data.patientAddress, 20, yPos, { maxWidth: 80 });
      yPos += 8;
    }
    yPos += 8;

    // Items Table
    const itemsTableData = data.items.map((item) => [
      item.description,
      item.quantity,
      `$${item.unitPrice.toFixed(2)}`,
      `$${item.total.toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Description', 'Quantity', 'Unit Price', 'Total']],
      body: itemsTableData,
      theme: 'striped',
      headStyles: { fillColor: this.primaryColor, textColor: [255, 255, 255] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 10 },
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Summary
    const summaryX = 120;
    doc.setFontSize(10);
    doc.text('Subtotal:', summaryX, yPos);
    doc.text(`$${data.subtotal.toFixed(2)}`, 190, yPos, { align: 'right' });
    yPos += 6;

    if (data.tax) {
      doc.text(`Tax:`, summaryX, yPos);
      doc.text(`$${data.tax.toFixed(2)}`, 190, yPos, { align: 'right' });
      yPos += 6;
    }

    if (data.discount) {
      doc.text(`Discount:`, summaryX, yPos);
      doc.text(`-$${data.discount.toFixed(2)}`, 190, yPos, { align: 'right' });
      yPos += 6;
    }

    if (data.insuranceCoverage) {
      doc.text(`Insurance Coverage:`, summaryX, yPos);
      doc.text(`-$${data.insuranceCoverage.toFixed(2)}`, 190, yPos, { align: 'right' });
      yPos += 6;
    }

    // Total
    doc.setDrawColor(...this.primaryColor);
    doc.setLineWidth(0.5);
    doc.line(summaryX, yPos, 190, yPos);
    yPos += 5;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', summaryX, yPos);
    doc.text(`$${data.total.toFixed(2)}`, 190, yPos, { align: 'right' });
    yPos += 8;

    if (data.insuranceCoverage) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...this.secondaryColor);
      doc.text('Patient Responsibility:', summaryX, yPos);
      doc.text(`$${data.patientResponsibility.toFixed(2)}`, 190, yPos, { align: 'right' });
    }

    // Footer
    this.addFooter(doc);

    return doc;
  }

  /**
   * Helper: Add section header
   */
  private addSection(doc: jsPDF, yPos: number, title: string) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.primaryColor);
    doc.text(title, 20, yPos);
    doc.setLineWidth(0.3);
    doc.setDrawColor(...this.primaryColor);
    doc.line(20, yPos + 1, 190, yPos + 1);
    doc.setFont('helvetica', 'normal');
  }

  /**
   * Helper: Add document header
   */
  private addHeader(doc: jsPDF, yPos: number, title: string) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.primaryColor);
    doc.text(title, 105, yPos, { align: 'center' });
  }

  /**
   * Helper: Add document footer
   */
  private addFooter(doc: jsPDF) {
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(...this.grayColor);

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Generated by G1Cure Healthcare Platform | ${new Date().toLocaleDateString()}`,
        105,
        285,
        { align: 'center' }
      );
      doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
    }
  }
}

// Export singleton instance
export const pdfGenerator = new PDFGenerator();

// Export types
export type {
  PrescriptionData,
  MedicalReportData,
  LabReportData,
  InvoiceData,
};
