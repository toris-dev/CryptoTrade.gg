"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface ConnectButtonProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export function ConnectButton({
  isConnected,
  setIsConnected,
}: ConnectButtonProps) {
  const handleConnect = () => {
    // Here you would typically interact with a Web3 provider like MetaMask
    setIsConnected(!isConnected);
  };

  return (
    <Button
      onClick={handleConnect}
      className={`transition-all duration-300 ${
        isConnected
          ? "bg-green-500 hover:bg-green-600"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnected ? "Connected" : "Connect Wallet"}
    </Button>
  );
}
