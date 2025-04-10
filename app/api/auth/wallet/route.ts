import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { address, signature, message, type, chainId } = await request.json();
    
    console.log('Received parameters:', { address, type, chainId });

    // Verify signature
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Check if user exists
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id, wallet_address')
      .eq('wallet_address', address.toLowerCase())
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error checking existing user:', userError);
      return NextResponse.json({ error: 'Database error', details: userError }, { status: 500 });
    }

    let userId: string;

    if (!existingUser) {
      // Create new user
      const userData = {
        wallet_address: address.toLowerCase(),
        wallet_type: type || 'ethereum', // Provide default value
        auth_method: 'wallet',
        display_name: `${address.slice(0, 6)}...${address.slice(-4)}`
      };
      
      console.log('Creating new user with data:', userData);

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert(userData)
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating new user:', createError);
        return NextResponse.json({ 
          error: 'Failed to create user', 
          details: createError,
          data: userData
        }, { status: 500 });
      }

      if (!newUser) {
        console.error('No user data returned after creation');
        return NextResponse.json({ 
          error: 'User creation succeeded but no data returned'
        }, { status: 500 });
      }

      userId = newUser.id;
    } else {
      userId = existingUser.id;
    }

    // Check if wallet exists
    const { data: existingWallet, error: walletError } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', userId)
      .eq('address', address.toLowerCase())
      .single();

    if (walletError && walletError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!existingWallet) {
      // Create new wallet
      const { error: createWalletError } = await supabase
        .from('wallets')
        .insert({
          user_id: userId,
          address: address.toLowerCase(),
          type,
          chain_id: chainId,
          is_primary: true,
          last_used_at: new Date().toISOString()
        });

      if (createWalletError) {
        return NextResponse.json({ error: 'Failed to create wallet' }, { status: 500 });
      }
    } else {
      // Update existing wallet
      const { error: updateError } = await supabase
        .from('wallets')
        .update({
          last_used_at: new Date().toISOString()
        })
        .eq('id', existingWallet.id);

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 });
      }
    }

    // Set session cookie
    const cookieStore = cookies();
    cookieStore.set('wallet_address', address.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return NextResponse.json({
      user: {
        id: userId,
        wallet_address: address.toLowerCase(),
        wallet_type: type
      }
    });
  } catch (error) {
    console.error('Wallet authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 