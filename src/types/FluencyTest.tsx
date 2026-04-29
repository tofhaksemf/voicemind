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