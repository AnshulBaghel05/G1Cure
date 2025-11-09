import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.patients': 'Patients',
    'nav.doctors': 'Doctors',
    'nav.appointments': 'Appointments',
    'nav.telemedicine': 'Telemedicine',
    'nav.billing': 'Billing',
    'nav.analytics': 'Analytics',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.name': 'Name',
    'common.email': 'Email',
    'common.phone': 'Phone',
    
    // Home page
    'home.title': 'G1Cure Healthcare Management',
    'home.subtitle': 'Complete healthcare solution for modern clinics',
    'home.features.emr': 'Electronic Medical Records',
    'home.features.telemedicine': 'Telemedicine Platform',
    'home.features.billing': 'Automated Billing',
    'home.features.analytics': 'Advanced Analytics',
    
    // Patients
    'patients.title': 'Patient Management',
    'patients.add': 'Add New Patient',
    'patients.firstName': 'First Name',
    'patients.lastName': 'Last Name',
    'patients.dateOfBirth': 'Date of Birth',
    'patients.gender': 'Gender',
    'patients.address': 'Address',
    'patients.emergencyContact': 'Emergency Contact',
    'patients.emergencyPhone': 'Emergency Phone',
    'patients.medicalHistory': 'Medical History',
    'patients.allergies': 'Allergies',
    'patients.currentMedications': 'Current Medications',
    
    // Doctors
    'doctors.title': 'Doctor Management',
    'doctors.add': 'Add New Doctor',
    'doctors.specialization': 'Specialization',
    'doctors.licenseNumber': 'License Number',
    'doctors.experience': 'Experience (Years)',
    'doctors.qualification': 'Qualification',
    'doctors.consultationFee': 'Consultation Fee',
    'doctors.availability': 'Availability',
    'doctors.bio': 'Bio',
    
    // Appointments
    'appointments.title': 'Appointment Management',
    'appointments.add': 'Schedule New Appointment',
    'appointments.patient': 'Patient',
    'appointments.doctor': 'Doctor',
    'appointments.appointmentDate': 'Appointment Date',
    'appointments.duration': 'Duration (minutes)',
    'appointments.type': 'Type',
    'appointments.notes': 'Notes',
    'appointments.symptoms': 'Symptoms',
    'appointments.diagnosis': 'Diagnosis',
    'appointments.prescription': 'Prescription',
    
    // Billing
    'billing.title': 'Billing Management',
    'billing.add': 'Create New Bill',
    'billing.amount': 'Amount',
    'billing.taxAmount': 'Tax Amount',
    'billing.totalAmount': 'Total Amount',
    'billing.invoiceNumber': 'Invoice Number',
    'billing.dueDate': 'Due Date',
    'billing.paymentMethod': 'Payment Method',
    'billing.paymentReference': 'Payment Reference',
    
    // Analytics
    'analytics.title': 'Analytics Dashboard',
    'analytics.totalPatients': 'Total Patients',
    'analytics.totalDoctors': 'Total Doctors',
    'analytics.totalAppointments': 'Total Appointments',
    'analytics.totalRevenue': 'Total Revenue',
    'analytics.appointmentsToday': 'Appointments Today',
    'analytics.revenueToday': 'Revenue Today',
    'analytics.appointmentTrends': 'Appointment Trends',
    'analytics.revenueTrends': 'Revenue Trends',
    'analytics.doctorPerformance': 'Doctor Performance',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.patients': 'मरीज़',
    'nav.doctors': 'डॉक्टर',
    'nav.appointments': 'अपॉइंटमेंट',
    'nav.telemedicine': 'टेलीमेडिसिन',
    'nav.billing': 'बिलिंग',
    'nav.analytics': 'एनालिटिक्स',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'डिलीट करें',
    'common.edit': 'संपादित करें',
    'common.add': 'जोड़ें',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.actions': 'कार्य',
    'common.status': 'स्थिति',
    'common.date': 'तारीख',
    'common.time': 'समय',
    'common.name': 'नाम',
    'common.email': 'ईमेल',
    'common.phone': 'फोन',
    
    // Home page
    'home.title': 'G1Cure स्वास्थ्य प्रबंधन',
    'home.subtitle': 'आधुनिक क्लीनिकों के लिए संपूर्ण स्वास्थ्य समाधान',
    'home.features.emr': 'इलेक्ट्रॉनिक मेडिकल रिकॉर्ड',
    'home.features.telemedicine': 'टेलीमेडिसिन प्लेटफॉर्म',
    'home.features.billing': 'स्वचालित बिलिंग',
    'home.features.analytics': 'उन्नत एनालिटिक्स',
    
    // Patients
    'patients.title': 'मरीज़ प्रबंधन',
    'patients.add': 'नया मरीज़ जोड़ें',
    'patients.firstName': 'पहला नाम',
    'patients.lastName': 'अंतिम नाम',
    'patients.dateOfBirth': 'जन्म तिथि',
    'patients.gender': 'लिंग',
    'patients.address': 'पता',
    'patients.emergencyContact': 'आपातकालीन संपर्क',
    'patients.emergencyPhone': 'आपातकालीन फोन',
    'patients.medicalHistory': 'चिकित्सा इतिहास',
    'patients.allergies': 'एलर्जी',
    'patients.currentMedications': 'वर्तमान दवाएं',
    
    // Doctors
    'doctors.title': 'डॉक्टर प्रबंधन',
    'doctors.add': 'नया डॉक्टर जोड़ें',
    'doctors.specialization': 'विशेषज्ञता',
    'doctors.licenseNumber': 'लाइसेंस नंबर',
    'doctors.experience': 'अनुभव (वर्ष)',
    'doctors.qualification': 'योग्यता',
    'doctors.consultationFee': 'परामर्श शुल्क',
    'doctors.availability': 'उपलब्धता',
    'doctors.bio': 'बायो',
    
    // Appointments
    'appointments.title': 'अपॉइंटमेंट प्रबंधन',
    'appointments.add': 'नई अपॉइंटमेंट शेड्यूल करें',
    'appointments.patient': 'मरीज़',
    'appointments.doctor': 'डॉक्टर',
    'appointments.appointmentDate': 'अपॉइंटमेंट की तारीख',
    'appointments.duration': 'अवधि (मिनट)',
    'appointments.type': 'प्रकार',
    'appointments.notes': 'नोट्स',
    'appointments.symptoms': 'लक्षण',
    'appointments.diagnosis': 'निदान',
    'appointments.prescription': 'नुस्खा',
    
    // Billing
    'billing.title': 'बिलिंग प्रबंधन',
    'billing.add': 'नया बिल बनाएं',
    'billing.amount': 'राशि',
    'billing.taxAmount': 'कर राशि',
    'billing.totalAmount': 'कुल राशि',
    'billing.invoiceNumber': 'चालान संख्या',
    'billing.dueDate': 'देय तिथि',
    'billing.paymentMethod': 'भुगतान विधि',
    'billing.paymentReference': 'भुगतान संदर्भ',
    
    // Analytics
    'analytics.title': 'एनालिटिक्स डैशबोर्ड',
    'analytics.totalPatients': 'कुल मरीज़',
    'analytics.totalDoctors': 'कुल डॉक्टर',
    'analytics.totalAppointments': 'कुल अपॉइंटमेंट',
    'analytics.totalRevenue': 'कुल आय',
    'analytics.appointmentsToday': 'आज की अपॉइंटमेंट',
    'analytics.revenueToday': 'आज की आय',
    'analytics.appointmentTrends': 'अपॉइंटमेंट ट्रेंड',
    'analytics.revenueTrends': 'आय ट्रेंड',
    'analytics.doctorPerformance': 'डॉक्टर प्रदर्शन',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
