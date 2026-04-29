'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
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