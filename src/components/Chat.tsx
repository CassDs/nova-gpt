
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const ChatBubble: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className={`flex mb-6 animate-slide-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-start max-w-[80%]">
        {message.role === 'assistant' && (
          <div className="mr-3 mt-1">
            <div className="flex h-8 w-8 rounded-full bg-nova-blue items-center justify-center overflow-hidden">
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
              <span className="text-white font-medium mr-2">Nova Assistant</span>
            )}
            {message.timestamp && (
              <span className="text-gray-400 text-xs">{message.timestamp}</span>
            )}
          </div>
          <div
            className={`px-4 py-3 rounded-lg ${
              message.role === 'assistant'
                ? 'bg-nova-dark-lighter text-white'
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

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Olá! Sou o Nova, seu assistente para FICO Blaze Advisor. Como posso ajudar você hoje?',
          timestamp: '22:49'
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-5 border-b border-nova-dark-border">
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full bg-nova-blue flex items-center justify-center mr-3 overflow-hidden">
            <img 
              src="/lovable-uploads/03b00a72-d506-4e46-b13c-f8bf29aef6c0.png" 
              alt="Nova Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-medium">Nova Assistant</span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="inline-block mb-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-2 border-nova-blue opacity-50 animate-pulse-ring"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src="/lovable-uploads/03b00a72-d506-4e46-b13c-f8bf29aef6c0.png" 
                      alt="Nova Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <p className="text-white animate-pulse">Carregando...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-nova-dark-border">
        <div className="relative">
          <input
            type="text"
            placeholder="Envie uma mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-nova-dark-lighter border border-nova-dark-border text-white rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-nova-blue"
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="flex justify-center mt-2">
          <span className="text-xs text-gray-500">Nova - Seu assistente FICO Blaze Advisor</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
