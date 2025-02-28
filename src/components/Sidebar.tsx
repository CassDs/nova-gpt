
import React from 'react';
import { MessageCircle, ChevronLeft } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full px-4 py-3 mb-2 transition-colors rounded-md bg-nova-dark-lighter text-gray-300 hover:bg-opacity-70"
    >
      <div className="mr-3 text-lg">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`fixed md:relative z-20 flex flex-col h-full bg-nova-dark border-r border-nova-dark-border transition-all duration-300 ${
        isOpen 
          ? 'w-64 left-0 opacity-100 visible' 
          : 'w-0 -left-64 md:w-16 md:left-0 md:opacity-100 opacity-0 md:visible invisible'
      }`}
      style={{ overflow: 'hidden' }}
    >
      <div className="flex items-center justify-between p-5 border-b border-nova-dark-border">
        <div className="flex items-center space-x-2 overflow-hidden">
          <div className="h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="/lovable-uploads/03b00a72-d506-4e46-b13c-f8bf29aef6c0.png"
              alt="Nova Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className={`font-semibold text-white transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
            Nova Assistant
          </span>
        </div>
        
        <button 
          onClick={onClose}
          className={`text-gray-400 hover:text-white p-1 rounded-full transition-colors ${!isOpen && 'md:hidden'}`}
        >
          <ChevronLeft size={18} />
        </button>
      </div>
      
      <div className={`flex-1 p-4 overflow-y-auto ${!isOpen && 'md:p-2'}`}>
        <SidebarItem
          icon={<MessageCircle size={18} />}
          label="Nova conversa"
        />
      </div>
    </div>
  );
};

export default Sidebar;
