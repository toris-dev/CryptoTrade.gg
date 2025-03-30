"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            CryptoTrade.GG 소개
          </h1>
          <p className="text-gray-400 leading-relaxed">
            CryptoTrade.GG는 암호화폐 트레이더들을 위한 최고의 분석
            플랫폼입니다. 우리는 실시간 거래 데이터 분석, 포트폴리오 추적,
            그리고 고급 트레이딩 도구를 제공하여 여러분의 거래 성과를 향상시키는
            것을 목표로 합니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-200">우리의 미션</h2>
          <p className="text-gray-400 leading-relaxed">
            암호화폐 시장의 투명성을 높이고, 트레이더들이 더 나은 결정을 내릴 수
            있도록 돕는 것이 우리의 미션입니다. 블록체인 기술을 활용한 투명한
            거래 기록과 실시간 분석을 통해, 우리는 암호화폐 거래의 새로운 표준을
            만들어가고 있습니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-200">핵심 가치</h2>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-blue-400">•</span>
              <span>
                투명성 - 모든 거래 데이터는 블록체인에 기록되어 투명하게
                공개됩니다.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400">•</span>
              <span>
                혁신 - 최신 기술을 활용하여 지속적으로 서비스를 개선합니다.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400">•</span>
              <span>
                커뮤니티 - 전 세계 트레이더들과의 소통과 경험 공유를 장려합니다.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400">•</span>
              <span>
                보안 - 사용자의 데이터 보안과 프라이버시를 최우선으로 합니다.
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
