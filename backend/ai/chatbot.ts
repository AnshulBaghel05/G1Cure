import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { supabaseAdmin } from "../supabase/client";
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY || '';

if (!geminiApiKey) {
  console.warn('⚠️  GEMINI_API_KEY not set - Chatbot AI features will be disabled');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  message: string;
  response: string;
  context?: ConversationContext;
  createdAt: Date;
}

export interface ConversationContext {
  userRole?: string;
  previousMessages?: Array<{ role: string; content: string }>;
  userIntent?: string;
  metadata?: Record<string, any>;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: ConversationContext;
}

export interface ChatResponse {
  id: string;
  conversationId: string;
  message: string;
  response: string;
  intent: string;
  suggestions: string[];
  actions?: Array<{ type: string; label: string; data: any }>;
}

export interface ConversationHistoryRequest {
  conversationId: string;
  limit?: number;
}

export interface ConversationHistoryResponse {
  messages: Array<{
    id: string;
    message: string;
    response: string;
    createdAt: Date;
  }>;
}

// G1Cure platform knowledge base
const PLATFORM_KNOWLEDGE = {
  features: {
    patientManagement: "Comprehensive digital patient records with medical history, allergies, medications, and emergency contacts",
    appointments: "Smart scheduling with online booking, automated SMS/email reminders, conflict detection, and waitlist management",
    telemedicine: "Custom WebRTC video conferencing with multi-party calls (up to 50 participants), screen sharing, recording, and real-time chat",
    billing: "Automated invoicing with multiple payment gateways (Stripe, UPI, cards), payment tracking, financial reporting, and insurance claims",
    analytics: "Real-time dashboards with revenue analytics, patient demographics, appointment trends, and doctor performance metrics",
    ai: "AI-powered medical assistant with symptom analysis, drug interaction checking, and automated medical documentation using Google Gemini",
    security: "HIPAA compliance, end-to-end encryption, role-based access control, and automated backups"
  },
  roles: {
    admin: "Full system access including user management, analytics, billing, departments, and system settings",
    doctor: "Patient management, appointments, telemedicine, prescriptions, lab reports, and billing",
    patient: "Access to medical records, appointment booking, telemedicine consultations, billing, and notifications",
    subAdmin: "Customizable permissions for viewing/editing patients, doctors, appointments, billing, and analytics"
  },
  integrations: {
    stripe: "Payment processing with secure checkout and webhook support",
    twilio: "SMS and email notifications for appointments and reminders",
    agora: "Video conferencing infrastructure (also have custom WebRTC)",
    gemini: "Google AI for medical assistance, symptom analysis, and documentation"
  },
  pricing: {
    trial: "7-day free trial available",
    plans: "Flexible pricing based on clinic size and needs",
    contact: "Schedule a demo or contact sales for detailed pricing"
  },
  support: {
    email: "support@g1cure.com",
    phone: "+91 98765 43210",
    hours: "Monday to Friday, 9 AM to 6 PM IST",
    response: "Typically within 24 hours"
  }
};

// Determine user intent from message
function detectIntent(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) return 'greeting';
  if (msg.includes('feature') || msg.includes('what can') || msg.includes('capabilities')) return 'features';
  if (msg.includes('price') || msg.includes('cost') || msg.includes('pricing')) return 'pricing';
  if (msg.includes('demo') || msg.includes('trial')) return 'demo';
  if (msg.includes('support') || msg.includes('help') || msg.includes('contact')) return 'support';
  if (msg.includes('patient') && msg.includes('manage')) return 'patientManagement';
  if (msg.includes('appointment') || msg.includes('schedule')) return 'appointments';
  if (msg.includes('video') || msg.includes('telemedicine') || msg.includes('consult')) return 'telemedicine';
  if (msg.includes('billing') || msg.includes('payment') || msg.includes('invoice')) return 'billing';
  if (msg.includes('analytics') || msg.includes('report') || msg.includes('dashboard')) return 'analytics';
  if (msg.includes('ai') || msg.includes('medical assistant')) return 'ai';
  if (msg.includes('security') || msg.includes('hipaa') || msg.includes('compliance')) return 'security';
  if (msg.includes('role') || msg.includes('permission') || msg.includes('access')) return 'roles';
  if (msg.includes('integrat')) return 'integrations';

  return 'general';
}

