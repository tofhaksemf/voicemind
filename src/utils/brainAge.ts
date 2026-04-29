/**
 * brainAge.ts
 * 기획서 3.2 뇌나이 산출 공식 로직 구현
 */

interface BrainAgeInput {
  score: number;        // 검사 점수 (0~30)
  realAge: number;     // 실제 나이
  educationLevel: 'low' | 'high'; // low: 무학 또는 초등 중퇴 이하
  averageResponseTime: number;    // 평균 응답 속도 (초)
}

export const calculateBrainAge = ({
  score,
  realAge,
  educationLevel,
  averageResponseTime,
}: BrainAgeInput) => {
  let finalScore = score;

  // 1. 학력 보정: 무학 또는 초등 중퇴 이하일 경우 +4점 가산
  if (educationLevel === 'low') {
    finalScore = Math.min(30, finalScore + 4);
  }

  let calculatedAge: number;
  let status: 'Normal' | 'MCI' | 'Danger';

  // 2. 산출 로직
  if (finalScore >= 24) {
    // 정상 (24~30점): 실제 나이 - (점수 - 24) (최저 실제나이 - 5세)
    status = 'Normal';
    calculatedAge = realAge - (finalScore - 24);
    calculatedAge = Math.max(realAge - 5, calculatedAge);
  } else if (finalScore >= 20) {
    // 경도인지장애 의심 (20~23점): 실제 나이 + (24 - 점수) * 2
    status = 'MCI';
    calculatedAge = realAge + (24 - finalScore) * 2;
  } else {
    // 치매 위험 (19점 이하): 실제 나이 + 15 (최대 99세)
    status = 'Danger';
    calculatedAge = Math.min(99, realAge + 15);
  }

  // 3. 반응 속도 가점: 평균 응답 속도가 3초 이내일 경우 뇌나이 -1세
  if (averageResponseTime <= 3) {
    calculatedAge -= 1;
  }

  return {
    finalScore,
    calculatedAge: Math.floor(calculatedAge),
    status,
  };
};