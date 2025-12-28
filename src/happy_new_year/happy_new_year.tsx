import React, { useState } from 'react';
import Scene2025 from './components/Scene2025';
import Countdown from './components/Countdown';
import Scene2026 from './components/Scene2026';
import FireworksScene from './components/FireworksScene';

const HappyNewYear: React.FC = () => {
  const [step, setStep] = useState<'scene2025' | 'countdown' | 'scene2026' | 'fireworks'>('scene2025');

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', 
        backgroundColor: 'black',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999 
      }} 
    >
      {step === 'scene2025' && (
        <Scene2025 onComplete={() => setStep('countdown')} />
      )}
      {step === 'countdown' && (
        <Countdown onComplete={() => setStep('scene2026')} />
      )}
      {step === 'scene2026' && (
        <Scene2026 onComplete={() => setStep('fireworks')} />
      )}
      {step === 'fireworks' && (
        <FireworksScene />
      )}
    </div>
  );
};

export default HappyNewYear;
