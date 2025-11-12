/**
 * PDF Printer - Browser-native PDF generation without external libraries
 *
 * Uses window.print() with styled HTML templates for PDF generation
 * Works in all modern browsers without dependencies
 */

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
  vitalSigns?: Record<string, any>;
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

class PDFPrinter {
  private commonStyles = `
    <style>
      @media print {
        @page {
          margin: 2cm;
          size: A4;
        }
        body {
          margin: 0;
          padding: 0;
        }
      }
      * {
        box-sizing: border-box;
      }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #212121;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 3px solid #2962FF;
      }
      .header h1 {
        color: #2962FF;
        font-size: 28px;
        margin: 0 0 10px 0;
      }
      .header p {
        color: #757575;
        margin: 5px 0;
        font-size: 14px;
      }
      .document-title {
        text-align: center;
        color: #2962FF;
        font-size: 22px;
        font-weight: bold;
        margin: 20px 0;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        margin: 8px 0;
        font-size: 14px;
      }
      .info-label {
        color: #757575;
        font-weight: 600;
      }
      .section {
        margin: 25px 0;
      }
      .section-title {
        color: #2962FF;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 12px;
        padding-bottom: 5px;
        border-bottom: 2px solid #2962FF;
      }
      .section-content {
        padding: 10px 15px;
        background: #f5f5f5;
        border-radius: 8px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        font-size: 14px;
      }
      thead {
        background: #2962FF;
        color: white;
      }
      th, td {
        padding: 12px;
        text-align: left;
        border: 1px solid #e0e0e0;
      }
      tbody tr:nth-child(even) {
        background: #f9f9f9;
      }
      tbody tr:hover {
        background: #f0f0f0;
      }
      .abnormal {
        background: #fff3e0 !important;
      }
      .footer {
        margin-top: 50px;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
        text-align: center;
        color: #757575;
        font-size: 12px;
      }
      .signature-line {
        margin-top: 60px;
        text-align: right;
      }
      .signature-line hr {
        width: 200px;
        float: right;
        border: none;
        border-top: 2px solid #424242;
      }
      .signature-text {
        clear: both;
        padding-top: 5px;
        font-size: 14px;
        color: #757575;
      }
      .summary-table {
        width: 50%;
        margin-left: auto;
        margin-top: 20px;
      }
      .summary-table td {
        border: none;
        padding: 8px;
      }
      .summary-total {
        font-weight: bold;
        font-size: 16px;
        border-top: 2px solid #2962FF !important;
      }
      .list-item {
        margin: 5px 0;
        padding-left: 20px;
      }
      .list-item::before {
        content: "• ";
        color: #2962FF;
        font-weight: bold;
      }
      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }
      .card {
        padding: 15px;
        background: #f5f5f5;
        border-radius: 8px;
        border-left: 4px solid #66BB6A;
      }
      .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
      }
      .badge-success {
        background: #c8e6c9;
        color: #2e7d32;
      }
      .badge-warning {
        background: #fff3e0;
        color: #f57c00;
      }
      .badge-danger {
        background: #ffcdd2;
        color: #c62828;
      }
    </style>
  `;

