"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
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
            개인정보처리방침
          </h1>
          <p className="text-gray-400 leading-relaxed">
            CryptoTrade.GG(이하 '회사')는 이용자의 개인정보를 중요시하며,
            「개인정보 보호법」등 관련 법령을 준수하고 있습니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-200">
            1. 수집하는 개인정보 항목
          </h2>
          <div className="space-y-4 text-gray-400">
            <p>회사는 다음과 같은 개인정보를 수집하고 있습니다:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>필수항목: 이메일 주소, 암호화폐 지갑 주소</li>
              <li>선택항목: 닉네임, 프로필 이미지</li>
              <li>자동수집항목: IP 주소, 접속 로그, 서비스 이용 기록</li>
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
            2. 개인정보의 수집 및 이용목적
          </h2>
          <div className="space-y-4 text-gray-400">
            <p>회사는 수집한 개인정보를 다음의 목적을 위해 이용합니다:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>서비스 제공 및 계약의 이행</li>
              <li>회원 관리 및 서비스 이용 분석</li>
              <li>신규 서비스 개발 및 마케팅</li>
              <li>보안 및 프라이버시 보호</li>
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
            3. 개인정보의 보유 및 이용기간
          </h2>
          <p className="text-gray-400 leading-relaxed">
            회사는 회원탈퇴 시 또는 수집/이용목적을 달성하거나 보유/이용기간이
            종료한 경우, 사전 동의를 받은 경우를 제외하고 해당 정보를 지체 없이
            파기합니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-200">
            4. 이용자 권리와 행사방법
          </h2>
          <p className="text-gray-400 leading-relaxed">
            이용자는 개인정보 조회, 수정, 삭제, 처리정지 요구 등의 권리를 행사할
            수 있습니다. 권리 행사는 회사에 대해 서면, 전화, 전자우편 등을
            통하여 하실 수 있습니다.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
