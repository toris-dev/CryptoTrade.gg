import { createSupabaseClient } from "@/lib/supabase/server";
import { AuthError } from "@supabase/supabase-js";

export async function signIn(
  email: string, 
  password: string, 
  walletAddress?: string, 
  walletType?: string
) {
  try {
    // 비밀번호 길이 검증
    if (password.length > 72) {
      return {
        success: false,
        error: "비밀번호는 72자를 초과할 수 없습니다",
      };
    }

    const supabase = createSupabaseClient();

    // Supabase Auth로 직접 로그인 (원본 비밀번호 사용)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
      console.log(error)
      if (error.message.includes("Password")) {
        throw new Error("비밀번호가 너무 길거나 형식이 올바르지 않습니다 (최대 72자)");
      }
      throw error;
    }

    // 지갑 정보가 제공된 경우 업데이트
    if (walletAddress && walletType && data.user) {
      // Auth 메타데이터 업데이트
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: {
          wallet_address: walletAddress,
          wallet_type: walletType,
        },
      });

      if (updateAuthError) {
        console.error("Auth 메타데이터 업데이트 실패:", updateAuthError);
      }

      // User 테이블 업데이트
      const { error: updateUserError } = await supabase
        .from("User")
        .update({
          wallet_address: walletAddress,
          wallet_type: walletType,
          wallet_connected: true,
          last_wallet_connection: new Date().toISOString(),
        })
        .eq("email", data.user.email!);

      if (updateUserError) {
        console.error("User 테이블 업데이트 실패:", updateUserError);
      }
    }

    return { success: true, data };
  } catch (error) {
    console.error("로그인 실패:", error);
    
    // AuthError인 경우 더 자세한 에러 메시지 제공
    if (error instanceof AuthError) {
      switch (error.message) {
        case "Email not confirmed":
          return {
            success: false,
            error: "이메일 인증이 필요합니다. 이메일을 확인해주세요.",
          };
        case "Too many requests":
          return {
            success: false,
            error: "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.",
          };
        default:
          return {
            success: false,
            error: "이메일 또는 비밀번호가 올바르지 않습니다.",
          };
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "로그인에 실패했습니다.",
    };
  }
} 