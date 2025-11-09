import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { supabaseAdmin } from "../supabase/client";
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY || '';

if (!geminiApiKey) {
  console.warn('⚠️  GEMINI_API_KEY not set - AI features will be disabled');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

export interface MedicalQuery {
  id: string;
  userId: string;
  userRole: "patient" | "doctor";
  query: string;
  symptoms?: string[];
  medicalHistory?: string;
  currentMedications?: string[];
  response: string;
  confidence: number;
  category: "diagnosis" | "medication" | "general" | "emergency";
  isEmergency: boolean;
  createdAt: Date;
}

export interface CreateMedicalQueryRequest {
  query: string;
  symptoms?: string[];
  medicalHistory?: string;
  currentMedications?: string[];
  category?: "diagnosis" | "medication" | "general" | "emergency";
}

export interface MedicalQueryResponse {
  response: string;
  confidence: number;
  category: "diagnosis" | "medication" | "general" | "emergency";
  isEmergency: boolean;
  suggestions: string[];
  warnings: string[];
}

export interface DrugInteractionRequest {
  medications: string[];
  newMedication: string;
}

export interface DrugInteractionResponse {
  hasInteraction: boolean;
  severity: "low" | "moderate" | "high" | "severe";
  description: string;
  recommendations: string[];
}

export interface MedicalDocumentationRequest {
  appointmentId: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

export interface MedicalDocumentationResponse {
  documentation: string;
  icd10Codes: string[];
  cptCodes: string[];
  recommendations: string[];
}

// Medical knowledge base for common conditions
const MEDICAL_KNOWLEDGE = {
  emergency_keywords: [
    'chest pain', 'shortness of breath', 'severe bleeding', 'unconscious',
    'stroke', 'heart attack', 'seizure', 'severe injury', 'poisoning'
  ],
  common_symptoms: {
    'fever': ['infection', 'inflammation', 'viral illness'],
    'headache': ['tension', 'migraine', 'sinus', 'dehydration'],
    'cough': ['cold', 'flu', 'bronchitis', 'allergies'],
    'fatigue': ['stress', 'anemia', 'sleep disorder', 'depression']
  }
};

// Check if query indicates emergency
function checkEmergency(query: string, symptoms: string[] = []): boolean {
  const allText = (query + ' ' + symptoms.join(' ')).toLowerCase();
  return MEDICAL_KNOWLEDGE.emergency_keywords.some(keyword => 
    allText.includes(keyword)
  );
}

// Generate medical response using Gemini
async function generateMedicalResponse(
  query: string,
  symptoms: string[] = [],
  medicalHistory: string = '',
  currentMedications: string[] = []
): Promise<MedicalQueryResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a medical AI assistant. Provide helpful, accurate, and safe medical information.
    
Patient Query: ${query}
Symptoms: ${symptoms.join(', ')}
Medical History: ${medicalHistory}
Current Medications: ${currentMedications.join(', ')}

IMPORTANT GUIDELINES:
1. Always recommend consulting a healthcare professional for serious concerns
2. Never provide definitive diagnoses
3. Flag any potential emergencies
4. Be cautious with medication advice
5. Consider drug interactions
6. Provide evidence-based information

Please respond with:
1. A helpful but cautious response
2. Confidence level (0-100)
3. Category (diagnosis/medication/general/emergency)
4. Whether this is an emergency
5. Specific suggestions
6. Any warnings

Format your response as JSON:
{
  "response": "your response here",
  "confidence": 75,
  "category": "general",
  "isEmergency": false,
  "suggestions": ["suggestion1", "suggestion2"],
  "warnings": ["warning1", "warning2"]
}`;

    const result = await model.generateContent([
      "You are a medical AI assistant. Always prioritize patient safety and recommend professional medical consultation.",
      prompt
    ]);

    const response = result.response.text();
    if (!response) {
      throw new Error("No response from Gemini");
    }

    // Parse JSON response
    const parsed = JSON.parse(response);
    
    return {
      response: parsed.response,
      confidence: parsed.confidence,
      category: parsed.category,
      isEmergency: parsed.isEmergency || checkEmergency(query, symptoms),
      suggestions: parsed.suggestions || [],
      warnings: parsed.warnings || [],
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      response: "I'm sorry, I'm unable to process your medical query at the moment. Please consult with a healthcare professional for medical advice.",
      confidence: 0,
      category: "general",
      isEmergency: checkEmergency(query, symptoms),
      suggestions: ["Consult a healthcare professional"],
      warnings: ["This is not a substitute for professional medical advice"],
    };
  }
}

// Create medical query
export const createMedicalQuery = api<CreateMedicalQueryRequest, MedicalQuery>(
  { expose: true, method: "POST", path: "/ai/medical-query", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    // Generate AI response
    const aiResponse = await generateMedicalResponse(
      req.query,
      req.symptoms,
      req.medicalHistory,
      req.currentMedications
    );

    // Store query in database
    const { data, error } = await supabaseAdmin
      .from("medical_queries")
      .insert({
        user_id: auth.userID,
        user_role: auth.role,
        query: req.query,
        symptoms: req.symptoms,
        medical_history: req.medicalHistory,
        current_medications: req.currentMedications,
        response: aiResponse.response,
        confidence: aiResponse.confidence,
        category: aiResponse.category,
        is_emergency: aiResponse.isEmergency,
      })
      .select()
      .single();

    if (error) {
      throw APIError.internal("Failed to store medical query", { cause: error });
    }

    return {
      id: data.id,
      userId: data.user_id,
      userRole: data.user_role,
      query: data.query,
      symptoms: data.symptoms,
      medicalHistory: data.medical_history,
      currentMedications: data.current_medications,
      response: data.response,
      confidence: data.confidence,
      category: data.category,
      isEmergency: data.is_emergency,
      createdAt: new Date(data.created_at),
    };
  }
);

// Check drug interactions
export const checkDrugInteractions = api<DrugInteractionRequest, DrugInteractionResponse>(
  { expose: true, method: "POST", path: "/ai/drug-interactions", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== 'doctor' && auth.role !== 'admin') {
      throw APIError.permissionDenied("Only doctors can check drug interactions");
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Check for potential drug interactions between these medications:
Current medications: ${req.medications.join(', ')}
New medication: ${req.newMedication}

Provide analysis in JSON format:
{
  "hasInteraction": true/false,
  "severity": "low/moderate/high/severe",
  "description": "detailed description",
  "recommendations": ["recommendation1", "recommendation2"]
}`;

      const result = await model.generateContent([
        "You are a medical AI assistant specializing in drug interactions. Be thorough and cautious.",
        prompt
      ]);

      const response = result.response.text();
      if (!response) {
        throw new Error("No response from Gemini");
      }

      const parsed = JSON.parse(response);
      
      return {
        hasInteraction: parsed.hasInteraction,
        severity: parsed.severity,
        description: parsed.description,
        recommendations: parsed.recommendations || [],
      };
    } catch (error) {
      console.error('Drug interaction check error:', error);
      return {
        hasInteraction: false,
        severity: "low",
        description: "Unable to check interactions at this time. Please consult a pharmacist or drug interaction database.",
        recommendations: ["Consult a healthcare professional for drug interaction advice"],
      };
    }
  }
);

