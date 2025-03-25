"use client";

import { signUp } from "@/app/actions/signupActions";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

// 제출 버튼 컴포넌트
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "계정 생성 중..." : "계정 생성하기"}
    </Button>
  );
}

export default function SignUpPage() {
  // 거래소 선택 상태
  const [useUpbit, setUseUpbit] = useState(false);
  const [useBinance, setUseBinance] = useState(false);

  // 모달 상태
  const [isUpbitModalOpen, setIsUpbitModalOpen] = useState(false);
  const [isBinanceModalOpen, setIsBinanceModalOpen] = useState(false);

  // 폼 상태 관리
  const initialState = { errors: {}, message: null };
  const [formState, formAction] = useFormState(signUp, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">회원가입</CardTitle>
          <CardDescription className="text-gray-400">
            전적검색을 하기 위한 계정을 만드세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formState.errors?._form && (
            <Alert
              variant="destructive"
              className="bg-red-900/50 border-red-800 text-red-300 mb-4"
            >
              <AlertDescription>
                {formState.errors._form.join(", ")}
              </AlertDescription>
            </Alert>
          )}

          {formState.message && (
            <Alert className="bg-green-900/50 border-green-800 text-green-300 mb-4">
              <AlertDescription>{formState.message}</AlertDescription>
            </Alert>
          )}

          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                이메일
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className={`bg-gray-700 border-gray-600 text-white ${
                  formState.errors?.email ? "border-red-500" : ""
                }`}
              />
              {formState.errors?.email && (
                <p className="text-sm text-red-500 mt-1">
                  {formState.errors.email.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                비밀번호
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className={`bg-gray-700 border-gray-600 text-white ${
                  formState.errors?.password ? "border-red-500" : ""
                }`}
              />
              {formState.errors?.password && (
                <p className="text-sm text-red-500 mt-1">
                  {formState.errors.password.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                사용자명
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className={`bg-gray-700 border-gray-600 text-white ${
                  formState.errors?.username ? "border-red-500" : ""
                }`}
              />
              {formState.errors?.username && (
                <p className="text-sm text-red-500 mt-1">
                  {formState.errors.username.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-gray-300">
                표시 이름
              </Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                required
                className={`bg-gray-700 border-gray-600 text-white ${
                  formState.errors?.displayName ? "border-red-500" : ""
                }`}
              />
              {formState.errors?.displayName && (
                <p className="text-sm text-red-500 mt-1">
                  {formState.errors.displayName.join(", ")}
                </p>
              )}
            </div>

            {/* 거래소 선택 */}
            <div className="space-y-2">
              <Label className="text-gray-300 block mb-2">거래소 선택</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="upbit-check"
                    name="useUpbit"
                    checked={useUpbit}
                    onCheckedChange={(checked) => setUseUpbit(!!checked)}
                  />
                  <Label
                    htmlFor="upbit-check"
                    className={`cursor-pointer font-medium ${
                      useUpbit ? "text-blue-400" : "text-gray-400"
                    }`}
                  >
                    Upbit (업비트)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="binance-check"
                    name="useBinance"
                    checked={useBinance}
                    onCheckedChange={(checked) => setUseBinance(!!checked)}
                  />
                  <Label
                    htmlFor="binance-check"
                    className={`cursor-pointer font-medium ${
                      useBinance ? "text-blue-400" : "text-gray-400"
                    }`}
                  >
                    Binance (바이낸스)
                  </Label>
                </div>
              </div>
            </div>

            {/* API 키 입력 섹션 */}
            <div className="space-y-4 mt-4">
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  useUpbit ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {useUpbit && (
                  <div className="space-y-4 p-4 bg-gray-700/30 rounded-md">
                    <h3 className="text-blue-400 text-sm font-medium">
                      Upbit API Keys
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="upbitAccessKey" className="text-gray-300">
                        Upbit Access Key
                      </Label>
                      <Input
                        id="upbitAccessKey"
                        name="upbitAccessKey"
                        type="text"
                        className={`bg-gray-700 border-gray-600 text-white ${
                          formState.errors?.upbitAccessKey
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsUpbitModalOpen(true)}
                        className="text-blue-400 p-0 h-auto text-xs"
                      >
                        [업비트 API 키 발급 방법 알아보기]
                      </Button>
                      {formState.errors?.upbitAccessKey && (
                        <p className="text-sm text-red-500 mt-1">
                          {formState.errors.upbitAccessKey.join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upbitSecretKey" className="text-gray-300">
                        Upbit Secret Key
                      </Label>
                      <Input
                        id="upbitSecretKey"
                        name="upbitSecretKey"
                        type="password"
                        className={`bg-gray-700 border-gray-600 text-white ${
                          formState.errors?.upbitSecretKey
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {formState.errors?.upbitSecretKey && (
                        <p className="text-sm text-red-500 mt-1">
                          {formState.errors.upbitSecretKey.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  useBinance ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {useBinance && (
                  <div className="space-y-4 p-4 bg-gray-700/30 rounded-md">
                    <h3 className="text-blue-400 text-sm font-medium">
                      Binance API Keys
                    </h3>

                    <div className="space-y-2">
                      <Label
                        htmlFor="binanceAccessKey"
                        className="text-gray-300"
                      >
                        Binance Access Key
                      </Label>
                      <Input
                        id="binanceAccessKey"
                        name="binanceAccessKey"
                        type="text"
                        className={`bg-gray-700 border-gray-600 text-white ${
                          formState.errors?.binanceAccessKey
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsBinanceModalOpen(true)}
                        className="text-blue-400 p-0 h-auto text-xs"
                      >
                        [바이낸스 API 키 발급 방법 알아보기]
                      </Button>
                      {formState.errors?.binanceAccessKey && (
                        <p className="text-sm text-red-500 mt-1">
                          {formState.errors.binanceAccessKey.join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="binanceSecretKey"
                        className="text-gray-300"
                      >
                        Binance Secret Key
                      </Label>
                      <Input
                        id="binanceSecretKey"
                        name="binanceSecretKey"
                        type="password"
                        className={`bg-gray-700 border-gray-600 text-white ${
                          formState.errors?.binanceSecretKey
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {formState.errors?.binanceSecretKey && (
                        <p className="text-sm text-red-500 mt-1">
                          {formState.errors.binanceSecretKey.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!useUpbit && !useBinance && (
                <div className="text-center p-4 border border-dashed border-gray-700 rounded-md">
                  <p className="text-gray-400 text-sm">
                    거래소를 선택하면 API 키 입력 필드가 나타납니다.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    나중에 설정에서 언제든지 추가할 수 있습니다.
                  </p>
                </div>
              )}
            </div>

            <SubmitButton />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-700 pt-4">
          <p className="text-gray-400 text-sm">
            이미 계정이 있으신가요?{" "}
            <Link href="/signin" className="text-blue-400 hover:text-blue-300">
              로그인하기
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
