import { useLocation } from "wouter";
import { motion } from "framer-motion";

/**
 * PIXEL ONE 홈페이지
 * 
 * 디자인 철학: 미니멀리스트 모던
 * - 극도의 단순성: 모든 요소가 목적을 가짐
 * - 정밀한 정렬: 중앙 정렬 구조
 * - 공간의 힘: 여백을 적극 활용
 * - 흑백 기조: 명확성과 전문성
 */

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-4">
      {/* 메인 콘텐츠 */}
      <div className="flex flex-col items-center gap-8">
        {/* 회사 타이틀 */}
        <h1 className="text-5xl font-bold text-white tracking-tight">
          PIXEL ONE
        </h1>

        {/* 픽셀 로고 및 잔상 */}
        <div className="relative flex items-center justify-center mt-16 h-12">
          {/* 잔상 3 (가장 흐림) */}
          <motion.div
            className="absolute w-3 h-3 bg-white/10"
            animate={{ y: [0, -60, 0] }}
            transition={{
              duration: 1.0,
              repeat: Infinity,
              ease: "linear",
              delay: 0.15,
            }}
          />
          {/* 잔상 2 */}
          <motion.div
            className="absolute w-3 h-3 bg-white/30"
            animate={{ y: [0, -60, 0] }}
            transition={{
              duration: 1.0,
              repeat: Infinity,
              ease: "linear",
              delay: 0.1,
            }}
          />
          {/* 잔상 1 (가장 진함) */}
          <motion.div
            className="absolute w-3 h-3 bg-white/50"
            animate={{ y: [0, -60, 0] }}
            transition={{
              duration: 1.0,
              repeat: Infinity,
              ease: "linear",
              delay: 0.05,
            }}
          />
          {/* 메인 픽셀 */}
          <motion.div
            className="relative w-3 h-3 bg-white shadow-[0_0_10px_white]"
            animate={{
              y: [0, -60, 0],
            }}
            transition={{
              duration: 1.0,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* 설명 텍스트 */}
        <p className="text-gray-400 text-center max-w-sm text-lg">
          for pixel perfect
        </p>
      </div>

      {/* 하단 개인정보처리방침 링크 */}
      <div className="absolute bottom-8">
        <button
          onClick={() => setLocation("/privacy")}
          className="text-gray-400 hover:text-gray-100 transition-colors duration-300 text-sm underline underline-offset-4 hover:no-underline"
        >
          개인정보처리방침
        </button>
      </div>
    </div>
  );
}
