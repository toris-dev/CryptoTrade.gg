import { CCXTClient } from '@/lib/ccxt-client';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    // 세션 확인
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const ccxtClient = new CCXTClient();
    await ccxtClient.initializeExchange(userId);

    // 거래 내역 가져오기
    const trades = {
      upbit: await ccxtClient.getTrades('upbit', 'BTC/KRW'),
      binance: await ccxtClient.getTrades('binance', 'BTC/USDT')
    };

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Failed to fetch trades:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    );
  }
} 