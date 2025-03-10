"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectButton } from "./connect-button";

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = () => {
    router.push("/signout");
  };

  return (
    <header className="border-b border-gray-800 bg-gray-900 backdrop-blur-sm">
      <nav className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <motion.span
            className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            CryptoTrade.GG
          </motion.span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="secondary" asChild>
            <Link href="/stats">Stats</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/leaderboard">Leaderboard</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/markets">Markets</Link>
          </Button>
          <ConnectButton
            isConnected={isConnected}
            setIsConnected={setIsConnected}
          />

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile/me">
                <Button variant="ghost" className="text-gray-300">
                  {user.email}
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/signin">
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
