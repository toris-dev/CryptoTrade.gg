"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { ethers } from "ethers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type SignUpFormState = {
  errors?: {
    username?: string[];
    displayName?: string[];
    walletAddress?: string[];
    signature?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
  nonce?: string;
};

export async function generateNonce(): Promise<string> {
  return ethers.utils.hexlify(ethers.utils.randomBytes(32));
}

export async function signUp(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  try {
    const username = formData.get('username') as string;
    const displayName = formData.get('displayName') as string;
    const walletAddress = formData.get('walletAddress') as string;
    const signature = formData.get('signature') as string;
    const nonce = formData.get('nonce') as string;
    
    // 유효성 검사
    const errors: SignUpFormState['errors'] = {};
    
    if (!username) {
      errors.username = ['사용자명을 입력해주세요'];
    }
    
    if (!displayName) {
      errors.displayName = ['표시 이름을 입력해주세요'];
    }
    
    if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
      errors.walletAddress = ['유효한 이더리움 지갑 주소를 입력해주세요'];
    }
    
    if (!signature) {
      errors.signature = ['지갑 서명이 필요합니다'];
    }
    
    if (!nonce) {
      errors._form = ['유효하지 않은 요청입니다'];
      return { errors, success: false };
    }
    
    if (Object.keys(errors).length > 0) {
      return { errors, success: false };
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
    
    // 서버 측 Supabase 클라이언트 가져오기
    const supabase = createSupabaseClient();
    
    // 이미 등록된 지갑 주소인지 확인
    const { data: existingUser } = await supabase
      .from("User")
      .select("id")
      .eq("wallet_address", walletAddress)
      .single();
    
    if (existingUser) {
      return {
        errors: {
          walletAddress: ['이미 등록된 지갑 주소입니다']
        },
        success: false
      };
    }
    
    // 사용자 생성
    const userId = crypto.randomUUID();
    const { error: insertError } = await supabase
      .from("User")
      .insert({
        id: userId,
        username,
        display_name: displayName,
        wallet_address: walletAddress,
        wallet_type: 'metamask',
        nonce: null,
        last_signed_in: new Date().toISOString(),
        thumbnail_img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      });
    
    if (insertError) throw insertError;
    
    // 캐시 갱신 및 리디렉션
    revalidatePath('/signin');
    redirect('/signin');
    
    return {
      message: "계정이 성공적으로 생성되었습니다. 로그인 페이지로 이동합니다.",
      success: true
    };
  } catch (err: any) {
    console.error(err);
    return {
      errors: {
        _form: [err.message || '계정 생성 중 오류가 발생했습니다']
      },
      success: false
    };
  }
}
