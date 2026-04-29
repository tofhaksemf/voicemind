import React, { useState, useEffect } from 'react';

interface Props {
  targetWords: string[]; // 기억 등록 단계에서 넘겨받은 ['비행기', '나무', '모자']
  onComplete: (score: number) => void;
  speak: (text: string, onEnd?: () => void) => void;
  listen: () => void;
  transcript: string;
}

export const DelayedRecallTest = ({ targetWords, onComplete, speak, listen, transcript }: Props) => {
  const [isListening, setIsListening] = useState(false);
  const [foundWords, setFoundWords] = useState<string[]>([]);

  // 1. 컴포넌트 진입 시 질문 수행
  useEffect(() => {
    const question = "아까 제가 말씀드린 세 가지 단어를 기억하시나요? 생각나는 대로 말씀해 주세요.";
    
    speak(question, () => {
      setIsListening(true);
      listen();
    });
  }, []);

  // 2. 음성 인식 결과 실시간 매칭
  useEffect(() => {
    if (isListening && transcript) {
      setFoundWords((prev) => {
        const currentFound = targetWords.filter(word => transcript.includes(word));
        // 기존에 찾은 단어와 합치기 (중복 제거)
        const combined = Array.from(new Set([...prev, ...currentFound]));
        return combined;
      });
    }
  }, [transcript, isListening, targetWords]);

  // 3. 종료 및 결과 전달
  const handleFinish = () => {
    setIsListening(false);
    onComplete(foundWords.length); // 최종 점수 (0~3점) 전달
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold mb-4">지연 회상 (기억력 확인)</h2>
      <p className="text-2xl text-gray-600 mb-10 break-keep">
        조금 전 외웠던 3가지 단어를 말씀해 주세요.
      </p>

      {/* 기획서 5. 가이드라인: 음성 파형 시각화 (간이 구현) */}
      <div className="flex items-center justify-center gap-2 h-20 mb-10">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-3 bg-emerald-500 rounded-full animate-bounce"
            style={{ 
              height: isListening ? `${Math.random() * 100}%` : '20%',
              animationDelay: `${i * 0.1}s` 
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        {targetWords.map((word, index) => (
          <div
            key={index}
            className={`py-6 rounded-3xl border-4 text-2xl font-bold transition-all ${
              foundWords.includes(word)
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-gray-100 bg-gray-50 text-transparent' // 정답을 미리 보여주지 않음
            }`}
          >
            {foundWords.includes(word) ? word : '?'}
          </div>
        ))}
      </div>

      <button
        onClick={handleFinish}
        className="mt-12 w-full py-5 bg-gray-800 text-white text-2xl rounded-2xl font-bold active:scale-95"
      >
        검사 완료
      </button>
    </div>
  );
};