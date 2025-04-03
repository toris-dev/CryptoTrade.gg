"use client";

import { motion } from "framer-motion";

export default function TermsOfService() {
  const sections = [
    {
      title: "서비스 소개",
      content:
        "CryptoTrade.gg는 암호화폐 거래소의 거래 내역을 통합 관리하고 분석할 수 있는 서비스입니다.\n\n" +
        "• 다중 거래소 지원 (Upbit, Binance)\n" +
        "• 실시간 거래 내역 동기화\n" +
        "• 거래 분석 및 리포트\n" +
        "• API 키 보안 관리",
    },
    {
      title: "서비스 이용 조건",
      content:
        "• 18세 이상의 대한민국 거주자\n" +
        "• 유효한 이메일 주소 보유\n" +
        "• 거래소 API 키 보유 (선택사항)\n" +
        "• 본 약관 동의",
    },
    {
      title: "API 키 관리",
      content:
        "• API 키는 암호화되어 저장됩니다\n" +
        "• 사용자는 언제든지 API 키를 삭제할 수 있습니다\n" +
        "• API 키 유출 시 즉시 재발급을 받아야 합니다\n" +
        "• API 키 관련 문제는 사용자가 책임집니다",
    },
    {
      title: "데이터 사용",
      content:
        "• 수집된 거래 데이터는 서비스 제공에만 사용됩니다\n" +
        "• 제3자에게 데이터를 제공하지 않습니다\n" +
        "• 사용자는 언제든지 데이터 삭제를 요청할 수 있습니다",
    },
    {
      title: "금지 행위",
      content:
        "• 서비스의 무단 복제 및 배포\n" +
        "• 해킹 및 보안 취약점 악용\n" +
        "• 다른 사용자의 계정 도용\n" +
        "• 서비스 장애 유발 행위",
    },
    {
      title: "면책 조항",
      content:
        "• 거래소 서비스 장애로 인한 손실\n" +
        "• API 키 유출로 인한 손실\n" +
        "• 천재지변 등 불가항력적 사유로 인한 서비스 중단\n" +
        "• 사용자의 귀책사유로 인한 서비스 이용의 장애",
    },
    {
      title: "서비스 변경 및 중단",
      content:
        "• 서비스 내용 변경 시 30일 전 고지\n" +
        "• 긴급한 경우 즉시 중단 가능\n" +
        "• 서비스 중단 시 미사용 요금 환불",
    },
    {
      title: "약관 변경",
      content:
        "• 변경사항 발생 시 웹사이트 공지\n" +
        "• 변경된 약관은 공지 후 30일부터 효력 발생\n" +
        "• 변경된 약관에 동의하지 않을 경우 서비스 이용 중단",
    },
    {
      title: "준거법 및 관할",
      content:
        "• 본 약관은 대한민국 법을 준거법으로 합니다\n" +
        "• 서비스 이용으로 발생한 분쟁은 서울중앙지방법원을 전속관할로 합니다",
    },
    {
      title: "문의처",
      content: "이름: Toris\n" + "이메일: ",
      email: "ironjustlikethat@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">이용약관</h1>
          <p className="text-gray-400 text-lg">
            CryptoTrade.gg 서비스 이용약관입니다.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                {section.title}
              </h2>
              <div className="text-gray-300 whitespace-pre-line">
                {section.content}
                {section.email && (
                  <a
                    href={`mailto:${section.email}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    {section.email}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-gray-400"
        >
          <p>최종 수정일: 2024년 4월 3일</p>
        </motion.div>
      </div>
    </div>
  );
}
