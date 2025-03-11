"use client";

import type React from "react";

import { ApiKeyGuideModal } from "@/app/components/api-key-guide-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [upbitAccessKey, setUpbitAccessKey] = useState("");
  const [upbitSecretKey, setUpbitSecretKey] = useState("");
  const [binanceAccessKey, setBinanceAccessKey] = useState("");
  const [binanceSecretKey, setBinanceSecretKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpbitModalOpen, setIsUpbitModalOpen] = useState(false);
  const [isBinanceModalOpen, setIsBinanceModalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Insert additional user data into the User table
        const { error: insertError } = await supabase.from("User").insert({
          email: data.user.email!,
          username,
          display_name: displayName,
          upbit_access_key: upbitAccessKey,
          upbit_secret_key: upbitSecretKey,
          binance_access_key: binanceAccessKey,
          binance_secret_key: binanceSecretKey,
          password: "", // Note: Don't store plain text password. This is just a placeholder.
        });

        if (insertError) throw insertError;

        router.push("/signin");
      }
    } catch (err) {
      setError("An error occurred during sign up. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Sign Up</CardTitle>
          <CardDescription className="text-gray-400">
            Create your account to start trading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900/50 border-red-800 text-red-300"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-gray-300">
                Display Name
              </Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upbitAccessKey" className="text-gray-300">
                Upbit Access Key
              </Label>
              <Input
                id="upbitAccessKey"
                type="text"
                value={upbitAccessKey}
                onChange={(e) => setUpbitAccessKey(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Button
                type="button"
                variant="link"
                onClick={() => setIsUpbitModalOpen(true)}
                className="text-blue-400"
              >
                [업비트 API 키 발급 방법 알아보기]
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="upbitSecretKey" className="text-gray-300">
                Upbit Secret Key
              </Label>
              <Input
                id="upbitSecretKey"
                type="password"
                value={upbitSecretKey}
                onChange={(e) => setUpbitSecretKey(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="binanceAccessKey" className="text-gray-300">
                Binance Access Key
              </Label>
              <Input
                id="binanceAccessKey"
                type="text"
                value={binanceAccessKey}
                onChange={(e) => setBinanceAccessKey(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Button
                type="button"
                variant="link"
                onClick={() => setIsBinanceModalOpen(true)}
                className="text-blue-400"
              >
                [바이낸스 API 키 발급 방법 알아보기]
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="binanceSecretKey" className="text-gray-300">
                Binance Secret Key
              </Label>
              <Input
                id="binanceSecretKey"
                type="password"
                value={binanceSecretKey}
                onChange={(e) => setBinanceSecretKey(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-700 pt-4">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
      <ApiKeyGuideModal
        isOpen={isUpbitModalOpen}
        onClose={() => setIsUpbitModalOpen(false)}
        exchange="Upbit"
        guideSteps={[
          "1. <a href='https://upbit.com' target='_blank'>업비트</a>에 로그인을 하세요.",
          "2. 상단 > 고객센터를 클릭하세요.",
          "3. Open API 안내를 클릭 후 Open API 사용하기를 클릭하세요.",
          "4. 자산조회, 주문조회 만 선택하세요.",
          "5. Access key, Secret key를 복사하여 아래에 입력하세요.",
        ]}
      />
      <ApiKeyGuideModal
        isOpen={isBinanceModalOpen}
        onClose={() => setIsBinanceModalOpen(false)}
        exchange="Binance"
        guideSteps={[
          "1. 바이낸스 계정에 로그인하고 프로필 아이콘을 클릭한 다음 [Account]을 클릭합니다.",
          "2. [API Management]로 이동한 다음 [Create API]을 클릭합니다.<br /> API 키를 생성하기 전에 다음을 수행해야 합니다: 계정에서 2단계 인증(2FA)을 활성화합니다.<br /> 계정을 활성화하기 위해 스팟 지갑에 원하는 금액을 입금합니다. 신원을 확인해야 합니다.",
          "3. 선호하는 API 키 유형을 선택합니다.",
          "4. API 키의 label/name 을 입력합니다.",
          "5. 2FA 장치와 패스키로 인증합니다.",
          "6. Enable Reading 만 선택합니다.",
          "7. API Key, Secret key를 복사하여 아래에 입력하세요.",
        ]}
      />
    </div>
  );
}
