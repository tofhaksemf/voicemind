'use client';
import { useSearchParams } from 'next/navigation';

// @/ 대신 상대 경로(../../)를 사용하여 직접 파일을 찾아갑니다.
import { ResultSummary } from '../../components/Result/ResultSummary';
import { ReportGenerator } from '../../components/Result/ReportGenerator';

export default function ResultPage() {
  const searchParams = useSearchParams();
  
  // URL에서 점수 데이터 추출
  const testScores = {
    orientation: Number(searchParams.get('orientation')),
    registration: Number(searchParams.get('registration')),
    fluency: Number(searchParams.get('fluency')),
    recall: Number(searchParams.get('recall')),
  };

  return (
    <div className="min-h-full bg-gray-50 pb-20">
      <div className="p-6">
        <h1 className="text-[32pt] font-black mb-8 text-center mt-10">검사 결과 리포트</h1>
        
        {/* 결과 요약 컴포넌트 (뇌나이 계산 포함) */}
        <ResultSummary scores={testScores} />

        {/* PDF 생성 및 차트 영역 */}
        <div className="mt-10">
          <ReportGenerator data={testScores} />
        </div>

        {/* 공유 유도 (기획서 4번 User Flow 반영) */}
        <div className="mt-10 p-6 bg-white rounded-3xl shadow-md border border-gray-100 text-center">
          <p className="text-[20pt] font-bold text-gray-700 mb-4">자녀에게 검사 결과 공유하기</p>
          <button className="w-full bg-[#FAE100] text-[#3C1E1E] text-[22pt] font-bold py-5 rounded-2xl">
            카카오톡으로 보내기
          </button>
        </div>
      </div>
    </div>
  );
}