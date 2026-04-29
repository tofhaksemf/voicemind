import { useState, useEffect, useCallback } from 'react';

// 브라우저 호환성 대응을 위한 타입 정의
const SpeechRecognition = typeof window !== 'undefined' && 
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export const useVoiceTest = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [step, setStep] = useState(0); // 0: Intro, 1: Orientation, ...

  // 1. 음성 안내 (TTS)
  const speak = (text: string, onEnd?: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    window.speechSynthesis.speak(utterance);
  };

  // 2. 음성 인식 (STT)
  const listen = useCallback(() => {
    if (!SpeechRecognition) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다. 크롬 브라우저를 권장합니다.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.start();
  }, []);

  return { step, setStep, isListening, transcript, speak, listen };
};