'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// 1. 음성 기능을 관리하는 훅을 불러옵니다.
import { useVoiceTest } from '../../hooks/useVoiceTest'; 
import { DateOrientationTest } from '../../components/Test/DateOrientation';
import { MemoryRegistration } from '../../components/Test/MemoryRegistration';
import { FluencyTest } from '../../components/Test/FluencyTest';
import { DelayedRecallTest } from '../../components/Test/DelayedRecall';

export default function TestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [scores, setScores] = useState({ orientation: 0, registration: 0, fluency: 0, recall: 0 });
  const [targetWords, setTargetWords] = useState<string[]>([]);

  // 2. 음성 기능들을 이 페이지에서 사용할 수 있게 꺼내옵니다.
  const { speak, listen, transcript, isListening } = useVoiceTest();

  const finishTest = (finalScores: any) => {
    const params = new URLSearchParams(finalScores as any).toString();
    router.push(`/result?${params}`);
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="w-full h-3 bg-gray-200 rounded-full mb-10">
        <div 
          className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {/* 3. 각 컴포넌트에 speak, listen, transcript를 전달해줍니다. */}
      {step === 1 && (
        <DateOrientationTest 
          onComplete={(s) => { setScores({...scores, orientation: s}); setStep(2); }} 
        />
      )}
      {step === 2 && (
        <MemoryRegistration 
          speak={speak} 
          listen={listen} 
          transcript={transcript}
          onComplete={(s, words) => { 
            setScores({...scores, registration: s}); 
            setTargetWords(words); 
            setStep(3); 
          }} 
        />
      )}
      {step === 3 && (
        <FluencyTest 
          onComplete={(s) => { setScores({...scores, fluency: s}); setStep(4); }} 
        />
      )}
      {step === 4 && (
        <DelayedRecallTest 
          targetWords={targetWords} 
          speak={speak}
          listen={listen}
          transcript={transcript}
          onComplete={(s) => finishTest({...scores, recall: s})} 
        />
      )}
    </div>
  );
}