
import axios from 'axios';

// Definindo a URL da API baseada no ambiente
// Quando em desenvolvimento local, usamos http://localhost:8000
// Em produção, o backend pode estar em um domínio diferente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  // Garantir que credenciais como cookies sejam enviados
  withCredentials: true,
});

// Adicionar interceptors para logar requisições e respostas (ajuda no debug)
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const chatService = {
  sendMessage: async (message: string, conversationId?: string): Promise<ChatResponse> => {
    try {
      console.log('Enviando mensagem para API:', message, 'ID da conversa:', conversationId);
      const response = await api.post<ChatResponse>('/api/chat', {
        message,
        conversation_id: conversationId,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalhes do erro Axios:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
      }
      throw error;
    }
  },

  getConversation: async (conversationId: string): Promise<string[]> => {
    try {
      console.log('Obtendo conversa:', conversationId);
      const response = await api.get(`/api/conversations/${conversationId}`);
      return response.data.history;
    } catch (error) {
      console.error('Erro ao buscar conversa:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalhes do erro Axios:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
      }
      throw error;
    }
  },
};
