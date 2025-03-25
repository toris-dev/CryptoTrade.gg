import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      binanceApiKey, 
      binanceSecretKey, 
      coinbaseApiKey, 
      coinbaseSecretKey,
      walletAddress 
    } = body;
    
    // 요청 검증
    if (!binanceApiKey || !binanceSecretKey) {
      return NextResponse.json(
        { error: '바이낸스 API 키와 시크릿 키는 필수입니다' },
        { status: 400 }
      );
    }
    
    // 암호화 처리 (실제 환경에서는 더 안전한 방식 사용 권장)
    // 실제 환경에서는 AWS KMS 또는 Vault와 같은 보안 솔루션 사용
    
    // Supabase에 API 키 저장
    const supabase = createRouteHandlerClient({ cookies });
    
    // 먼저 사용자 인증 확인
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다' },
        { status: 401 }
      );
    }
    
    // 기존 키 확인
    const { data: existingKeys } = await supabase
      .from('exchange_keys')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    let result;
    
    if (existingKeys) {
      // 기존 키 업데이트
      result = await supabase
        .from('exchange_keys')
        .update({
          binance_api_key: binanceApiKey,
          binance_secret_key: binanceSecretKey,
          coinbase_api_key: coinbaseApiKey || null,
          coinbase_secret_key: coinbaseSecretKey || null,
          wallet_address: walletAddress || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    } else {
      // 새 키 등록
      result = await supabase
        .from('exchange_keys')
        .insert({
          user_id: user.id,
          binance_api_key: binanceApiKey,
          binance_secret_key: binanceSecretKey,
          coinbase_api_key: coinbaseApiKey || null,
          coinbase_secret_key: coinbaseSecretKey || null,
          wallet_address: walletAddress || null,
        });
    }
    
    if (result.error) {
      console.error('API 키 저장 오류:', result.error);
      return NextResponse.json(
        { error: 'API 키 저장 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API 키 처리 중 오류:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다' },
      { status: 500 }
    );
  }
} 