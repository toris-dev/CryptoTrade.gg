"use client";

import { Logo } from "@/app/components/logo";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChartIcon,
  DiscordLogoIcon,
  GitHubLogoIcon,
  GlobeIcon,
  LockClosedIcon,
  RocketIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";

export function Footer() {
  const features = [
    {
      icon: <BarChartIcon className="w-5 h-5" />,
      title: "실시간 거래 통계",
      description: "상세한 분석과 인사이트로 암호화폐 거래 성과를 추적하세요",
    },
    {
      icon: <LockClosedIcon className="w-5 h-5" />,
      title: "안전한 투명성",
      description: "블록체인 기술로 구현된 완벽한 보안과 투명성을 경험하세요",
    },
    {
      icon: <GlobeIcon className="w-5 h-5" />,
      title: "글로벌 커뮤니티",
      description: "전 세계 트레이더들과 소통하고 함께 성장하세요",
    },
    {
      icon: <RocketIcon className="w-5 h-5" />,
      title: "고급 분석 도구",
      description: "거래 패턴을 심층 분석하고 전략을 개선하세요",
    },
  ];

  const socialLinks = [
    {
      icon: <GitHubLogoIcon className="w-5 h-5" />,
      href: "https://github.com/toris-dev",
      label: "GitHub",
    },
    {
      icon: <TwitterLogoIcon className="w-5 h-5" />,
      href: "https://x.com/toris0224787154",
      label: "Twitter",
    },
    {
      icon: <DiscordLogoIcon className="w-5 h-5" />,
      href: "https://discord.gg/65fkTyfN",
      label: "Discord",
    },
  ];

  return (
    <footer className="relative border-t bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-gray-900/50 dark:to-gray-950/80 dark:border-gray-800/50 backdrop-blur-xl animated-bg">
      <div className="absolute inset-0 bg-grid-blue/[0.02] dark:bg-grid-white/[0.02] bg-[size:32px]" />
      <div className="container relative mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-2">
              {socialLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="relative group"
                  asChild
                >
                  <Link href={link.href} aria-label={link.label}>
                    <span className="absolute inset-0 rounded-full bg-blue-500/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <span className="relative text-blue-600/70 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-primary transition-colors">
                      {link.icon}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <TooltipProvider delayDuration={200}>
              {features.map((feature, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group flex items-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-100/80 dark:bg-gray-800/50 text-blue-600 dark:text-primary group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-primary transition-all duration-300">
                        {feature.icon}
                      </div>
                      <span className="text-sm font-medium text-blue-600/70 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-primary transition-colors">
                        {feature.title}
                      </span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={4}
                    className="bg-white dark:bg-gray-900/95 border border-blue-100 dark:border-gray-800 text-blue-600/90 dark:text-gray-300 text-xs px-3 py-2"
                  >
                    {feature.description}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-blue-100 dark:border-gray-800/50">
            <div className="flex flex-wrap gap-6 text-xs">
              {["소개", "개인정보처리방침", "이용약관"].map((text, index) => (
                <Link
                  key={index}
                  href={["about", "privacy", "terms"][index]}
                  className="text-blue-600/70 dark:text-gray-400 hover:text-blue-600 dark:hover:text-primary transition-colors relative group"
                >
                  <span className="relative z-10">{text}</span>
                  <span className="absolute inset-x-0 -bottom-0.5 h-px bg-blue-500 dark:bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </div>
            <p className="text-blue-500/70 dark:text-gray-500 text-xs">
              © {new Date().getFullYear()} CryptoTrade.GG
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
