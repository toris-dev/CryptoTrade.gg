import { BinanceClient } from '@/lib/binance';
import { createClient } from '@/lib/supabase/server';
import { UpbitClient } from '@/lib/upbit';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 사용자의 API 키 정보 가져오기
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('upbit_access_key, upbit_secret_key, binance_access_key, binance_secret_key')
      .eq('id', session.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const trades = {
      upbit: [],
      binance: [],
    };

    // Upbit 거래 내역 가져오기
    if (userData.upbit_access_key && userData.upbit_secret_key) {
      const upbitClient = new UpbitClient({
        accessKey: userData.upbit_access_key,
        secretKey: userData.upbit_secret_key,
      });

      try {
        trades.upbit = await upbitClient.getTradeHistory();
      } catch (error) {
        console.error('Upbit error:', error);
      }
    }

    // Binance 거래 내역 가져오기
    if (userData.binance_access_key && userData.binance_secret_key) {
      const binanceClient = new BinanceClient({
        apiKey: userData.binance_access_key,
        secretKey: userData.binance_secret_key,
      });

      try {
        // BTC/USDT 거래 내역을 예시로 가져옴
        trades.binance = await binanceClient.getTradeHistory('BTCUSDT');
      } catch (error) {
        console.error('Binance error:', error);
      }
    }

    return NextResponse.json(trades);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 