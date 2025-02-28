
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import IntroEffect from '../components/IntroEffect';

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
    <>
      {showIntro && <IntroEffect onComplete={handleIntroComplete} />}
      
      <div className={`flex h-screen overflow-hidden transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-64 h-full">
          <Sidebar />
        </div>
        <div className="flex-1 h-full border-l border-nova-dark-border">
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Index;
