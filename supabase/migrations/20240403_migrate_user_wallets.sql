-- Migrate existing wallet data to new table
INSERT INTO public.user_wallets (
    user_id,
    wallet_address,
    wallet_type,
    chain_id,
    is_primary,
    created_at,
    updated_at
)
SELECT 
    id as user_id,
    wallet_address,
    COALESCE(wallet_type, 'ethereum') as wallet_type,
    CASE 
        WHEN COALESCE(wallet_type, 'ethereum') = 'ethereum' THEN '1'
        WHEN wallet_type = 'klaytn' THEN '8217'
        WHEN wallet_type = 'solana' THEN '1399811149'
        ELSE '1'
    END as chain_id,
    true as is_primary,
    created_at,
    updated_at
FROM public."User"
WHERE wallet_address IS NOT NULL;

-- Remove wallet columns from User table
ALTER TABLE public."User"
    DROP COLUMN IF EXISTS wallet_address,
    DROP COLUMN IF EXISTS wallet_type; 