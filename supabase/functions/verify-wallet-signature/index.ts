import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ethers } from 'npm:ethers';

serve(async (req) => {
  try {
    const { address, signature, nonce } = await req.json();

    // Recreate the message that was signed
    const message = `Welcome to CryptoTrade.gg!\n\nPlease sign this message to verify your wallet ownership.\n\nNonce: ${nonce}`;

    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Check if the recovered address matches the claimed address
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a custom JWT token
    const token = await createCustomJWT(address);

    return new Response(
      JSON.stringify({ token }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

async function createCustomJWT(address: string) {
  // Here you would implement JWT creation using your preferred method
  // For example, using jose library or a similar JWT library
  // This is a placeholder that should be replaced with actual JWT creation
  return "custom.jwt.token";
} 