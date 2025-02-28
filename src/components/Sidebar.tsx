
import React from 'react';
import { MessageCircle } from 'lucide-react';

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

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full bg-nova-dark border-r border-nova-dark-border md:w-64 w-20">
      <div className="flex items-center p-5 border-b border-nova-dark-border">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="/lovable-uploads/03b00a72-d506-4e46-b13c-f8bf29aef6c0.png"
              alt="Nova Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold text-white hidden md:block">Nova Assistant</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <SidebarItem
          icon={<MessageCircle size={18} />}
          label="Nova conversa"
        />
      </div>
    </div>
  );
};

export default Sidebar;
