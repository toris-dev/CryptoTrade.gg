'use server';

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function fetchTrades() {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's API keys
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('upbit_access_key, upbit_secret_key, binance_access_key, binance_secret_key')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      throw new Error('Failed to fetch user data');
    }

    // Fetch trades directly from Supabase
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (tradesError) {
      throw new Error('Failed to fetch trades');
    }

    return { trades: trades || [] };
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
} 