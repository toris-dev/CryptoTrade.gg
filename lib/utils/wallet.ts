import { supabase } from "@/lib/supabase/client";

declare global {
  interface Window {
    ethereum?: any;
    klaytn: any;
    solana: any;
  }
}

export type WalletType = "ethereum" | "klaytn" | "solana";

export interface UserWallet {
  id: string;
  user_id: string;
  address: string;
  type: WalletType;
  chain_id: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  balance: number | null;
  nickname: string | null;
  last_used_at: string | null;
}

export async function getUserWallets(userId: string): Promise<UserWallet[]> {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .order("is_primary", { ascending: false });

  if (error) throw error;
  return data as UserWallet[];
}

export async function getPrimaryWallet(userId: string): Promise<UserWallet | null> {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .eq("is_primary", true)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as UserWallet | null;
}

export async function addWallet(
  userId: string,
  wallet: Omit<UserWallet, "id" | "created_at" | "updated_at" | "last_used_at">
): Promise<UserWallet> {
  const { data, error } = await supabase
    .from("wallets")
    .insert([{ ...wallet, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data as UserWallet;
}

export async function updateWallet(
  walletId: string,
  updates: Partial<Omit<UserWallet, "id" | "user_id" | "created_at" | "updated_at">>
): Promise<UserWallet> {
  const { data, error } = await supabase
    .from("wallets")
    .update(updates)
    .eq("id", walletId)
    .select()
    .single();

  if (error) throw error;
  return data as UserWallet;
}

export async function setPrimaryWallet(
  userId: string,
  walletId: string
): Promise<void> {
  const { error: resetError } = await supabase
    .from("wallets")
    .update({ is_primary: false })
    .eq("user_id", userId);

  if (resetError) throw resetError;

  const { error: updateError } = await supabase
    .from("wallets")
    .update({ is_primary: true })
    .eq("id", walletId)
    .eq("user_id", userId);

  if (updateError) throw updateError;
}

export async function removeWallet(walletId: string): Promise<void> {
  const { error } = await supabase
    .from("wallets")
    .delete()
    .eq("id", walletId);

  if (error) throw error;
}

export async function updateWalletBalance(
  walletId: string,
  balance: number
): Promise<void> {
  const { error } = await supabase
    .from("wallets")
    .update({ 
      balance,
      last_used_at: new Date().toISOString()
    })
    .eq("id", walletId);

  if (error) throw error;
}

export function getChainId(walletType: WalletType): string {
  switch (walletType) {
    case "ethereum":
      return "1"; // Ethereum Mainnet
    case "klaytn":
      return "8217"; // Klaytn Mainnet
    case "solana":
      return "1399811149"; // Solana Mainnet
    default:
      return "1";
  }
} 