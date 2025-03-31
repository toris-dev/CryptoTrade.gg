"use client";

import { Logo } from "@/app/components/logo";
import { TradeHistory } from "@/app/components/trade-history";
import { Button } from "@/components/ui/button";
import cryptoAnimation from "@/public/crypto-animation.json";
import tradingAnimation from "@/public/trading-animation.json";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

// Lottie 애니메이션을 클라이언트 사이드에서만 로드
const LottieAnimation = dynamic(
  () => import("@/app/components/LottieAnimation"),
  {
    ssr: false, // 서버 사이드 렌더링 비활성화
  }
);

export default function IntroPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const [isVisible, setIsVisible] = useState(false);

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleExplore = () => {
    router.push("/home");
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black relative overflow-hidden py-4"
    >
      {/* 동적 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particles-container">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.random() * 400 - 200],
                y: [0, Math.random() * 400 - 200],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: "4px",
                height: "4px",
                backgroundColor: `rgba(59, 130, 246, ${Math.random() * 0.5})`,
                borderRadius: "50%",
              }}
            />
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16 min-h-screen flex flex-col items-center justify-center"
        >
          {/* 로고 */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="mb-6 sm:mb-10 lg:mb-16 w-40 sm:w-48 lg:w-56 hover:scale-105 transition-transform duration-300"
          >
            <Logo />
          </motion.div>

          {/* 소개 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 w-full max-w-7xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col justify-center gap-4 sm:gap-6 order-2 lg:order-1 text-center lg:text-left px-4 sm:px-6 lg:px-0"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 leading-tight">
                새로운 시대의&nbsp;
                <br className="hidden sm:block" />
                트레이딩 전적&nbsp;
                <br className="hidden sm:block" />
                플랫폼
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-blue-600/70 dark:text-blue-400/70 max-w-2xl mx-auto lg:mx-0">
                실시간 분석과 Web3 기술이 결합된
                <br className="hidden sm:block" />
                투자 전적 플랫폼
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 sm:mt-8"
              >
                <Button
                  onClick={handleExplore}
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  투자 전적 검색하기
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative order-1 lg:order-2 flex items-center justify-center"
            >
              <div className="w-full h-full absolute">
                <Suspense
                  fallback={<div className="text-center">로딩중...</div>}
                >
                  <LottieAnimation
                    animationData={tradingAnimation}
                    loop={true}
                    className="w-full h-full"
                  />
                </Suspense>
              </div>
            </motion.div>
          </div>

          {/* 주요 기능 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            {[
              {
                title: "실시간 분석",
                description:
                  "고급 분석 도구로 투자 포트폴리오를 실시간 모니터링하여 최적의 투자 결정을 지원합니다",
                animation: cryptoAnimation,
              },
              {
                title: "빠른 전적 검색",
                description:
                  "손쉽게 투자자들의 전적을 검색하고 분석하여 신뢰할 수 있는 투자 정보를 제공합니다",
                animation: cryptoAnimation,
              },
              {
                title: "Web3 통합",
                description:
                  "블록체인 기술과의 원활한 통합으로 투명하고 안전한 거래 기록을 보장합니다",
                animation: cryptoAnimation,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-blue-200/20 flex flex-col items-center sm:items-start text-center sm:text-left hover:bg-white/20 transition-all duration-300"
              >
                <div className="h-24 sm:h-32 mb-6 w-full max-w-[180px] mx-auto">
                  <Suspense
                    fallback={<div className="text-center">로딩중...</div>}
                  >
                    <LottieAnimation
                      animationData={feature.animation}
                      loop={true}
                      className="w-full h-full"
                    />
                  </Suspense>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-blue-600/70 dark:text-blue-400/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* 스크롤 안내 표시 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-4 sm:w-6 h-4 sm:h-6 border-2 border-blue-400 rounded-full"
        >
          <motion.div
            animate={{
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full mx-auto mt-0.5 sm:mt-1"
          />
        </motion.div>
      </motion.div>

      <TradeHistory />
    </div>
  );
}
