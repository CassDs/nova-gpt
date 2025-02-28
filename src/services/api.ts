
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: async (message: string, conversationId?: string): Promise<ChatResponse> => {
    try {
      const response = await api.post<ChatResponse>('/api/chat', {
        message,
        conversation_id: conversationId,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  getConversation: async (conversationId: string): Promise<string[]> => {
    try {
      const response = await api.get(`/api/conversations/${conversationId}`);
      return response.data.history;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },
};
