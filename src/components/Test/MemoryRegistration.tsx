import React, { useState, useEffect } from 'react';

interface Props {
  onComplete: (score: number, words: string[]) => void;
  speak: (text: string, onEnd?: () => void) => void;
  listen: () => void;
  transcript: string;
}

export const MemoryRegistration = ({ onComplete, speak, listen, transcript }: Props) => {
  const [status, setStatus] = useState<'reading' | 'listening' | 'finished'>('reading');
  
  // CIST 표준 단어 세트 중 하나 (랜덤 선택 가능)
  const [targetWords] = useState(['비행기', '나무', '모자']);
  const [recordedWords, setRecordedWords] = useState<string[]>([]);

  // 1. 컴포넌트 시작 시 단어 들려주기
  useEffect(() => {
    const instruction = `지금부터 제가 세 가지 단어를 말씀드리겠습니다. 잘 듣고 그대로 따라 해 보세요. ${targetWords.join(', ')}`;
    
    speak(instruction, () => {
      setStatus('listening');
      listen(); // 사용자 복창 대기
    });
  }, []);

  // 2. 사용자 음성 입력 처리
  useEffect(() => {
    if (status === 'listening' && transcript) {
      const foundWords = targetWords.filter(word => transcript.includes(word));
      setRecordedWords(foundWords);
      
      // 3개 단어 중 인식된 개수만큼 점수 부여 (각 1점, 총 3점)
      if (foundWords.length > 0) {
        setTimeout(() => {
          onComplete(foundWords.length, targetWords);
          setStatus('finished');
        }, 2000);
      }
    }
  }, [transcript, status]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold mb-8">기억 등록 (3개 단어)</h2>
      
      {status === 'reading' ? (
        <div className="space-y-4">
          <p className="text-4xl font-extrabold text-blue-600 animate-bounce">단어를 듣고 계십니다...</p>
          <p className="text-2xl text-gray-500">스피커에 귀를 기울여 주세요.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-4xl font-extrabold text-emerald-600">따라 말씀해 주세요!</p>
          <div className="flex gap-4 justify-center mt-4">
            {targetWords.map((word, i) => (
              <div 
                key={i} 
                className={`text-3xl px-6 py-3 rounded-2xl border-4 ${
                  recordedWords.includes(word) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 text-gray-300'
                }`}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};