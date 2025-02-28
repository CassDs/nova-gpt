
import React, { useState } from 'react';
import { MessageCircle, Cog, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
          ? 'bg-nova-purple text-white dark:bg-nova-purple dark:text-white light:bg-indigo-500 light:text-white'
          : 'bg-nova-dark-lighter text-gray-300 hover:bg-opacity-70 dark:bg-nova-dark-lighter dark:text-gray-300 light:bg-blue-100 light:text-gray-700 light:hover:bg-blue-200'
      }`}
    >
      <div className="mr-3 text-lg">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="p-4 rounded-md dark:bg-nova-dark-lighter light:bg-blue-100">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium dark:text-gray-300 light:text-gray-700">Tema</span>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-md dark:bg-nova-dark light:bg-blue-50"
        >
          {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-indigo-600" />}
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex flex-col h-full dark:bg-nova-dark light:bg-[#D3E4FD] border-r dark:border-nova-dark-border light:border-blue-200">
      <div className="flex items-center p-5 border-b dark:border-nova-dark-border light:border-blue-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="/lovable-uploads/03b00a72-d506-4e46-b13c-f8bf29aef6c0.png"
              alt="Nova Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold dark:text-white light:text-gray-800">Nova Assistant</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <SidebarItem
          icon={<MessageCircle size={18} />}
          label="Nova conversa"
          active={!showSettings}
          onClick={() => setShowSettings(false)}
        />
        <SidebarItem
          icon={<Cog size={18} />}
          label="Configurações"
          active={showSettings}
          onClick={() => setShowSettings(true)}
        />
      </div>

      {showSettings && (
        <div className="p-4 border-t dark:border-nova-dark-border light:border-blue-200">
          <ThemeToggle />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
