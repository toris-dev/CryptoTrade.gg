import { createHmac } from 'crypto';

interface BinanceConfig {
  apiKey: string;
  secretKey: string;
}

export class BinanceClient {
  private apiKey: string;
  private secretKey: string;
  private baseUrl = 'https://api.binance.com/api/v3';

  constructor(config: BinanceConfig) {
    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey;
  }

  private getSignature(queryString: string): string {
    return createHmac('sha256', this.secretKey)
      .update(queryString)
      .digest('hex');
  }

  async getTradeHistory(symbol: string) {
    const timestamp = Date.now();
    const queryString = `symbol=${symbol}&timestamp=${timestamp}`;
    const signature = this.getSignature(queryString);

    const response = await fetch(
      `${this.baseUrl}/myTrades?${queryString}&signature=${signature}`,
      {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Binance trade history');
    }

    return response.json();
  }

  async getBalance() {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = this.getSignature(queryString);

    const response = await fetch(
      `${this.baseUrl}/account?${queryString}&signature=${signature}`,
      {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Binance balance');
    }

    return response.json();
  }
} 