// Generate suggestions based on intent
function generateSuggestions(intent: string): string[] {
  const suggestions: Record<string, string[]> = {
    greeting: ["Show me features", "Pricing information", "Book a demo", "Get support"],
    features: ["Patient management details", "Appointment scheduling", "Telemedicine features", "Analytics capabilities"],
    pricing: ["Book a demo", "Contact sales", "Start free trial", "View all features"],
    demo: ["View features first", "Check pricing", "Contact support", "See integrations"],
    support: ["Book a demo", "View documentation", "Check FAQs", "See features"],
    patientManagement: ["Appointment scheduling", "Telemedicine", "Medical records", "Analytics"],
    appointments: ["Telemedicine", "Patient management", "SMS reminders", "Calendar integration"],
    telemedicine: ["Video call features", "Recording options", "Screen sharing", "Multi-party calls"],
    billing: ["Payment gateways", "Invoicing", "Insurance claims", "Financial reports"],
    analytics: ["Revenue analytics", "Patient demographics", "Performance metrics", "Custom reports"],
    ai: ["Medical assistance", "Drug interactions", "Symptom analysis", "Auto documentation"],
    security: ["HIPAA compliance", "Data encryption", "Access control", "Backup policies"],
    roles: ["Admin permissions", "Doctor access", "Patient portal", "Sub-admin setup"],
    integrations: ["Stripe payment", "Twilio SMS", "Agora video", "Gemini AI"],
    general: ["View all features", "Pricing info", "Book a demo", "Contact support"]
  };

  return suggestions[intent] || suggestions.general;
}

// Generate quick actions based on intent
function generateActions(intent: string, userRole?: string): Array<{ type: string; label: string; data: any }> {
  const actions: Array<{ type: string; label: string; data: any }> = [];

  if (intent === 'demo' || intent === 'pricing') {
    actions.push({
      type: 'navigation',
      label: 'Book a Demo',
      data: { path: '/contact', action: 'bookDemo' }
    });
  }

  if (intent === 'pricing') {
    actions.push({
      type: 'navigation',
      label: 'View Pricing',
      data: { path: '/pricing' }
    });
  }

  if (intent === 'support') {
    actions.push({
      type: 'external',
      label: 'Email Support',
      data: { url: 'mailto:support@g1cure.com' }
    });
  }

  if (intent === 'features') {
    actions.push({
      type: 'navigation',
      label: 'Explore Features',
      data: { path: '/features' }
    });
  }

  return actions;
}

