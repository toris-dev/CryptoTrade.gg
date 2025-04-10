import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Email authentication functions
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Wallet authentication functions
export const signInWithWallet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  // Request account access
  const accounts = await provider.send("eth_requestAccounts", []);
  const address = accounts[0];
  
  // Get the nonce for this wallet address
  const { data: existingUser } = await supabase
    .from('User')
    .select('nonce')
    .eq('wallet_address', address.toLowerCase())
    .single();

  let nonce;
  if (existingUser?.nonce) {
    nonce = existingUser.nonce;
  } else {
    // If user doesn't exist, create a new nonce
    nonce = ethers.utils.hexlify(ethers.utils.randomBytes(16));
    await supabase.from('User').insert([
      {
        wallet_address: address.toLowerCase(),
        nonce,
        username: `user_${address.slice(2, 8)}`,
        display_name: `User ${address.slice(2, 8)}`,
        thumbnail_img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`,
      }
    ]);
  }

  // Create the message for signing
  const message = `Welcome to CryptoTrade.gg!\n\nPlease sign this message to verify your wallet ownership.\n\nNonce: ${nonce}`;
  
  // Request signature
  const signer = provider.getSigner();
  const signature = await signer.signMessage(message);
  
  // Verify the signature on the server side
  const { data, error } = await supabase.functions.invoke('verify-wallet-signature', {
    body: { address, signature, nonce }
  });

  if (error) throw error;
  
  // Update the user's nonce for next login
  const newNonce = ethers.utils.hexlify(ethers.utils.randomBytes(16));
  await supabase
    .from('User')
    .update({ nonce: newNonce, last_signed_in: new Date().toISOString() })
    .eq('wallet_address', address.toLowerCase());

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user;
};

export const getCurrentWallet = async () => {
  if (!window.ethereum) return null;
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.send("eth_accounts", []);
  return accounts[0] || null;
}; 