import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import APP_CONFIGS from "../appConfigs";

/**
 * PIXEL ONE 홈페이지
 *
 * 디자인: 몽환적 우주 테마
 * - Three.js 별 유영 배경
 * - 글로우 & 그래디언트 타이포그래피
 * - 부드러운 등장 애니메이션
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const glowPulseAnimate = {
  textShadow: [
    "0 0 20px rgba(120, 140, 255, 0.3), 0 0 60px rgba(120, 140, 255, 0.1)",
    "0 0 30px rgba(120, 140, 255, 0.5), 0 0 80px rgba(120, 140, 255, 0.2)",
    "0 0 20px rgba(120, 140, 255, 0.3), 0 0 60px rgba(120, 140, 255, 0.1)",
  ],
};

const glowPulseTransition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const appEntries = Object.entries(APP_CONFIGS);

  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center justify-center p-4 overflow-hidden relative">

      {/* 메인 콘텐츠 */}
      <motion.div
        className="flex flex-col items-center gap-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 로고 심볼 */}
        <motion.div
          variants={itemVariants}
          className="mb-2"
        >
          {/* 보석 글로우 후광 */}
          <motion.span
            className="absolute text-3xl inline-block"
            style={{
              background: "linear-gradient(135deg, #a78bfa, #60a5fa, #f0abfc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "blur(8px)",
              opacity: 0.5,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ◆
          </motion.span>
          {/* 메인 보석 */}
          <motion.span
            className="relative text-3xl inline-block"
            style={{
              background: "linear-gradient(135deg, #c4b5fd, #93c5fd, #f0abfc, #a78bfa)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              filter: [
                "drop-shadow(0 0 8px rgba(167, 139, 250, 0.4)) drop-shadow(0 0 20px rgba(96, 165, 250, 0.2))",
                "drop-shadow(0 0 16px rgba(96, 165, 250, 0.7)) drop-shadow(0 0 40px rgba(240, 171, 252, 0.4))",
                "drop-shadow(0 0 12px rgba(240, 171, 252, 0.5)) drop-shadow(0 0 30px rgba(167, 139, 250, 0.3))",
                "drop-shadow(0 0 8px rgba(167, 139, 250, 0.4)) drop-shadow(0 0 20px rgba(96, 165, 250, 0.2))",
              ],
              scale: [1, 1.15, 1.05, 1.15, 1],
              rotate: [0, 3, -3, 2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ◆
          </motion.span>
        </motion.div>

        {/* 회사 타이틀 */}
        <motion.h1
          variants={itemVariants}
          className="title-gradient text-5xl sm:text-6xl md:text-7xl font-bold tracking-widest"
        >
          <motion.span
            animate={glowPulseAnimate}
            transition={glowPulseTransition}
          >
            PIXEL ONE
          </motion.span>
        </motion.h1>

        {/* 구분선 */}
        <motion.div
          variants={itemVariants}
          className="w-16 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.5), transparent)",
          }}
        />

        {/* 설명 텍스트 */}
        <motion.p
          variants={itemVariants}
          className="text-gray-400 text-center max-w-sm text-lg tracking-[0.3em] uppercase"
          style={{
            fontFamily: "'Space Grotesk', 'IBM Plex Mono', monospace",
          }}
        >
          for pixel perfect
        </motion.p>
      </motion.div>

      {/* 하단 개인정보처리방침 드롭업 메뉴 */}
      <motion.div
        ref={menuRef}
        className="absolute bottom-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        {/* 드롭업 팝오버 */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="privacy-popover"
              initial={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 10, scale: 0.95, x: "-50%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {appEntries.map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setLocation(`/privacy?app=${key}`);
                  }}
                  className="privacy-popover-item"
                >
                  {config.appName.replace(/'/g, "")}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 트리거 버튼 */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="privacy-dot"
          aria-label="개인정보처리방침"
        >
          <span className="privacy-ripple" style={{ animationDelay: "0s" }} />
          <span className="privacy-ripple" style={{ animationDelay: "1s" }} />
          <span className="privacy-ripple" style={{ animationDelay: "2s" }} />
          ■
        </button>
      </motion.div>
    </div>
  );
}

