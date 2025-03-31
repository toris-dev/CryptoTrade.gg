import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface UpbitConfig {
  accessKey: string;
  secretKey: string;
}

export class UpbitClient {
  private accessKey: string;
  private secretKey: string;
  private baseUrl = 'https://api.upbit.com/v1';

  constructor(config: UpbitConfig) {
    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;
  }

  private async getAuthToken(query?: string): Promise<string> {
    const payload = {
      access_key: this.accessKey,
      nonce: uuidv4(),
      ...(query && { query_hash: query, query_hash_alg: 'SHA512' }),
    };

    return sign(payload, this.secretKey);
  }

  async getTradeHistory() {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Upbit trade history');
    }

    return response.json();
  }

  async getBalance() {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Upbit balance');
    }

    return response.json();
  }
} 