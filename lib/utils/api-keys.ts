import { createClient } from '@supabase/supabase-js';
import { decrypt, encrypt } from './encryption';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveApiKeys(
  userId: string,
  upbitAccessKey?: string,
  upbitSecretKey?: string,
  binanceAccessKey?: string,
  binanceSecretKey?: string
) {
  const updates: any = {};

  if (upbitAccessKey) {
    updates.upbit_access_key = encrypt(upbitAccessKey);
  }
  if (upbitSecretKey) {
    updates.upbit_secret_key = encrypt(upbitSecretKey);
  }
  if (binanceAccessKey) {
    updates.binance_access_key = encrypt(binanceAccessKey);
  }
  if (binanceSecretKey) {
    updates.binance_secret_key = encrypt(binanceSecretKey);
  }

  const { error } = await supabase
    .from('User')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
}

export async function getApiKeys(userId: string) {
  const { data, error } = await supabase
    .from('User')
    .select('upbit_access_key, upbit_secret_key, binance_access_key, binance_secret_key')
    .eq('id', userId)
    .single();

  if (error) throw error;

  return {
    upbitAccessKey: data.upbit_access_key ? decrypt(data.upbit_access_key) : null,
    upbitSecretKey: data.upbit_secret_key ? decrypt(data.upbit_secret_key) : null,
    binanceAccessKey: data.binance_access_key ? decrypt(data.binance_access_key) : null,
    binanceSecretKey: data.binance_secret_key ? decrypt(data.binance_secret_key) : null,
  };
}

export async function deleteApiKeys(userId: string) {
  const { error } = await supabase
    .from('User')
    .update({
      upbit_access_key: null,
      upbit_secret_key: null,
      binance_access_key: null,
      binance_secret_key: null,
    })
    .eq('id', userId);

  if (error) throw error;
} 