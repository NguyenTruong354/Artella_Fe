import React, { useState, useEffect, useRef } from 'react';
import Scene2025 from './components/Scene2025';
import Countdown from './components/Countdown';
import Scene2026 from './components/Scene2026';
import FireworksScene from './components/FireworksScene';

const HappyNewYear: React.FC = () => {
  const [step, setStep] = useState<'scene2025' | 'countdown' | 'scene2026' | 'fireworks'>('scene2025');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/sounds/happyNewYear.mp3');
    audio.loop = true;
    audio.volume = 1.0;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (step === 'scene2026') {
      audioRef.current?.play().catch(e => console.log("Autoplay prevented", e));
    }
  }, [step]);

  useEffect(() => {
    const handleInteraction = () => {
      if ((step === 'scene2026' || step === 'fireworks') && audioRef.current?.paused) {
        audioRef.current.play();
      }
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [step]);

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
