"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface ConnectButtonProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

interface WalletInfo {
  address: string | null;
  type: "metamask" | "kaikas" | "phantom" | null;
}

export function ConnectButton({
  isConnected: externalIsConnected,
  setIsConnected: externalSetIsConnected,
}: ConnectButtonProps) {
  const supabase = createClientComponentClient();
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: null,
    type: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [internalIsConnected, setInternalIsConnected] = useState(false);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      handleSuccessfulConnection(accounts[0], walletInfo.type);
    }
  };

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
        setWalletInfo({ address: null, type: null });
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [mounted]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      const { klaytn } = window as any;
      const solana = (window as any).solana;

      // Check MetaMask
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
          handleSuccessfulConnection(accounts[0], "metamask");
          return;
        }
      }

      // Check Kaikas
      if (klaytn) {
        const accounts = await klaytn.enable();
        if (accounts.length !== 0) {
          handleSuccessfulConnection(accounts[0], "kaikas");
          return;
        }
      }

      // Check Phantom
      if (solana?.isPhantom) {
        const resp = await solana.connect({ onlyIfTrusted: true });
        if (resp.publicKey) {
          handleSuccessfulConnection(resp.publicKey.toString(), "phantom");
          return;
        }
      }

      setInternalIsConnected(false);
      setWalletInfo({ address: null, type: null });
    } catch (error) {
      console.error("지갑 연결 확인 중 오류 발생:", error);
      handleConnectionError();
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window as any;
      const { klaytn } = window as any;
      const solana = (window as any).solana;

      // Show wallet selection dialog
      const { value: walletType } = await Swal.fire({
        title: "지갑 선택",
        input: "radio",
        inputOptions: {
          metamask: "MetaMask (이더리움)",
          kaikas: "Kaikas (클레이튼)",
          phantom: "Phantom (솔라나)",
        },
        inputValidator: (value) => {
          if (!value) {
            return "지갑을 선택해주세요!";
          }
          return null;
        },
        background: "#1e293b",
        color: "#fff",
      });

      switch (walletType) {
        case "metamask":
          if (!ethereum) {
            window.open("https://metamask.io/download/", "_blank");
            throw new Error("MetaMask를 설치해주세요!");
          }
          const ethAccounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          handleSuccessfulConnection(ethAccounts[0], "metamask");
          break;

        case "kaikas":
          if (!klaytn) {
            window.open(
              "https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi",
              "_blank"
            );
            throw new Error("Kaikas를 설치해주세요!");
          }
          const klaytnAccounts = await klaytn.enable();
          handleSuccessfulConnection(klaytnAccounts[0], "kaikas");
          break;

        case "phantom":
          if (!solana?.isPhantom) {
            window.open("https://phantom.app/", "_blank");
            throw new Error("Phantom을 설치해주세요!");
          }
          const resp = await solana.connect();
          handleSuccessfulConnection(resp.publicKey.toString(), "phantom");
          break;
      }

      // Set up event listeners for the selected wallet
      setupWalletListeners(walletType);
    } catch (error) {
      console.error("지갑 연결 중 오류 발생:", error);
      handleConnectionError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectionError = () => {
    setInternalIsConnected(false);
    setWalletInfo({ address: null, type: null });

    Swal.fire({
      title: "연결 오류",
      text: "지갑 연결 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#3085d6",
      background: "#1e293b",
      color: "#fff",
    });
  };

  const setupWalletListeners = (walletType: string) => {
    const { ethereum } = window as any;
    const { klaytn } = window as any;
    const solana = (window as any).solana;

    // Remove existing listeners
    if (ethereum?.removeListener) {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
    }
    if (klaytn?.removeListener) {
      klaytn.removeListener("accountsChanged", handleAccountsChanged);
    }
    if (solana?.removeListener) {
      solana.removeListener("disconnect", () => {});
    }

    // Add new listeners based on wallet type
    switch (walletType) {
      case "metamask":
        ethereum?.on("accountsChanged", handleAccountsChanged);
        break;
      case "kaikas":
        klaytn?.on("accountsChanged", handleAccountsChanged);
        break;
      case "phantom":
        solana?.on("disconnect", () => {
          handleAccountsChanged([]);
        });
        break;
    }
  };

  const handleSuccessfulConnection = async (
    address: string,
    type: WalletInfo["type"]
  ) => {
    setWalletInfo({ address, type });
    setInternalIsConnected(true);
    localStorage.setItem("walletDisconnected", "false");
    localStorage.setItem("walletType", type || "");

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("사용자 정보 가져오기 실패:", userError);
      return;
    }

    if (user) {
      // Update auth metadata
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: {
          wallet_address: address,
          wallet_type: type,
        },
      });

      if (updateAuthError) {
        console.error("Auth 메타데이터 업데이트 실패:", updateAuthError);
      }

      // Update User table
      const { error: updateUserError } = await supabase
        .from("User")
        .update({
          wallet_address: address,
          wallet_type: type,
          wallet_connected: true,
          last_wallet_connection: new Date().toISOString(),
        })
        .eq("email", user.email);

      if (updateUserError) {
        console.error("User 테이블 업데이트 실패:", updateUserError);
      }
    }

    Swal.fire({
      title: "연결 상태",
      text: `${type?.toUpperCase()} 지갑 연결됨: ${address.substring(
        0,
        6
      )}...${address.substring(address.length - 4)}`,
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#1e293b",
      color: "#fff",
    });
  };

  const disconnectWallet = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!userError && user) {
      // Update auth metadata
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: {
          wallet_address: null,
          wallet_type: null,
        },
      });

      if (updateAuthError) {
        console.error("Auth 메타데이터 업데이트 실패:", updateAuthError);
      }

      // Update User table
      const { error: updateUserError } = await supabase
        .from("User")
        .update({
          wallet_address: null,
          wallet_type: null,
          wallet_connected: false,
          last_wallet_connection: null,
        })
        .eq("email", user.email);

      if (updateUserError) {
        console.error("User 테이블 업데이트 실패:", updateUserError);
      }
    }

    setWalletInfo({ address: null, type: null });
    setInternalIsConnected(false);
    localStorage.setItem("walletDisconnected", "true");
    localStorage.removeItem("walletType");

    // Remove all wallet listeners
    const { ethereum } = window as any;
    const { klaytn } = window as any;
    const solana = (window as any).solana;

    if (ethereum?.removeListener) {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
    }
    if (klaytn?.removeListener) {
      klaytn.removeListener("accountsChanged", handleAccountsChanged);
    }
    if (solana?.removeListener) {
      solana.removeListener("disconnect", () => {});
    }

    Swal.fire({
      title: "지갑 연결 해제됨",
      html: `
        <p>지갑 연결이 해제되었습니다.</p>
        <p class="text-sm mt-2 text-gray-300">완전히 연결을 끊으려면 지갑 확장 프로그램에서 수동으로 연결 해제하세요.</p>
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
      {internalIsConnected && walletInfo.address ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-green-400 hidden sm:inline">
            {`${walletInfo.address.substring(
              0,
              6
            )}...${walletInfo.address.substring(
              walletInfo.address.length - 4
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