  /**
   * Print prescription
   */
  printPrescription(data: PrescriptionData): void {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Prescription - ${data.prescriptionId}</title>
        ${this.commonStyles}
      </head>
      <body>
        <div class="header">
          <h1>${data.clinicName || 'G1Cure Healthcare'}</h1>
          ${data.clinicAddress ? `<p>${data.clinicAddress}</p>` : ''}
          ${data.clinicPhone ? `<p>Phone: ${data.clinicPhone}</p>` : ''}
        </div>

        <div class="document-title">PRESCRIPTION</div>

        <div class="info-row">
          <span><span class="info-label">Prescription ID:</span> ${data.prescriptionId}</span>
          <span><span class="info-label">Date:</span> ${new Date(data.date).toLocaleDateString()}</span>
        </div>

        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="section-content">
            <div class="info-row">
              <span><span class="info-label">Name:</span> ${data.patientName}</span>
              <span><span class="info-label">Age:</span> ${data.patientAge} years</span>
              <span><span class="info-label">Gender:</span> ${data.patientGender}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Prescribed By</div>
          <div class="section-content">
            <p><strong>Dr. ${data.doctorName}</strong></p>
            <p>${data.doctorSpecialization}</p>
            <p>License: ${data.doctorLicense}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Diagnosis</div>
          <div class="section-content">
            <p>${data.diagnosis}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Medications</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${data.medications.map((med, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${med.name}</strong></td>
                  <td>${med.dosage}</td>
                  <td>${med.frequency}</td>
                  <td>${med.duration}</td>
                  <td>${med.instructions || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${data.notes ? `
          <div class="section">
            <div class="section-title">Additional Notes</div>
            <div class="section-content">
              <p>${data.notes}</p>
            </div>
          </div>
        ` : ''}

        ${data.validUntil ? `
          <p style="color: #757575; font-size: 14px;">
            <strong>Valid Until:</strong> ${new Date(data.validUntil).toLocaleDateString()}
          </p>
        ` : ''}

        <div class="signature-line">
          <hr>
          <p class="signature-text">Doctor's Signature</p>
        </div>

        <div class="footer">
          <p>Generated by G1Cure Healthcare Platform | ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;

    this.openPrintWindow(html, `Prescription_${data.prescriptionId}`);
  }

  /**
   * Print medical report
   */
  printMedicalReport(data: MedicalReportData): void {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Medical Report - ${data.reportId}</title>
        ${this.commonStyles}
      </head>
      <body>
        <div class="header">
          <h1>G1Cure Healthcare</h1>
        </div>

        <div class="document-title">MEDICAL REPORT</div>

        <div class="info-row">
          <span><span class="info-label">Report ID:</span> ${data.reportId}</span>
          <span><span class="info-label">Type:</span> ${data.reportType}</span>
          <span><span class="info-label">Date:</span> ${new Date(data.date).toLocaleDateString()}</span>
        </div>

        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="section-content">
            <div class="grid-2">
              <div>
                <p><span class="info-label">Name:</span> ${data.patientName}</p>
                <p><span class="info-label">Age:</span> ${data.patientAge} years</p>
              </div>
              <div>
                <p><span class="info-label">Patient ID:</span> ${data.patientId}</p>
                <p><span class="info-label">Gender:</span> ${data.patientGender}</p>
              </div>
            </div>
            <p><span class="info-label">Examined By:</span> Dr. ${data.doctorName}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Chief Complaint</div>
          <div class="section-content">
            <p>${data.chiefComplaint}</p>
          </div>
        </div>

        ${data.vitalSigns && Object.keys(data.vitalSigns).length > 0 ? `
          <div class="section">
            <div class="section-title">Vital Signs</div>
            <div class="section-content">
              <div class="grid-2">
                ${data.vitalSigns.bloodPressure ? `<p><span class="info-label">Blood Pressure:</span> ${data.vitalSigns.bloodPressure} mmHg</p>` : ''}
                ${data.vitalSigns.heartRate ? `<p><span class="info-label">Heart Rate:</span> ${data.vitalSigns.heartRate} bpm</p>` : ''}
                ${data.vitalSigns.temperature ? `<p><span class="info-label">Temperature:</span> ${data.vitalSigns.temperature}°C</p>` : ''}
                ${data.vitalSigns.oxygenSaturation ? `<p><span class="info-label">SpO2:</span> ${data.vitalSigns.oxygenSaturation}%</p>` : ''}
                ${data.vitalSigns.weight ? `<p><span class="info-label">Weight:</span> ${data.vitalSigns.weight} kg</p>` : ''}
                ${data.vitalSigns.height ? `<p><span class="info-label">Height:</span> ${data.vitalSigns.height} cm</p>` : ''}
              </div>
            </div>
          </div>
        ` : ''}

        ${data.symptoms && data.symptoms.length > 0 ? `
          <div class="section">
            <div class="section-title">Symptoms</div>
            <div class="section-content">
              ${data.symptoms.map(s => `<div class="list-item">${s}</div>`).join('')}
            </div>
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Diagnosis</div>
          <div class="section-content">
            <p>${data.diagnosis}</p>
          </div>
        </div>

        ${data.treatment ? `
          <div class="section">
            <div class="section-title">Treatment</div>
            <div class="section-content">
              <p>${data.treatment}</p>
            </div>
          </div>
        ` : ''}

        ${data.recommendations ? `
          <div class="section">
            <div class="section-title">Recommendations</div>
            <div class="section-content">
              <p>${data.recommendations}</p>
            </div>
          </div>
        ` : ''}

        ${data.followUp ? `
          <p style="margin-top: 20px; color: #757575;">
            <strong>Follow-up:</strong> ${data.followUp}
          </p>
        ` : ''}

        <div class="signature-line">
          <hr>
          <p class="signature-text">Doctor's Signature</p>
        </div>

        <div class="footer">
          <p>Generated by G1Cure Healthcare Platform | ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;

    this.openPrintWindow(html, `Medical_Report_${data.reportId}`);
  }

  /**
   * Print lab report
   */
  printLabReport(data: LabReportData): void {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Lab Report - ${data.reportId}</title>
        ${this.commonStyles}
      </head>
      <body>
        <div class="header">
          <h1>${data.labName || 'G1Cure Laboratory'}</h1>
          ${data.labAddress ? `<p>${data.labAddress}</p>` : ''}
        </div>

        <div class="document-title">LABORATORY REPORT</div>

        <div class="info-row">
          <span><span class="info-label">Report ID:</span> ${data.reportId}</span>
          <span><span class="info-label">Date:</span> ${new Date(data.date).toLocaleDateString()}</span>
        </div>
        <div class="info-row">
          <span><span class="info-label">Test:</span> ${data.testName} (${data.testType})</span>
        </div>

        <div class="section">
          <div class="section-title">Patient Information</div>
          <div class="section-content">
            <div class="grid-2">
              <div>
                <p><span class="info-label">Name:</span> ${data.patientName}</p>
                <p><span class="info-label">Age:</span> ${data.patientAge} years</p>
              </div>
              <div>
                <p><span class="info-label">Patient ID:</span> ${data.patientId}</p>
                <p><span class="info-label">Gender:</span> ${data.patientGender}</p>
              </div>
            </div>
            <p><span class="info-label">Referred By:</span> Dr. ${data.doctorName}</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Test Results</div>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Normal Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.results.map(result => `
                <tr class="${result.status !== 'Normal' ? 'abnormal' : ''}">
                  <td><strong>${result.parameter}</strong></td>
                  <td>${result.value}</td>
                  <td>${result.unit}</td>
                  <td>${result.normalRange}</td>
                  <td>
                    <span class="badge badge-${result.status === 'Normal' ? 'success' : 'warning'}">
                      ${result.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${data.observations ? `
          <div class="section">
            <div class="section-title">Observations</div>
            <div class="section-content">
              <p>${data.observations}</p>
            </div>
          </div>
        ` : ''}

        ${data.recommendations ? `
          <div class="section">
            <div class="section-title">Recommendations</div>
            <div class="section-content">
              <p>${data.recommendations}</p>
            </div>
          </div>
        ` : ''}

        <div class="signature-line">
          <hr>
          <p class="signature-text">Authorized Signatory</p>
        </div>

        <div class="footer">
          <p>Generated by G1Cure Healthcare Platform | ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;

    this.openPrintWindow(html, `Lab_Report_${data.reportId}`);
  }

  /**
   * Print invoice
   */
  printInvoice(data: InvoiceData): void {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${data.invoiceId}</title>
        ${this.commonStyles}
      </head>
      <body>
        <div class="header">
          <h1>${data.clinicName || 'G1Cure Healthcare'}</h1>
          ${data.clinicAddress ? `<p>${data.clinicAddress}</p>` : ''}
          ${data.clinicPhone ? `<p>Phone: ${data.clinicPhone} | Email: ${data.clinicEmail || 'N/A'}</p>` : ''}
        </div>

        <div class="document-title">INVOICE</div>

        <div class="info-row">
          <span><span class="info-label">Invoice #:</span> ${data.invoiceId}</span>
          <span class="badge badge-${data.paymentStatus === 'Paid' ? 'success' : data.paymentStatus === 'Overdue' ? 'danger' : 'warning'}">
            ${data.paymentStatus}
          </span>
        </div>
        <div class="info-row">
          <span><span class="info-label">Invoice Date:</span> ${new Date(data.invoiceDate).toLocaleDateString()}</span>
          <span><span class="info-label">Due Date:</span> ${new Date(data.dueDate).toLocaleDateString()}</span>
        </div>

        <div class="section">
          <div class="section-title">Bill To</div>
          <div class="section-content">
            <p><strong>${data.patientName}</strong></p>
            <p>Patient ID: ${data.patientId}</p>
            ${data.patientAddress ? `<p>${data.patientAddress}</p>` : ''}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Items</div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.toFixed(2)}</td>
                  <td>$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <table class="summary-table">
          <tr>
            <td><strong>Subtotal:</strong></td>
            <td style="text-align: right;">$${data.subtotal.toFixed(2)}</td>
          </tr>
          ${data.tax ? `
            <tr>
              <td><strong>Tax:</strong></td>
              <td style="text-align: right;">$${data.tax.toFixed(2)}</td>
            </tr>
          ` : ''}
          ${data.discount ? `
            <tr>
              <td><strong>Discount:</strong></td>
              <td style="text-align: right;">-$${data.discount.toFixed(2)}</td>
            </tr>
          ` : ''}
          ${data.insuranceCoverage ? `
            <tr>
              <td><strong>Insurance Coverage:</strong></td>
              <td style="text-align: right;">-$${data.insuranceCoverage.toFixed(2)}</td>
            </tr>
          ` : ''}
          <tr class="summary-total">
            <td><strong>Total:</strong></td>
            <td style="text-align: right;"><strong>$${data.total.toFixed(2)}</strong></td>
          </tr>
          ${data.insuranceCoverage ? `
            <tr style="color: #66BB6A;">
              <td><strong>Patient Responsibility:</strong></td>
              <td style="text-align: right;"><strong>$${data.patientResponsibility.toFixed(2)}</strong></td>
            </tr>
          ` : ''}
        </table>

        <div class="footer">
          <p>Generated by G1Cure Healthcare Platform | ${new Date().toLocaleDateString()}</p>
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>
    `;

    this.openPrintWindow(html, `Invoice_${data.invoiceId}`);
  }

  /**
   * Helper: Open print window
   */
  private openPrintWindow(html: string, filename: string): void {
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (!printWindow) {
      alert('Please allow popups to print documents');
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        // printWindow.close(); // Commented out to allow user to manually close after print
      }, 250);
    };
  }

  /**
   * Download as PDF (requires user to select "Save as PDF" in print dialog)
   */
  downloadAsPDF(html: string, filename: string): void {
    this.openPrintWindow(html, filename);
  }
}

// Export singleton instance
export const pdfPrinter = new PDFPrinter();

// Export types
export type {
  PrescriptionData,
  MedicalReportData,
  LabReportData,
  InvoiceData,
};
