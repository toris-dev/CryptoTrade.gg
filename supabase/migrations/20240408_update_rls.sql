-- Temporarily disable RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert users" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.users;

-- Create new policies
CREATE POLICY "Enable all for service role" 
    ON public.users
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users can view own profile" 
    ON public.users FOR SELECT 
    USING (
        auth.role() = 'service_role' OR 
        wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address'
    );

CREATE POLICY "Users can update own profile" 
    ON public.users FOR UPDATE 
    USING (
        auth.role() = 'service_role' OR 
        wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address'
    );

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY; 