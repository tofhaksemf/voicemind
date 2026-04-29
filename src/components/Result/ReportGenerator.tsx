'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { REPORT_GUIDE } from '../../utils/reportConstants';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportProps {
  data: {
    orientation: number;
    memory: number;
    fluency: number;
    recall: number;
  };
  brainAge: number;
  status: string;
}

export const ReportGenerator = ({ data, brainAge, status }: ReportProps) => {
  const chartData = [
    { subject: '지남력', score: data.orientation, fullMark: 10 },
    { subject: '기억등록', score: data.memory, fullMark: 3 },
    { subject: '언어유창성', score: data.fluency, fullMark: 12 },
    { subject: '지연회상', score: data.recall, fullMark: 5 },
  ];

  const exportPDF = async () => {
    const element = document.getElementById('report-area');
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // PDF 내 이미지 배치
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('보이스마인드_결과리포트.pdf');
  };

  return (
    <div className="p-4 bg-white">
      <div id="report-area" className="p-8 border-2 border-gray-100">
        <h1 className="text-3xl font-bold mb-4">인지 건강 리포트</h1>
        <p className="text-xl">예상 뇌나이: <span className="font-bold text-blue-600">{brainAge}세</span></p>
        <p className={`text-lg font-bold ${status === 'Danger' ? 'text-red-500' : 'text-emerald-500'}`}>
          판정 결과: {status}
        </p>
        
        {/* 방사형 차트 영역 */}
        <div className="h-64 w-full my-8">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name="점수" dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button 
        onClick={exportPDF}
        className="w-full mt-6 bg-emerald-500 text-white text-2xl py-4 rounded-xl active:scale-95 transition-transform"
      >
        PDF 리포트 저장하기
      </button>
    </div>
  );
};
// ... 이전 ReportGenerator 코드에 이어 작성
<div id="report-area" className="p-10 bg-white border border-gray-200">
  {/* 상단: 검사 결과 및 차트 영역 (이전 동일) */}
  
  <div className="mt-10 border-t-2 border-dashed pt-8">
    <h3 className="text-2xl font-bold text-emerald-700 mb-4">전국 치매안심센터 안내</h3>
    <div className="bg-emerald-50 p-6 rounded-2xl mb-8">
      <p className="text-xl font-bold mb-2">{REPORT_GUIDE.centerInfo.contact}</p>
      <p className="text-lg text-gray-700 leading-relaxed">
        {REPORT_GUIDE.centerInfo.desc}<br/>
        {REPORT_GUIDE.centerInfo.website}
      </p>
    </div>

    <h3 className="text-2xl font-bold text-blue-700 mb-4">치매 예방 수칙 3.3.3</h3>
    <ul className="space-y-3">
      {REPORT_GUIDE.prevention.map((item, index) => (
        <li key={index} className="text-lg text-gray-600 flex items-start gap-2">
          <span className="text-blue-500 font-bold">•</span>
          {item}
        </li>
      ))}
    </ul>
    
    <div className="mt-10 text-center text-gray-400 text-sm">
      본 리포트는 보이스마인드(VoiceMind) v1.1에 의해 생성되었습니다.
    </div>
  </div>
</div>