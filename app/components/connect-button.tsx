"use client";

import { Button } from "@/components/ui/button";
import { type WalletType } from "@/lib/utils/wallet";
import { ethers } from "ethers";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

declare global {
  interface Window {
    ethereum?: any;
    klaytn: any;
    solana: any;
  }
}

interface ConnectButtonProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

interface WalletInfo {
  address: string | null;
  type: WalletType | null;
}

const SIGN_MESSAGE =
  "Welcome to CryptoTrade.gg! Click to sign in and accept the Terms of Service.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.";

export function ConnectButton({
  isConnected: externalIsConnected,
  setIsConnected: externalSetIsConnected,
}: ConnectButtonProps) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: null,
    type: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [internalIsConnected, setInternalIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      await disconnectWallet();
    } else {
      await handleSuccessfulConnection(
        accounts[0],
        walletInfo.type as WalletType
      );
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
      const walletAddress = localStorage.getItem("wallet_address");
      const walletType = localStorage.getItem("wallet_type") as WalletType;

      if (!walletAddress || !walletType) {
        setInternalIsConnected(false);
        setWalletInfo({ address: null, type: null });
        return;
      }

      const { ethereum } = window as any;
      const { klaytn } = window as any;
      const solana = (window as any).solana;

      // Check if wallet is still connected based on type
      switch (walletType) {
        case "ethereum":
          if (ethereum) {
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (
              accounts.length > 0 &&
              accounts[0].toLowerCase() === walletAddress.toLowerCase()
            ) {
              handleSuccessfulConnection(accounts[0], "ethereum");
              return;
            }
          }
          break;
        case "klaytn":
          if (klaytn) {
            const accounts = await klaytn.enable();
            if (
              accounts.length > 0 &&
              accounts[0].toLowerCase() === walletAddress.toLowerCase()
            ) {
              handleSuccessfulConnection(accounts[0], "klaytn");
              return;
            }
          }
          break;
        case "solana":
          if (solana?.isPhantom) {
            const resp = await solana.connect({ onlyIfTrusted: true });
            if (resp.publicKey && resp.publicKey.toString() === walletAddress) {
              handleSuccessfulConnection(resp.publicKey.toString(), "solana");
              return;
            }
          }
          break;
      }

      // If we get here, the wallet is no longer connected
      setInternalIsConnected(false);
      setWalletInfo({ address: null, type: null });
      localStorage.removeItem("wallet_address");
      localStorage.removeItem("wallet_type");
    } catch (error) {
      console.error("지갑 연결 확인 중 오류 발생:", error);
      handleConnectionError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEthereumConnection = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask가 설치되어 있지 않습니다.");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Create message
      const message = `Welcome to CryptoTrade.gg!\n\nPlease sign this message to verify your wallet ownership.\n\nWallet: ${address.toLowerCase()}\nTimestamp: ${Date.now()}`;

      try {
        // Request signature
        const signature = await signer.signMessage(message);
        console.log("Signature:", signature);

        // Verify signature
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
          throw new Error("서명이 올바르지 않습니다.");
        }

        // Sign in with wallet
        const response = await fetch("/api/auth/wallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: address.toLowerCase(),
            signature,
            message,
            type: "ethereum",
            chainId: await provider
              .getNetwork()
              .then((network) => network.chainId.toString()),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "인증 서버 오류가 발생했습니다.");
        }

        const data = await response.json();
        await handleSuccessfulConnection(address, "ethereum");
      } catch (error: any) {
        if (error.code === 4001) {
          throw new Error("서명이 거부되었습니다.");
        }
        throw error;
      }
    } catch (error: any) {
      throw error;
    }
  };

  const connectWallet = async () => {
    if (isConnecting) {
      Swal.fire({
        title: "연결 중",
        text: "이미 지갑 연결이 진행 중입니다. MetaMask를 확인해주세요.",
        icon: "info",
        customClass: {
          popup: "swal-custom-popup !bg-slate-800 !text-white",
          title: "!text-white",
          htmlContainer: "!text-white",
          confirmButton: "!bg-blue-500 !text-white hover:!bg-blue-600",
        },
      });
      return;
    }

    try {
      setIsConnecting(true);
      setIsLoading(true);

      const { ethereum } = window as any;
      const { klaytn } = window as any;
      const solana = (window as any).solana;

      // Show wallet selection dialog
      const { value: walletType } = await Swal.fire({
        title: "지갑 선택",
        html: `
          <div class="flex flex-col gap-4 mt-4">
            <div class="flex items-center gap-2">
              <input type="radio" id="ethereum" name="wallet-type" value="ethereum" class="w-4 h-4">
              <label for="ethereum" class="cursor-pointer flex items-center gap-2">
                <img src="/metamask-logo.svg" alt="MetaMask" class="h-6 w-6" />
                MetaMask (Ethereum)
              </label>
            </div>
            <div class="flex items-center gap-2">
              <input type="radio" id="klaytn" name="wallet-type" value="klaytn" class="w-4 h-4">
              <label for="klaytn" class="cursor-pointer flex items-center gap-2">
                <img src="/kaikas-logo.svg" alt="Kaikas" class="h-6 w-6" />
                Kaikas (Klaytn)
              </label>
            </div>
            <div class="flex items-center gap-2">
              <input type="radio" id="solana" name="wallet-type" value="solana" class="w-4 h-4">
              <label for="solana" class="cursor-pointer flex items-center gap-2">
                <img src="/phantom-logo.svg" alt="Phantom" class="h-6 w-6" />
                Phantom (Solana)
              </label>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "연결",
        cancelButtonText: "취소",
        customClass: {
          popup: "swal-custom-popup !bg-slate-800 !text-white",
          title: "!text-white",
          htmlContainer: "!text-white",
          confirmButton: "!bg-blue-500 !text-white hover:!bg-blue-600",
          cancelButton: "!bg-gray-500 !text-white hover:!bg-gray-600",
        },
        preConfirm: () => {
          const selectedWallet = document.querySelector(
            'input[name="wallet-type"]:checked'
          ) as HTMLInputElement;
          if (!selectedWallet) {
            Swal.showValidationMessage("지갑을 선택해주세요");
            return false;
          }
          return selectedWallet.value;
        },
      });

      if (!walletType) {
        setIsConnecting(false);
        setIsLoading(false);
        return;
      }

      try {
        switch (walletType as WalletType) {
          case "ethereum":
            await handleEthereumConnection();
            break;

          case "klaytn":
            if (window.klaytn) {
              const accounts = await window.klaytn.enable();
              if (accounts[0]) {
                await handleSuccessfulConnection(accounts[0], "klaytn");
              }
            } else {
              throw new Error("Kaikas가 설치되어 있지 않습니다.");
            }
            break;

          case "solana":
            if (window.solana?.isPhantom) {
              const resp = await window.solana.connect();
              await handleSuccessfulConnection(
                resp.publicKey.toString(),
                "solana"
              );
            } else {
              throw new Error("Phantom이 설치되어 있지 않습니다.");
            }
            break;
        }
      } catch (error: any) {
        if (error.code === -32002) {
          Swal.fire({
            title: "연결 진행 중",
            text: "이미 지갑 연결이 진행 중입니다. 지갑을 확인해주세요.",
            icon: "info",
            customClass: {
              popup: "swal-custom-popup !bg-slate-800 !text-white",
              title: "!text-white",
              htmlContainer: "!text-white",
              confirmButton: "!bg-blue-500 !text-white hover:!bg-blue-600",
            },
          });
        } else {
          handleConnectionError(error.message);
        }
      }
    } catch (error: any) {
      console.error("지갑 연결 중 오류 발생:", error);
      handleConnectionError(
        error.message || "지갑 연결 중 오류가 발생했습니다."
      );
    } finally {
      setIsConnecting(false);
      setIsLoading(false);
    }
  };

  const handleConnectionError = (
    errorMessage: string = "지갑 연결 중 오류가 발생했습니다."
  ) => {
    setInternalIsConnected(false);
    setWalletInfo({ address: null, type: null });
    localStorage.removeItem("wallet_address");
    localStorage.removeItem("wallet_type");

    Swal.fire({
      title: "연결 오류",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "확인",
      confirmButtonColor: "#3085d6",
      customClass: {
        popup: "swal-custom-popup !bg-slate-800 !text-white",
        title: "!text-white",
        htmlContainer: "!text-white",
        confirmButton: "!bg-blue-500 !text-white hover:!bg-blue-600",
      },
    });
  };

  const setupWalletListeners = (walletType: WalletType) => {
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
      case "ethereum":
        ethereum?.on("accountsChanged", handleAccountsChanged);
        break;
      case "klaytn":
        klaytn?.on("accountsChanged", handleAccountsChanged);
        break;
      case "solana":
        solana?.on("disconnect", () => {
          handleAccountsChanged([]);
        });
        break;
    }
  };

  const handleSuccessfulConnection = async (
    address: string,
    type: WalletType
  ) => {
    try {
      setWalletInfo({ address, type });
      setInternalIsConnected(true);
      localStorage.setItem("wallet_address", address.toLowerCase());
      localStorage.setItem("wallet_type", type);
      localStorage.removeItem("walletDisconnected");

      setupWalletListeners(type);

      // Show success message
      Swal.fire({
        title: "연결 성공",
        text: "지갑이 성공적으로 연결되었습니다.",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#1e293b",
        color: "#fff",
      });
    } catch (error) {
      console.error("Error in handleSuccessfulConnection:", error);
      handleConnectionError("지갑 연결 중 오류가 발생했습니다.");
    }
  };

  const disconnectWallet = async () => {
    try {
      setInternalIsConnected(false);
      setWalletInfo({ address: null, type: null });
      localStorage.setItem("walletDisconnected", "true");
      localStorage.removeItem("wallet_address");
      localStorage.removeItem("wallet_type");

      // Remove wallet-specific listeners
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

      // Show success message
      Swal.fire({
        title: "연결 해제",
        text: "지갑 연결이 해제되었습니다.",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#1e293b",
        color: "#fff",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      handleConnectionError("지갑 연결 해제 중 오류가 발생했습니다.");
    }
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
          {isLoading ? "연결 중..." : "로그인"}
        </Button>
      )}
    </div>
  );
}
