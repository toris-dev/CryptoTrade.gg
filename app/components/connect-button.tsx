"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface ConnectButtonProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export function ConnectButton({
  isConnected: externalIsConnected,
  setIsConnected: externalSetIsConnected,
}: ConnectButtonProps) {
  // 컴포넌트 내부 상태
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 초기에 로딩 상태로 시작
  const [mounted, setMounted] = useState(false);
  const [internalIsConnected, setInternalIsConnected] = useState(false);

  // 내부 상태가 변경될 때 외부 상태도 업데이트
  useEffect(() => {
    if (mounted) {
      externalSetIsConnected(internalIsConnected);
    }
  }, [internalIsConnected, mounted, externalSetIsConnected]);

  // 마운트 감지
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 초기 상태 확인
  useEffect(() => {
    if (!mounted) return;

    const checkConnection = async () => {
      const manuallyDisconnected =
        localStorage.getItem("walletDisconnected") === "true";

      if (!manuallyDisconnected) {
        await checkIfWalletIsConnected();
      } else {
        setInternalIsConnected(false);
        setWalletAddress(null);
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [mounted]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        Swal.fire({
          title: "메타마스크 필요",
          text: "메타마스크 설치가 필요합니다.",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#3085d6",
          background: "#1e293b",
          color: "#fff",
        });
        setIsLoading(false);
        return;
      }

      // 연결된 계정 확인
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        Swal.fire({
          title: "연결 상태",
          text: `연결된 계정: ${account.substring(0, 6)}...${account.substring(
            account.length - 4
          )}`,
          icon: "info",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#1e293b",
          color: "#fff",
        });
        setWalletAddress(account);
        setInternalIsConnected(true);
        // 연결됨 상태 저장
        localStorage.setItem("walletDisconnected", "false");
      } else {
        Swal.fire({
          title: "연결 상태",
          text: "연결된 계정이 없습니다.",
          icon: "info",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#1e293b",
          color: "#fff",
        });
        setInternalIsConnected(false);
      }
    } catch (error) {
      console.error("지갑 연결 확인 중 오류 발생:", error);

      Swal.fire({
        title: "연결 오류",
        text: "지갑 연결 확인 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#3085d6",
        background: "#1e293b",
        color: "#fff",
      });

      setInternalIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        Swal.fire({
          title: "메타마스크 필요",
          text: "지갑을 연결하려면 메타마스크를 설치하세요!",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#3085d6",
          background: "#1e293b",
          color: "#fff",
        });
        setIsLoading(false);
        return;
      }

      // 연결 상태 저장
      localStorage.setItem("walletDisconnected", "false");

      // 계정 요청
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("연결된 계정:", accounts[0]);
      setWalletAddress(accounts[0]);
      setInternalIsConnected(true);

      // 연결 성공 알림
      Swal.fire({
        title: "지갑 연결 성공",
        text: `${accounts[0].substring(0, 6)}...${accounts[0].substring(
          accounts[0].length - 4
        )} 계정이 연결되었습니다.`,
        icon: "success",
        confirmButtonText: "확인",
        confirmButtonColor: "#3085d6",
        background: "#1e293b",
        color: "#fff",
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
      });

      // 계정 변경 리스너
      ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletAddress(null);
          setInternalIsConnected(false);
          // 연결 해제 상태 저장
          localStorage.setItem("walletDisconnected", "true");

          Swal.fire({
            title: "계정 연결 해제됨",
            text: "지갑 계정이 연결 해제되었습니다.",
            icon: "info",
            confirmButtonText: "확인",
            confirmButtonColor: "#3085d6",
            background: "#1e293b",
            color: "#fff",
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          setWalletAddress(accounts[0]);
          setInternalIsConnected(true);
          // 연결됨 상태 저장
          localStorage.setItem("walletDisconnected", "false");

          Swal.fire({
            title: "계정 변경됨",
            text: `${accounts[0].substring(0, 6)}...${accounts[0].substring(
              accounts[0].length - 4
            )} 계정으로 변경되었습니다.`,
            icon: "info",
            confirmButtonText: "확인",
            confirmButtonColor: "#3085d6",
            background: "#1e293b",
            color: "#fff",
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      });
    } catch (error) {
      console.error("지갑 연결 중 오류 발생:", error);

      Swal.fire({
        title: "연결 실패",
        text: "지갑 연결 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#3085d6",
        background: "#1e293b",
        color: "#fff",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    // 상태 초기화
    setWalletAddress(null);
    setInternalIsConnected(false);

    // 로컬 스토리지에 연결 해제 상태 저장
    localStorage.setItem("walletDisconnected", "true");

    // 이벤트 리스너 제거 (메모리 누수 방지)
    const { ethereum } = window as any;
    if (ethereum && ethereum.removeListener) {
      ethereum.removeListener("accountsChanged", () => {});
    }

    Swal.fire({
      title: "지갑 연결 해제됨",
      html: `
        <p>지갑 연결이 해제되었습니다.</p>
        <p class="text-sm mt-2 text-gray-300">완전히 연결을 끊으려면 메타마스크 확장 프로그램에서 수동으로 연결 해제하세요.</p>
      `,
      icon: "info",
      confirmButtonText: "확인",
      confirmButtonColor: "#3085d6",
      background: "#1e293b",
      color: "#fff",
    });
  };

  // 초기 로딩 중 상태
  if (!mounted || isLoading) {
    return (
      <Button disabled className="bg-slate-600 hover:bg-slate-600">
        <Wallet className="mr-2 h-4 w-4 animate-pulse" />
        지갑 확인 중...
      </Button>
    );
  }

  return (
    <div>
      {internalIsConnected && walletAddress ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-green-400 hidden sm:inline">
            {`${walletAddress.substring(0, 6)}...${walletAddress.substring(
              walletAddress.length - 4
            )}`}
          </span>
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500/10"
            onClick={disconnectWallet}
          >
            연결 해제
          </Button>
        </div>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 transition-all duration-300"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isLoading ? "연결 중..." : "지갑 연결하기"}
        </Button>
      )}
    </div>
  );
}
