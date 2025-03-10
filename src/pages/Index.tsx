
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import IntroEffect from '../components/IntroEffect';
import { Menu, ChevronRight } from 'lucide-react';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fechar a sidebar automaticamente em telas pequenas ao carregar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Executar na montagem
    handleResize();

    // Adicionar event listener para redimensionamento
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!showIntro) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 100);
    }
  }, [showIntro]);

  return (
    <>
      {showIntro && <IntroEffect onComplete={handleIntroComplete} />}
      
      <div className={`flex h-screen overflow-hidden transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {sidebarOpen && (
          <div className="transition-all duration-300 ease-in-out w-64">
            <Sidebar isOpen={true} onClose={toggleSidebar} />
          </div>
        )}

        <div className="flex-1 flex flex-col h-full relative">
          {/* Botão para abrir sidebar quando fechada */}
          {!sidebarOpen && (
            <button 
              className="absolute top-4 left-4 z-30 p-2 rounded-full bg-nova-dark-lighter text-white"
              onClick={toggleSidebar}
              aria-label="Abrir menu lateral"
            >
              <Menu size={20} />
            </button>
          )}
          <div className="flex-1 h-full border-l border-nova-dark-border">
            <Chat />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
