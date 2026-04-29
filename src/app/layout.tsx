import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "보이스마인드 - 시니어 인지 건강 검사",
  description: "음성 AI로 간편하게 확인하는 나의 뇌 건강",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-[#1A1A1A] antialiased min-h-screen flex flex-col font-['Pretendard']">
        <main className="flex-grow max-w-md mx-auto w-full bg-white shadow-lg overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}