// Generate AI response using Gemini
async function generateAIResponse(
  message: string,
  context: ConversationContext = {},
  userRole?: string
): Promise<{ response: string; intent: string }> {
  const intent = detectIntent(message);

  // If Gemini is not configured, use fallback responses
  if (!geminiApiKey) {
    return {
      response: getFallbackResponse(intent, userRole),
      intent
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build conversation history
    const conversationHistory = context.previousMessages?.map(msg =>
      `${msg.role}: ${msg.content}`
    ).join('\n') || '';

    const platformContext = `You are G1Cure AI Assistant, helping users with the G1Cure Healthcare Management Platform.

PLATFORM INFORMATION:
${JSON.stringify(PLATFORM_KNOWLEDGE, null, 2)}

USER CONTEXT:
- Role: ${userRole || context.userRole || 'visitor'}
- Intent: ${intent}

CONVERSATION HISTORY:
${conversationHistory}

GUIDELINES:
1. Be helpful, friendly, and professional
2. Provide accurate information about G1Cure features
3. Recommend booking a demo for detailed information
4. Always maintain healthcare industry professionalism
5. If asked about medical advice, clarify you're a platform assistant (not medical AI)
6. Keep responses concise (2-3 sentences max)
7. Use specific details from the platform knowledge base
8. Encourage users to explore features relevant to their role

USER MESSAGE: ${message}

Provide a helpful, concise response based on the platform information above.`;

    const result = await model.generateContent(platformContext);
    const response = result.response.text();

    if (!response) {
      throw new Error("No response from Gemini");
    }

    return {
      response: response.trim(),
      intent
    };
  } catch (error) {
    console.error('Chatbot AI error:', error);
    return {
      response: getFallbackResponse(intent, userRole),
      intent
    };
  }
}

// Fallback responses when Gemini is not available
function getFallbackResponse(intent: string, userRole?: string): string {
  const responses: Record<string, string> = {
    greeting: "Hello! I'm G1Cure's AI assistant. I can help you with information about our healthcare management platform. What would you like to know?",
    features: `G1Cure offers comprehensive healthcare management including patient records, smart scheduling, custom WebRTC telemedicine (up to 50 participants), automated billing with Stripe integration, real-time analytics, and AI-powered medical assistance. Which feature interests you most?`,
    pricing: "We offer a 7-day free trial to get started! Our pricing is flexible based on your clinic size and needs. Would you like to schedule a demo to discuss pricing?",
    demo: "I'd be happy to help you book a demo! You can schedule one through our contact page. A demo is the best way to see G1Cure's powerful features in action.",
    support: "For support, reach us at support@g1cure.com or call +91 98765 43210 (Mon-Fri, 9 AM - 6 PM IST). We typically respond within 24 hours.",
    patientManagement: "Our patient management system includes digital records, medical history tracking, allergy & medication management, emergency contacts, and secure data storage with HIPAA compliance.",
    appointments: "Smart scheduling features include online booking, automated SMS/email reminders via Twilio, conflict detection, waitlist management, and multi-timezone support.",
    telemedicine: "Our custom WebRTC telemedicine platform supports multi-party video calls (up to 50 participants), advanced screen sharing, recording, real-time chat, waiting rooms, and connection quality monitoring.",
    billing: "Billing features include automated invoicing, multiple payment gateways (Stripe, UPI, cards), payment tracking, financial reporting, insurance claims processing, and refund management.",
    analytics: "Real-time analytics include revenue trends, patient demographics, appointment analytics, doctor performance metrics, custom reports, and predictive insights for business growth.",
    ai: "Our AI medical assistant (powered by Google Gemini) provides symptom analysis, drug interaction checking, automated medical documentation, preliminary assessments, and emergency detection.",
    security: "We ensure HIPAA compliance, end-to-end encryption, role-based access controls, automated backups, security monitoring, and comprehensive audit trails.",
    roles: `G1Cure supports multiple roles: ${userRole === 'admin' ? 'As an admin, you have' : 'Admins have'} full system access; doctors manage patients, appointments, and prescriptions; patients access their records and book appointments; sub-admins have customizable permissions.`,
    integrations: "G1Cure integrates with Stripe (payments), Twilio (SMS/email), Agora (video), Google Gemini (AI), and supports lab systems, pharmacy management, and insurance providers.",
    general: "I'm here to help you learn about G1Cure's healthcare platform. Ask me about features, pricing, demos, or specific capabilities like patient management, appointments, telemedicine, billing, analytics, or AI features!"
  };

  return responses[intent] || responses.general;
}

// Chat endpoint
export const chat = api<ChatRequest, ChatResponse>(
  { expose: true, method: "POST", path: "/ai/chat", auth: false },
  async (req) => {
    // Get auth data if user is logged in
    let auth;
    let userRole;
    try {
      auth = getAuthData();
      userRole = auth?.role;
    } catch {
      // User not logged in, that's fine
    }

    const userId = auth?.userID || 'anonymous';
    const conversationId = req.conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get previous messages for context if conversation ID provided
    let previousMessages: Array<{ role: string; content: string }> = [];
    if (req.conversationId) {
      const { data: history } = await supabaseAdmin
        .from("chat_messages")
        .select("message, response")
        .eq("conversation_id", req.conversationId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (history) {
        previousMessages = history.reverse().flatMap(msg => [
          { role: 'user', content: msg.message },
          { role: 'assistant', content: msg.response }
        ]);
      }
    }

    // Build context
    const context: ConversationContext = {
      userRole,
      previousMessages,
      ...req.context
    };

    // Generate AI response
    const { response, intent } = await generateAIResponse(req.message, context, userRole);

    // Generate suggestions and actions
    const suggestions = generateSuggestions(intent);
    const actions = generateActions(intent, userRole);

    // Store chat message in database (only if user is logged in)
    let messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (auth) {
      try {
        const { data, error } = await supabaseAdmin
          .from("chat_messages")
          .insert({
            conversation_id: conversationId,
            user_id: userId,
            message: req.message,
            response: response,
            intent: intent,
            context: context,
          })
          .select()
          .single();

        if (!error && data) {
          messageId = data.id;
        }
      } catch (error) {
        // Log error but don't fail the request
        console.error('Failed to store chat message:', error);
      }
    }

    return {
      id: messageId,
      conversationId,
      message: req.message,
      response,
      intent,
      suggestions,
      actions
    };
  }
);

// Get conversation history
export const getConversationHistory = api<ConversationHistoryRequest, ConversationHistoryResponse>(
  { expose: true, method: "GET", path: "/ai/conversation/:conversationId", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    const limit = req.limit || 50;

    const { data, error } = await supabaseAdmin
      .from("chat_messages")
      .select("id, message, response, created_at")
      .eq("conversation_id", req.conversationId)
      .eq("user_id", auth.userID)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      throw APIError.internal("Failed to get conversation history", { cause: error });
    }

    return {
      messages: data.map(msg => ({
        id: msg.id,
        message: msg.message,
        response: msg.response,
        createdAt: new Date(msg.created_at)
      }))
    };
  }
);

// Delete conversation history
export const deleteConversation = api<{ conversationId: string }, { success: boolean }>(
  { expose: true, method: "DELETE", path: "/ai/conversation/:conversationId", auth: true },
  async (req) => {
    const auth = getAuthData()!;

    const { error } = await supabaseAdmin
      .from("chat_messages")
      .delete()
      .eq("conversation_id", req.conversationId)
      .eq("user_id", auth.userID);

    if (error) {
      throw APIError.internal("Failed to delete conversation", { cause: error });
    }

    return { success: true };
  }
);
