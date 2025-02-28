
import React from 'react';
import { MessageCircle, Cog } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 mb-2 transition-colors rounded-md ${
        active
          ? 'bg-nova-purple text-white'
          : 'bg-nova-dark-lighter text-gray-300 hover:bg-opacity-70'
      }`}
    >
      <div className="mr-3 text-lg">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full bg-nova-dark border-r border-nova-dark-border">
      <div className="flex items-center p-5 border-b border-nova-dark-border">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-nova-blue flex items-center justify-center">
            <span className="text-white font-medium text-sm">N</span>
          </div>
          <span className="text-white font-semibold">Nova Assistant</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <SidebarItem
          icon={<MessageCircle size={18} />}
          label="Nova conversa"
          active={true}
        />
        <SidebarItem
          icon={<MessageCircle size={18} />}
          label="Python Advisor"
        />
        <SidebarItem
          icon={<MessageCircle size={18} />}
          label="FICO Tips"
        />
        <SidebarItem
          icon={<MessageCircle size={18} />}
          label="Code Samples"
        />
      </div>

      <div className="p-4 border-t border-nova-dark-border">
        <SidebarItem icon={<Cog size={18} />} label="Configurações" />
      </div>
    </div>
  );
};

export default Sidebar;
