"use client";

import { Logo } from "@/app/components/logo";
import { Button } from "@/components/ui/button";
import cryptoAnimation from "@/public/crypto-animation.json";
import tradingAnimation from "@/public/trading-animation.json";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

// Lottie 컴포넌트를 동적으로 임포트
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
      {/* 배경 파티클 효과 */}
      <div className="absolute inset-0 overflow-hidden">
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

      {/* 메인 콘텐츠 */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen"
        >
          {/* 로고 섹션 */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="mb-16"
          >
            <Logo />
          </motion.div>

          {/* 애니메이션 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col justify-center gap-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Next Generation
                <br />
                Trading Platform
              </h1>
              <p className="text-lg md:text-xl text-blue-600/70 dark:text-blue-400/70">
                Experience the future of crypto trading with real-time analytics
                and advanced Web3 integration.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleExplore}
                  className="w-full md:w-auto text-lg px-8 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Start Trading
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="w-full h-[400px] relative">
                <Suspense fallback={<div>Loading...</div>}>
                  <LottieAnimation
                    animationData={tradingAnimation}
                    loop={true}
                    className="w-full h-full"
                  />
                </Suspense>
              </div>
            </motion.div>
          </div>

          {/* 특징 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl"
          >
            {[
              {
                title: "Real-time Analytics",
                description: "Track your portfolio with advanced analytics",
                animation: cryptoAnimation,
              },
              {
                title: "Secure Trading",
                description: "Enterprise-grade security for your assets",
                animation: cryptoAnimation,
              },
              {
                title: "Web3 Integration",
                description: "Seamless blockchain integration",
                animation: cryptoAnimation,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-blue-200/20"
              >
                <div className="h-32 mb-4">
                  <Suspense fallback={<div>Loading...</div>}>
                    <LottieAnimation
                      animationData={feature.animation}
                      loop={true}
                      className="w-full h-full"
                    />
                  </Suspense>
                </div>
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {feature.title}
                </h3>
                <p className="text-blue-600/70 dark:text-blue-400/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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
          className="w-6 h-6 border-2 border-blue-400 rounded-full"
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
            className="w-2 h-2 bg-blue-400 rounded-full mx-auto mt-1"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
