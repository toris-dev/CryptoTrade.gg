import { createClient } from '@supabase/supabase-js';
import type { Exchange, OrderBook, Ticker, Trade } from 'ccxt';
import ccxt from 'ccxt';

interface ExchangeConfig {
  apiKey: string;
  secret: string;
  exchange: string;
}

interface CustomTrade extends Trade {
  exchange: string;
}

interface CustomOrderBook extends OrderBook {
  exchange: string;
}

interface CustomTicker extends Ticker {
  exchange: string;
}

export class CCXTClient {
  private exchanges: Map<string, Exchange> = new Map();
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async initializeExchange(userId: string) {
    try {
      // 사용자의 API 키 정보 가져오기
      const { data: user, error } = await this.supabase
        .from('User')
        .select('upbit_access_key, upbit_secret_key, binance_access_key, binance_secret_key')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Upbit 설정
      if (user.upbit_access_key && user.upbit_secret_key) {
        const upbitConfig: ExchangeConfig = {
          apiKey: user.upbit_access_key,
          secret: user.upbit_secret_key,
          exchange: 'upbit'
        };
        await this.setupExchange(upbitConfig);
      }

      // Binance 설정
      if (user.binance_access_key && user.binance_secret_key) {
        const binanceConfig: ExchangeConfig = {
          apiKey: user.binance_access_key,
          secret: user.binance_secret_key,
          exchange: 'binance'
        };
        await this.setupExchange(binanceConfig);
      }
    } catch (error) {
      console.error('Failed to initialize exchanges:', error);
      throw error;
    }
  }

  private async setupExchange(config: ExchangeConfig) {
    try {
      const exchangeClass = ccxt[config.exchange as keyof typeof ccxt];
      if (!exchangeClass) {
        throw new Error(`Exchange ${config.exchange} is not supported`);
      }

      const exchange = new (exchangeClass as new (config: any) => Exchange)({
        apiKey: config.apiKey,
        secret: config.secret,
        enableRateLimit: true,
      });

      // 거래소 초기화
      await exchange.loadMarkets();
      this.exchanges.set(config.exchange, exchange);
    } catch (error) {
      console.error(`Failed to setup ${config.exchange}:`, error);
      throw error;
    }
  }

  async getTrades(exchange: string, symbol: string, since?: number, limit?: number): Promise<CustomTrade[]> {
    const exchangeInstance = this.exchanges.get(exchange);
    if (!exchangeInstance) {
      throw new Error(`Exchange ${exchange} is not initialized`);
    }

    try {
      const trades = await exchangeInstance.fetchMyTrades(symbol, since, limit);
      return trades.map((trade: Trade) => ({
        ...trade,
        exchange
      }));
    } catch (error) {
      console.error(`Failed to fetch trades from ${exchange}:`, error);
      throw error;
    }
  }

  async getBalance(exchange: string) {
    const exchangeInstance = this.exchanges.get(exchange);
    if (!exchangeInstance) {
      throw new Error(`Exchange ${exchange} is not initialized`);
    }

    try {
      const balance = await exchangeInstance.fetchBalance();
      return {
        total: balance.total,
        free: balance.free,
        used: balance.used,
        exchange: exchange
      };
    } catch (error) {
      console.error(`Failed to fetch balance from ${exchange}:`, error);
      throw error;
    }
  }

  async getOrderBook(exchange: string, symbol: string, limit?: number): Promise<CustomOrderBook> {
    const exchangeInstance = this.exchanges.get(exchange);
    if (!exchangeInstance) {
      throw new Error(`Exchange ${exchange} is not initialized`);
    }

    try {
      const orderBook = await exchangeInstance.fetchOrderBook(symbol, limit);
      return {
        ...orderBook,
        exchange
      };
    } catch (error) {
      console.error(`Failed to fetch order book from ${exchange}:`, error);
      throw error;
    }
  }

  async getTicker(exchange: string, symbol: string): Promise<CustomTicker> {
    const exchangeInstance = this.exchanges.get(exchange);
    if (!exchangeInstance) {
      throw new Error(`Exchange ${exchange} is not initialized`);
    }

    try {
      const ticker = await exchangeInstance.fetchTicker(symbol);
      return {
        ...ticker,
        exchange
      };
    } catch (error) {
      console.error(`Failed to fetch ticker from ${exchange}:`, error);
      throw error;
    }
  }
} 