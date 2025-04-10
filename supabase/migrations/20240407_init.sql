-- Create users table
CREATE TABLE public.users (
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    wallet_address text NOT NULL,
    wallet_type text NOT NULL,
    auth_method text NOT NULL,
    display_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_wallet_address UNIQUE (wallet_address)
);

-- Create wallets table
CREATE TABLE public.wallets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) NOT NULL,
    address text NOT NULL,
    type text NOT NULL,
    chain_id text NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    nickname text,
    balance numeric,
    last_used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_user_wallet UNIQUE (user_id, address)
);

-- Create trades table
CREATE TABLE public.trades (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) NOT NULL,
    wallet_id uuid REFERENCES public.wallets(id) NOT NULL,
    type text NOT NULL,
    side text NOT NULL,
    symbol text NOT NULL,
    amount numeric NOT NULL,
    price numeric NOT NULL,
    total numeric NOT NULL,
    fee numeric NOT NULL,
    fee_asset text NOT NULL,
    platform text NOT NULL,
    tx_hash text,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create assets table
CREATE TABLE public.assets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_id uuid REFERENCES public.wallets(id) NOT NULL,
    symbol text NOT NULL,
    amount numeric NOT NULL,
    platform text NOT NULL,
    last_price numeric,
    last_price_updated_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_wallet_asset UNIQUE (wallet_id, symbol, platform)
);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" 
    ON public.users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.users FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Wallets policies
CREATE POLICY "Users can view own wallets" 
    ON public.wallets FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallets" 
    ON public.wallets FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallets" 
    ON public.wallets FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wallets" 
    ON public.wallets FOR DELETE 
    USING (auth.uid() = user_id);

-- Trades policies
CREATE POLICY "Users can view own trades" 
    ON public.trades FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" 
    ON public.trades FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Assets policies
CREATE POLICY "Users can view own assets" 
    ON public.assets FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.wallets 
        WHERE wallets.id = assets.wallet_id 
        AND wallets.user_id = auth.uid()
    ));

CREATE POLICY "Users can update own assets" 
    ON public.assets FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.wallets 
        WHERE wallets.id = assets.wallet_id 
        AND wallets.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert own assets" 
    ON public.assets FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.wallets 
        WHERE wallets.id = wallet_id 
        AND wallets.user_id = auth.uid()
    ));

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, wallet_address, wallet_type, auth_method, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'wallet_address', ''),
        COALESCE(NEW.raw_user_meta_data->>'wallet_type', 'unknown'),
        COALESCE(NEW.raw_user_meta_data->>'auth_method', 'wallet'),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 
            substring(COALESCE(NEW.raw_user_meta_data->>'wallet_address', '') from 1 for 6) || '...' ||
            substring(COALESCE(NEW.raw_user_meta_data->>'wallet_address', '') from char_length(COALESCE(NEW.raw_user_meta_data->>'wallet_address', ''))-3)
        )
    );
    RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 