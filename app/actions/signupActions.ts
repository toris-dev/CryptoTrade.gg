"use server";

import { createSupabaseClient } from "@/lib/supabase/server";
import { saveApiKeys } from "@/lib/utils/api-keys";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type SignUpFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    username?: string[];
    displayName?: string[];
    upbitAccessKey?: string[];
    upbitSecretKey?: string[];
    binanceAccessKey?: string[];
    binanceSecretKey?: string[];
    walletAddress?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function signUp(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;
    const displayName = formData.get('displayName') as string;
    const useUpbit = formData.get('useUpbit') === 'on';
    const useBinance = formData.get('useBinance') === 'on';
    const upbitAccessKey = formData.get('upbitAccessKey') as string || '';
    const upbitSecretKey = formData.get('upbitSecretKey') as string || '';
    const binanceAccessKey = formData.get('binanceAccessKey') as string || '';
    const binanceSecretKey = formData.get('binanceSecretKey') as string || '';
    const walletAddress = formData.get('walletAddress') as string || '';
    const walletType = formData.get('walletType') as string || '';
    
    // 유효성 검사
    const errors: SignUpFormState['errors'] = {};
    
    if (!email || !email.includes('@')) {
      errors.email = ['유효한 이메일 주소를 입력해주세요'];
    }
    
    if (!password) {
      errors.password = ['비밀번호를 입력해주세요'];
    } else if (password.length < 6) {
      errors.password = ['비밀번호는 6자 이상이어야 합니다'];
    } else if (password.length > 72) {
      errors.password = ['비밀번호는 72자를 초과할 수 없습니다'];
    }
    
    if (!username) {
      errors.username = ['사용자명을 입력해주세요'];
    }
    
    if (!displayName) {
      errors.displayName = ['표시 이름을 입력해주세요'];
    }
    
    if (useUpbit && !upbitAccessKey) {
      errors.upbitAccessKey = ['업비트를 선택한 경우 API 키가 필요합니다'];
    }
    
    if (useUpbit && !upbitSecretKey) {
      errors.upbitSecretKey = ['업비트를 선택한 경우 Secret 키가 필요합니다'];
    }
    
    if (useBinance && !binanceAccessKey) {
      errors.binanceAccessKey = ['바이낸스를 선택한 경우 API 키가 필요합니다'];
    }
    
    if (useBinance && !binanceSecretKey) {
      errors.binanceSecretKey = ['바이낸스를 선택한 경우 Secret 키가 필요합니다'];
    }
    
    if (Object.keys(errors).length > 0) {
      return { errors, success: false };
    }
    
    // 서버 측 Supabase 클라이언트 가져오기
    const supabase = createSupabaseClient();
    
    // Supabase auth 회원가입 (원본 비밀번호 사용)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName,
          wallet_address: walletAddress,
          wallet_type: walletType,
        },
      },
    });

    if (error) {
      if (error.message.includes("Password")) {
        return {
          errors: {
            password: ['비밀번호가 너무 길거나 형식이 올바르지 않습니다 (최대 72자)']
          },
          success: false
        };
      }
      throw error;
    }
    
    if (data.user) {
      // User 테이블에 추가 데이터 저장 (비밀번호 제외)
      const { error: insertError } = await supabase.from("User").insert({
        email: data.user.email!,
        username,
        display_name: displayName,
        wallet_address: walletAddress,
        wallet_type: walletType,
        wallet_connected: walletAddress ? true : false,
        last_wallet_connection: walletAddress ? new Date().toISOString() : null,
      });
      
      if (insertError) throw insertError;

      // API 키 암호화 저장
      if (useUpbit || useBinance) {
        await saveApiKeys(
          data.user.id,
          useUpbit ? upbitAccessKey : undefined,
          useUpbit ? upbitSecretKey : undefined,
          useBinance ? binanceAccessKey : undefined,
          useBinance ? binanceSecretKey : undefined
        );
      }
      
      // 캐시 갱신 및 리디렉션
      revalidatePath('/signin');
      redirect('/signin');
    }
    
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
