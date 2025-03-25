"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
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
            이용약관
          </h1>
          <p className="text-gray-400 leading-relaxed">
            본 약관은 CryptoTrade.GG(이하 '회사')가 제공하는 서비스의 이용과
            관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로
            합니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-200">
            1. 서비스의 제공 및 변경
          </h2>
          <div className="space-y-4 text-gray-400">
            <p>회사는 다음과 같은 서비스를 제공합니다:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>암호화폐 거래 분석 및 통계 서비스</li>
              <li>트레이딩 성과 추적 서비스</li>
              <li>커뮤니티 서비스</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-200">
            2. 회원의 의무
          </h2>
          <div className="space-y-4 text-gray-400">
            <p>회원은 다음 사항을 준수해야 합니다:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>실명 및 실제 정보를 제공할 의무</li>
              <li>개인정보 및 계정 보안 유지 의무</li>
              <li>타인의 권리를 침해하거나 법령을 위반하지 않을 의무</li>
              <li>서비스 이용 관련 규정 준수 의무</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-200">
            3. 서비스 이용제한
          </h2>
          <p className="text-gray-400 leading-relaxed">
            회사는 회원이 이용약관을 위반하거나 서비스의 정상적인 운영을 방해한
            경우, 서비스 이용을 제한하거나 정지할 수 있습니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-200">4. 면책조항</h2>
          <p className="text-gray-400 leading-relaxed">
            회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인
            사유로 인한 서비스 중단에 대해 책임을 지지 않습니다. 또한, 회원의
            귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-200">
            5. 준거법 및 관할법원
          </h2>
          <p className="text-gray-400 leading-relaxed">
            본 약관은 대한민국 법률에 따라 규율되며, 서비스 이용으로 발생한
            분쟁에 대해 소송이 제기될 경우 회사의 본사 소재지를 관할하는 법원을
            전속관할법원으로 합니다.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