// Generate medical documentation
export const generateMedicalDocumentation = api<MedicalDocumentationRequest, MedicalDocumentationResponse>(
  { expose: true, method: "POST", path: "/ai/medical-documentation", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== 'doctor' && auth.role !== 'admin') {
      throw APIError.permissionDenied("Only doctors can generate medical documentation");
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Generate professional medical documentation for this appointment:

Symptoms: ${req.symptoms}
Diagnosis: ${req.diagnosis}
Treatment: ${req.treatment}
Notes: ${req.notes}

Please provide:
1. Professional medical documentation
2. Relevant ICD-10 codes
3. Relevant CPT codes
4. Clinical recommendations

Format as JSON:
{
  "documentation": "professional medical note",
  "icd10Codes": ["code1", "code2"],
  "cptCodes": ["code1", "code2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`;

      const result = await model.generateContent([
        "You are a medical AI assistant helping with clinical documentation. Provide accurate ICD-10 and CPT codes.",
        prompt
      ]);

      const response = result.response.text();
      if (!response) {
        throw new Error("No response from Gemini");
      }

      const parsed = JSON.parse(response);
      
      return {
        documentation: parsed.documentation,
        icd10Codes: parsed.icd10Codes || [],
        cptCodes: parsed.cptCodes || [],
        recommendations: parsed.recommendations || [],
      };
    } catch (error) {
      console.error('Medical documentation generation error:', error);
      return {
        documentation: "Unable to generate documentation at this time. Please document manually.",
        icd10Codes: [],
        cptCodes: [],
        recommendations: ["Please review and complete documentation manually"],
      };
    }
  }
);

// Get medical query history
export const getMedicalQueryHistory = api<void, { queries: MedicalQuery[] }>(
  { expose: true, method: "GET", path: "/ai/medical-query-history", auth: true },
  async () => {
    const auth = getAuthData()!;
    
    const { data, error } = await supabaseAdmin
      .from("medical_queries")
      .select("*")
      .eq("user_id", auth.userID)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw APIError.internal("Failed to get medical query history", { cause: error });
    }

    return {
      queries: data.map(query => ({
        id: query.id,
        userId: query.user_id,
        userRole: query.user_role,
        query: query.query,
        symptoms: query.symptoms,
        medicalHistory: query.medical_history,
        currentMedications: query.current_medications,
        response: query.response,
        confidence: query.confidence,
        category: query.category,
        isEmergency: query.is_emergency,
        createdAt: new Date(query.created_at),
      }))
    };
  }
);
