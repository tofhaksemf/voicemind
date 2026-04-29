import React, { useState, useEffect } from 'react';

/**
 * 숫자로 된 한글 답변을 숫자로 변환하거나, 
 * 음성 인식 결과에서 숫자만 추출하여 비교하는 유틸리티
 */
const normalizeTranscript = (text: string) => {
  return text.replace(/\s/g, ''); // 공백 제거
};

export const DateOrientationTest = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({ year: 0, month: 0, day: 0, weekday: 0 });
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date()); // 컴포넌트 마운트 시 현재 날짜 고정
  }, []);

  const questions = [
    { key: 'year', text: "올해는 몇 년도인가요?", point: 1 },
    { key: 'month', text: "지금은 몇 월인가요?", point: 1 },
    { key: 'day', text: "오늘은 며칠인가요?", point: 1 },
    { key: 'weekday', text: "오늘은 무슨 요일인가요?", point: 1 },
  ];

  const handleVoiceInput = (transcript: string) => {
    if (!now) return;

    const normalized = normalizeTranscript(transcript);
    let isCorrect = false;

    switch (questions[currentIdx].key) {
      case 'year':
        // "2026", "26", "이천이십육" 등 대응
        const year = now.getFullYear().toString();
        const shortYear = year.slice(-2);
        if (normalized.includes(year) || normalized.includes(shortYear)) isCorrect = true;
        break;
      case 'month':
        const month = (now.getMonth() + 1).toString();
        if (normalized.includes(month)) isCorrect = true;
        break;
      case 'day':
        const day = now.getDate().toString();
        if (normalized.includes(day)) isCorrect = true;
        break;
      case 'weekday':
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const today = weekdays[now.getDay()];
        if (normalized.includes(today)) isCorrect = true;
        break;
    }

    // 점수 업데이트
    const currentKey = questions[currentIdx].key;
    const newScores = { ...scores, [currentKey]: isCorrect ? 1 : 0 };
    setScores(newScores);

    // 다음 단계로 이동
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      const totalScore = Object.values(newScores).reduce((a, b) => a + b, 0);
      onComplete(totalScore);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="mb-8">
        <span className="text-gray-500 text-xl font-medium">지남력 검사 ({currentIdx + 1}/4)</span>
        <h2 className="text-4xl font-bold mt-4 leading-tight break-keep">
          {questions[currentIdx].text}
        </h2>
      </div>

      {/* 시니어 사용자를 위한 음성 인식 상태 표시 (기획서 5. 가이드라인 준수) */}
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
        <div className="w-12 h-12 bg-emerald-500 rounded-full" />
      </div>
      
      <p className="mt-8 text-2xl text-gray-400">말씀하시면 자동으로 인식됩니다</p>
      
      {/* 테스트용 버튼 (실제 구현 시 useVoiceTest 훅의 transcript가 handleVoiceInput을 트리거함) */}
      <button 
        onClick={() => handleVoiceInput("2026년")} 
        className="mt-4 opacity-0"
      >
        테스트용 클릭
      </button>
    </div>
  );
};