'use client';

import React, { useMemo } from 'react';
import { calculateBrainAge } from '../../utils/brainAge';

interface ResultSummaryProps {
  scores: {
    orientation: number;
    registration: number;
    fluency: number;
    recall: number;
  };
  // 실제 나이와 학력 정보는 나중에 Setup 단계에서 받아오도록 기본값을 설정합니다.
  userAge?: number;
  educationLevel?: 'low' | 'high';
}

export const ResultSummary = ({ 
  scores, 
  userAge = 75, 
  educationLevel = 'high' 
}: ResultSummaryProps) => {

  // 1. 점수 합산 및 30점 만점 비례 환산 (현재 구현된 16점 만점 기준)
  const totalEarned = scores.orientation + scores.registration + scores.fluency + scores.recall;
  const convertedScore = Math.round((totalEarned / 16) * 30);

  // 2. 뇌나이 및 상태 계산
  const result = useMemo(() => {
    return calculateBrainAge({
      score: convertedScore,
      realAge: userAge,
      educationLevel: educationLevel,
      averageResponseTime: 2.5, // 가점 기준인 3초 이내로 임시 설정
    });
  }, [convertedScore, userAge, educationLevel]);

  // 3. 결과 상태별 UI 설정
  const statusConfig = {
    Normal: {
      label: '정상',
      color: '#10B981', // Emerald 500
      bgColor: '#ECFDF5',
      desc: '인지 건강 상태가 매우 좋습니다! 꾸준한 운동과 사회 활동을 유지해 주세요.'
    },
    MCI: {
      label: '경도인지장애 의심',
      color: '#F59E0B', // Amber 500
      bgColor: '#FFFBEB',
      desc: '인지 기능이 다소 저하된 상태입니다. 가까운 치매안심센터 방문을 권장합니다.'
    },
    Danger: {
      label: '치매 위험',
      color: '#EF4444', // Red 500
      bgColor: '#FEF2F2',
      desc: '정밀 검사가 필요한 상태입니다. 즉시 전문의 또는 치매안심센터와 상담하세요.'
    }
  };

  const config = statusConfig[result.status];

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-[40px] shadow-xl border-t-[12px]"
         style={{ borderColor: config.color }}>
      
      <p className="text-[24pt] font-bold text-gray-500 mb-2">나의 예상 뇌나이</p>
      
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-[64pt] font-black" style={{ color: config.color }}>
          {result.calculatedAge}
        </span>
        <span className="text-[32pt] font-bold text-gray-700">세</span>
      </div>

      <div className="px-10 py-4 rounded-full mb-8" style={{ backgroundColor: config.bgColor }}>
        <p className="text-[28pt] font-extrabold" style={{ color: config.color }}>
          {config.label}
        </p>
      </div>

      <div className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 text-left">
        <p className="text-[22pt] font-bold text-gray-800 mb-3">💡 맞춤 조언</p>
        <p className="text-[20pt] text-gray-600 leading-snug break-keep">
          {config.desc}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-2xl">
          <p className="text-[16pt] text-gray-500">환산 점수</p>
          <p className="text-[22pt] font-bold">{convertedScore} / 30점</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-2xl">
          <p className="text-[16pt] text-gray-500">실제 나이</p>
          <p className="text-[22pt] font-bold">{userAge}세</p>
        </div>
      </div>
    </div>
  );
};