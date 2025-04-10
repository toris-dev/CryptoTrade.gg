"use client";

import { Button } from "@/components/ui/button";
import { signInWithWallet } from "@/lib/auth";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AuthForm() {
  const [loading, setLoading] = useState(false);

  const handleWalletAuth = async () => {
    setLoading(true);
    try {
      await signInWithWallet();
      toast.success("지갑 연결에 성공했습니다!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-blue-200/20">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        지갑 연결
      </h2>

      <div className="space-y-4">
        <p className="text-center text-blue-600/70 dark:text-blue-400/70">
          Web3 지갑을 연결하여 서비스를 이용해보세요
        </p>

        <Button
          onClick={handleWalletAuth}
          disabled={loading}
          className="w-full py-6 text-base bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "연결 중..." : "지갑 연결하기"}
        </Button>

        <div className="text-sm text-center text-blue-600/50 dark:text-blue-400/50 mt-4">
          MetaMask, Kaikas, Phantom 지갑을 지원합니다
        </div>
      </div>
    </div>
  );
}
