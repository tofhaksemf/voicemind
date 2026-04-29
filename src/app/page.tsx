'use client';
import Link from 'next/link';

export default function IntroPage() {
  return (
    <div className="flex flex-col items-center justify-between h-full p-8 text-center">
      <div className="mt-20">
        <h1 className="text-[32pt] font-black text-emerald-600 leading-tight mb-4">
          보이스마인드
        </h1>
        <p className="text-[24pt] text-gray-600 font-medium break-keep">
          목소리로 확인하는<br/>나의 뇌 건강 검사
        </p>
      </div>

      <div className="w-full space-y-6 mb-10">
        <div className="bg-gray-100 p-6 rounded-[24px]">
          <p className="text-[18pt] text-gray-500 mb-2">시작 전 확인해주세요</p>
          <p className="text-[22pt] font-bold">마이크 권한을 허용해주세요</p>
        </div>
        
        <Link href="/test" className="block">
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-[28pt] font-bold py-6 rounded-[30px] transition-transform active:scale-95 shadow-xl">
            검사 시작하기
          </button>
        </Link>
      </div>
    </div>
  );
}