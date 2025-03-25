"use client";

import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  className?: string;
}

export default function LottieAnimation({
  animationData,
  loop = true,
  className,
}: LottieAnimationProps) {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      className={className}
      style={{ maxWidth: "400px", margin: "0 auto" }}
    />
  );
}
