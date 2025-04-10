"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { ethers } from "ethers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type SignInFormState = {
  errors?: {
    walletAddress?: string[];
    signature?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
  nonce?: string;
};

export async function getNonce(walletAddress: string): Promise<SignInFormState> {
  try {
    const supabase = createSupabaseClient();
    
    // 지갑 주소로 사용자 찾기
    const { data: user, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();
    
    if (userError) {
      return {
        errors: {
          walletAddress: ['등록되지 않은 지갑 주소입니다']
        },
        success: false
      };
    }
    
    // 새로운 nonce 생성 및 저장
    const nonce = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    
    const { error: updateError } = await supabase
      .from("User")
      .update({ nonce })
      .eq("id", user.id);
    
    if (updateError) throw updateError;
    
    return {
      success: true,
      nonce
    };
  } catch (err: any) {
    console.error(err);
    return {
      errors: {
        _form: [err.message || 'Nonce 생성 중 오류가 발생했습니다']
      },
      success: false
    };
  }
}

export async function verifySignature(
  walletAddress: string,
  signature: string,
  nonce: string
): Promise<SignInFormState> {
  try {
    const supabase = createSupabaseClient();
    
    // 지갑 주소로 사용자 찾기
    const { data: user, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();
    
    if (userError || !user) {
      return {
        errors: {
          walletAddress: ['등록되지 않은 지갑 주소입니다']
        },
        success: false
      };
    }
    
    // nonce 검증
    if (user.nonce !== nonce) {
      return {
        errors: {
          _form: ['유효하지 않은 nonce입니다']
        },
        success: false
      };
    }
    
    // 서명 검증
    const message = `Welcome to CryptoTrade.gg!\n\nNonce: ${nonce}`;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return {
        errors: {
          signature: ['유효하지 않은 서명입니다']
        },
        success: false
      };
    }
    
    // 사용자 세션 생성
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: `${walletAddress.toLowerCase()}@wallet.cryptotrade.gg`, // 지갑 주소를 이용한 가상 이메일
      password: nonce, // 임시 비밀번호로 nonce 사용
    });
    
    if (authError) throw authError;
    
    // nonce 초기화 및 마지막 로그인 시간 업데이트
    const { error: updateError } = await supabase
      .from("User")
      .update({
        nonce: null,
        last_signed_in: new Date().toISOString()
      })
      .eq("id", user.id);
    
    if (updateError) throw updateError;
    
    // 캐시 갱신 및 리디렉션
    revalidatePath('/');
    redirect('/');
    
    return {
      message: "로그인 성공",
      success: true
    };
  } catch (err: any) {
    console.error(err);
    return {
      errors: {
        _form: [err.message || '로그인 중 오류가 발생했습니다']
      },
      success: false
    };
  }
} 