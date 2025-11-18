import { supabase } from '../supabase';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  suggestions?: string[];
  actions?: Array<{ type: string; label: string; data: any }>;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
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

/**
 * Send a chat message to the AI chatbot
 */
export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<ChatResponse> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

    const response = await fetch(`${apiUrl}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
      },
      body: JSON.stringify({
        message,
        conversationId
      })
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Chat API error:', error);
    // Return fallback response
    return {
      id: `msg_${Date.now()}`,
      conversationId: conversationId || `conv_${Date.now()}`,
      message,
      response: "I'm having trouble connecting right now. Please try again in a moment or contact support@g1cure.com for assistance.",
      intent: 'error',
      suggestions: ['Try again', 'Contact support', 'View features', 'Book a demo'],
      actions: []
    };
  }
}

/**
 * Get conversation history for a specific conversation ID
 */
export async function getConversationHistory(
  conversationId: string
): Promise<Array<{ id: string; message: string; response: string; createdAt: Date }>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return [];
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

    const response = await fetch(`${apiUrl}/ai/conversation/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get conversation history: ${response.statusText}`);
    }

    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('Failed to get conversation history:', error);
    return [];
  }
}

/**
 * Delete conversation history
 */
export async function deleteConversation(conversationId: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return false;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

    const response = await fetch(`${apiUrl}/ai/conversation/${conversationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete conversation: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    return false;
  }
}
