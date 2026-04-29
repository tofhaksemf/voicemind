import React, { useState, useEffect, useCallback } from 'react';

// 동물 이름 중복 체크 및 타이머 로직
export const FluencyTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [seconds, setSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [animalList, setAnimalList] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');

  // 1. 타이머 관리
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    } else if (seconds === 0) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  // 2. 음성 인식 및 중복 필터링 로직
  const processTranscript = useCallback((text: string) => {
    // 공백으로 단어 분리 (예: "사자 호랑이 사자" -> ["사자", "호랑이", "사자"])
    const words = text.split(' ').filter(word => word.length > 1);
    
    setAnimalList((prev) => {
      const newList = [...prev];
      words.forEach(word => {
        if (!newList.includes(word)) { // 중복 필터링
          newList.push(word);
        }
      });
      return newList;
    });
  }, []);

  const handleFinish = () => {
    setIsRunning(false);
    // 보통 CIST/MMSE-DS 기준에 따른 점수 변환 로직이 필요하나, 
    // 기획서에 따라 "나열된 개수"를 기반으로 점수를 산출합니다.
    onComplete(animalList.length); 
  };

  const startTest = () => {
    setIsRunning(true);
    // Web Speech API 호출 (앞서 만든 useVoiceTest 활용 가능)
    // 여기서는 예시로 시작 로직만 표기합니다.
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-4xl font-bold text-red-500">
        남은 시간: {seconds}초
      </div>
      
      <div className="w-full bg-gray-100 p-6 rounded-2xl min-h-[200px]">
        <p className="text-gray-500 mb-2">인식된 동물들:</p>
        <div className="flex flex-wrap gap-2">
          {animalList.map((animal, index) => (
            <span key={index} className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xl font-semibold">
              {animal}
            </span>
          ))}
        </div>
      </div>

      {!isRunning && seconds === 60 ? (
        <button 
          onClick={startTest}
          className="w-full py-6 bg-emerald-500 text-white text-3xl rounded-3xl font-bold active:scale-95"
        >
          검사 시작
        </button>
      ) : (
        <p className="text-2xl text-gray-600 animate-pulse">동물 이름을 계속 말씀해 주세요...</p>
      )}
    </div>
  );
};

/**
 * 언어 유창성 점수 변환 함수
 * 표준 CIST 배점 기준 적용
 */
const calculateFluencyScore = (count: number): number => {
  if (count >= 15) return 6;
  if (count >= 13) return 5;
  if (count >= 11) return 4;
  if (count >= 9)  return 3;
  if (count >= 7)  return 2;
  if (count >= 5)  return 1;
  return 0;
};

// ... FluencyTest 컴포넌트 내부 handleFinish 수정
const handleFinish = () => {
  setIsRunning(false);
  
  // 1. 중복 제거된 동물 리스트의 개수 확인
  const uniqueCount = animalList.length;
  
  // 2. 표준 CIST 기준에 따른 점수 산출
  const finalScore = calculateFluencyScore(uniqueCount);
  
  // 3. 결과 전달 (기획서 3.1 & 3.2 연동)
  onComplete(finalScore); 
  
  console.log(`나열한 동물: ${uniqueCount}마리, 최종 점수: ${finalScore}점`);
};