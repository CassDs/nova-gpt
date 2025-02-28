
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const IntroEffect = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'logo' | 'text' | 'complete'>('logo');
  
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('text');
    }, 1500);
    
    const timer2 = setTimeout(() => {
      setPhase('complete');
      setTimeout(onComplete, 500);
    }, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-nova-dark z-50">
      <div className="text-center">
        <div className={`transition-all duration-500 mb-6 ${
          phase === 'logo' ? 'scale-100 opacity-100' : 
          phase === 'text' ? 'scale-90 opacity-80' : 
          'scale-50 opacity-0'
        }`}>
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 border-4 border-nova-blue rounded-full animate-pulse-ring"></div>
            <img 
              src="/lovable-uploads/03b00a72-d506-4e46-b13c-f8bf29aef6c0.png" 
              alt="Nova Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className={`transition-all duration-500 ${
          phase === 'logo' ? 'opacity-0 transform translate-y-10' : 
          phase === 'text' ? 'opacity-100 transform translate-y-0' :
          'opacity-0 transform translate-y-0'
        }`}>
          <h1 className="text-2xl font-bold text-white mb-2">Nova Assistant</h1>
          <p className="text-gray-300 mb-4">Seu assistente inteligente para FICO Blaze Advisor</p>
          <div className="flex justify-center">
            <LoadingSpinner size="md" color="border-nova-blue" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroEffect;
