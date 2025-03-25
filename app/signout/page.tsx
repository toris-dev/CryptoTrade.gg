"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOutPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
      router.push("/");
    };

    signOut();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">
            로그아웃 중
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 text-center">
            로그아웃 처리 중입니다. 홈페이지로 이동합니다...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
