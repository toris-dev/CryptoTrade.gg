"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "개인정보의 수집 및 이용 목적",
      content:
        "CryptoTrade.gg는 다음과 같은 목적으로 개인정보를 수집합니다:\n\n" +
        "• 서비스 제공 및 계약 이행\n" +
        "• 사용자 인증 및 보안\n" +
        "• API 키 관리 및 거래소 연동\n" +
        "• 서비스 개선 및 사용자 경험 향상\n" +
        "• 고객 지원 및 문의 응대",
    },
    {
      title: "수집하는 개인정보 항목",
      content:
        "• 필수항목: 이메일, 비밀번호, 사용자명\n" +
        "• 선택항목: API 키, 지갑 주소\n" +
        "• 자동수집항목: IP 주소, 쿠키, 서비스 이용 기록",
    },
    {
      title: "개인정보의 보유 및 이용기간",
      content:
        "회원 탈퇴 시까지 또는 법정 보유기간\n" +
        "단, API 키는 암호화되어 저장되며, 사용자가 직접 삭제할 때까지 보관됩니다.",
    },
    {
      title: "개인정보의 파기절차 및 방법",
      content:
        "회원 탈퇴 시 즉시 파기\n" +
        "단, API 키는 암호화된 상태로 30일간 보관 후 파기",
    },
    {
      title: "이용자 및 법정대리인의 권리와 행사방법",
      content:
        "• 개인정보 열람 요청\n" +
        "• 오류 정정 요청\n" +
        "• 삭제 요청\n" +
        "• 처리정지 요청",
    },
    {
      title: "개인정보 보호를 위한 안전성 확보 조치",
      content:
        "• API 키 암호화 저장\n" +
        "• 접근 권한 관리\n" +
        "• 보안 프로그램 설치 및 주기적 점검\n" +
        "• 해킹 등 외부 침입 방지",
    },
    {
      title: "개인정보 처리방침 변경",
      content: "변경사항 발생 시 웹사이트 공지사항을 통해 고지",
    },
    {
      title: "개인정보 보호책임자",
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
          <h1 className="text-4xl font-bold mb-4">개인정보 처리방침</h1>
          <p className="text-gray-400 text-lg">
            CryptoTrade.gg는 사용자의 개인정보 보호를 위해 최선을 다하고
            있습니다.
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
