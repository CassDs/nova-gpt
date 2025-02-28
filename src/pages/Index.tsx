
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import IntroEffect from '../components/IntroEffect';
import { ThemeProvider } from '../contexts/ThemeContext';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    if (!showIntro) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 100);
    }
  }, [showIntro]);

  return (
    <ThemeProvider>
      <>
        {showIntro && <IntroEffect onComplete={handleIntroComplete} />}
        
        <div className={`flex h-screen overflow-hidden transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-64 h-full">
            <Sidebar />
          </div>
          <div className="flex-1 h-full border-l border-nova-dark-border dark:border-nova-dark-border light:border-gray-200">
            <Chat />
          </div>
        </div>
      </>
    </ThemeProvider>
  );
};

export default Index;
