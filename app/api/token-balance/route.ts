import { blockchainClient } from '@/lib/blockchain-client';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // URL에서 쿼리 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const address = searchParams.get('address');
    const tokenAddress = searchParams.get('tokenAddress');
    
    // 필수 파라미터 확인
    if (!userId || !address || !tokenAddress) {
      return NextResponse.json(
        { error: '사용자 ID, 지갑 주소, 토큰 주소가 필요합니다' },
        { status: 400 }
      );
    }
    
    // 사용자 인증 확인
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다' },
        { status: 401 }
      );
    }
    
    // 사용자 정보 확인
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('wallet_address')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }
    
    // 요청한 지갑 주소가 사용자의 지갑 주소와 일치하는지 확인
    if (user.wallet_address !== address) {
      return NextResponse.json(
        { error: '권한이 없습니다' },
        { status: 403 }
      );
    }
    
    // 토큰 잔액 가져오기
    const tokenBalance = await blockchainClient.getTokenBalance(tokenAddress, address);
    
    return NextResponse.json({ tokenBalance });
  } catch (error) {
    console.error('토큰 잔액 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
} 