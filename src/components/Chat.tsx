
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquarePlus } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className={`flex mb-6 animate-slide-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-start max-w-[80%]">
        {message.role === 'assistant' && (
          <div className="mr-3 mt-1">
            <div className="flex h-8 w-8 rounded-full items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/03b00a72-d506-4e46-b13c-f8bf29aef6c0.png" 
                alt="Nova Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            {message.role === 'assistant' && (
              <span className="dark:text-white light:text-gray-800 font-medium mr-2">Nova Assistant</span>
            )}
            {message.timestamp && (
              <span className="dark:text-gray-400 light:text-gray-500 text-xs">{message.timestamp}</span>
            )}
          </div>
          <div
            className={`px-4 py-3 rounded-lg ${
              message.role === 'assistant'
                ? 'dark:bg-nova-dark-lighter dark:text-white light:bg-blue-100 light:text-gray-800'
                : 'bg-nova-blue text-white'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyConversation = ({ onNewConversation }: { onNewConversation: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="mb-6 w-24 h-24 rounded-full overflow-hidden">
        <img 
          src="/lovable-uploads/03b00a72-d506-4e46-b13c-f8bf29aef6c0.png" 
          alt="Nova Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-2xl font-bold dark:text-white light:text-gray-800 mb-3">Nova Assistant</h2>
      <p className="dark:text-gray-400 light:text-gray-600 mb-6 max-w-md">
        Seu assistente para FICO Blaze Advisor. Como posso ajudar você hoje?
      </p>
      <button 
        onClick={onNewConversation}
        className="flex items-center bg-nova-blue hover:bg-opacity-90 text-white px-4 py-2 rounded-md transition-colors"
      >
        <MessageSquarePlus size={18} className="mr-2" />
        <span>Nova Conversa</span>
      </button>
    </div>
  );
};

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Função para obter a conversa atual
  const currentConversation = currentConversationId 
    ? conversations.find(conv => conv.id === currentConversationId) 
    : null;

  // Função para criar nova conversa
  const createNewConversation = () => {
    const newConversationId = Date.now().toString();
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'Nova Conversa',
      messages: [],
      createdAt: new Date()
    };

    setConversations([...conversations, newConversation]);
    setCurrentConversationId(newConversationId);
  };

  // Função para enviar mensagem
  const handleSendMessage = () => {
    if (!inputValue.trim() || !currentConversationId) return;

    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp
    };

    // Adicionar mensagem do usuário
    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setInputValue('');
    
    // Simular resposta do assistente
    setIsLoading(true);
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Obrigado por sua mensagem. Como posso ajudar com FICO Blaze Advisor hoje?',
        timestamp: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      };
      
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, assistantMessage]
            };
          }
          return conv;
        })
      );
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Efeito para scrollar para o fim das mensagens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages]);

  return (
    <div className="flex flex-col h-full dark:bg-nova-dark light:bg-[#E0F2FF]">
      <div className="flex items-center p-5 border-b dark:border-nova-dark-border light:border-blue-200">
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full flex items-center justify-center mr-3 overflow-hidden">
            <img 
              src="/lovable-uploads/03b00a72-d506-4e46-b13c-f8bf29aef6c0.png" 
              alt="Nova Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="dark:text-white light:text-gray-800 font-medium">Nova Assistant</span>
        </div>
        <div className="ml-auto">
          <button 
            onClick={createNewConversation}
            className="flex items-center dark:text-gray-400 light:text-gray-600 hover:text-nova-blue transition-colors"
          >
            <MessageSquarePlus size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {!currentConversation ? (
          <EmptyConversation onNewConversation={createNewConversation} />
        ) : (
          <div className="space-y-4">
            {currentConversation.messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <div className="flex h-8 w-8 rounded-full items-center justify-center overflow-hidden">
                      <img 
                        src="/lovable-uploads/03b00a72-d506-4e46-b13c-f8bf29aef6c0.png" 
                        alt="Nova Logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-lg dark:bg-nova-dark-lighter light:bg-blue-100">
                    <LoadingSpinner size="sm" color="dark:border-white light:border-gray-600" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-nova-dark-border light:border-blue-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Envie uma mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!currentConversation}
            className="w-full dark:bg-nova-dark-lighter light:bg-blue-50 dark:border-nova-dark-border light:border-blue-200 dark:text-white light:text-gray-800 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-nova-blue disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentConversation || !inputValue.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center dark:text-gray-400 light:text-gray-500 hover:text-nova-blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="flex justify-center mt-2">
          <span className="text-xs dark:text-gray-500 light:text-gray-500">Nova - Seu assistente FICO Blaze Advisor</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
