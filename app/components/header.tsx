"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectButton } from "./connect-button";

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const menuItems = [
    { href: "/stats", label: "Stats" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <header className="border-b border-gray-800 bg-gray-900 backdrop-blur-sm relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <motion.span
              className="text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              CryptoTrade.GG
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="secondary" asChild size="sm">
              <Link href="/stats">Stats</Link>
            </Button>
            <Button variant="secondary" asChild size="sm">
              <Link href="/leaderboard">Leaderboard</Link>
            </Button>
            <ConnectButton
              isConnected={isConnected}
              setIsConnected={setIsConnected}
            />
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile/me">
                  <Button variant="ghost" className="text-gray-300" size="sm">
                    {user.user_metadata.display_name}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  size="sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-500 hover:bg-blue-500"
                  size="sm"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden py-4 absolute top-16 w-2/4 right-0 bg-gray-900 z-50"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div className="flex flex-col space-y-3 pb-3 px-4">
                {menuItems.map((item, index) => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Button variant="secondary" asChild className="w-full">
                      <Link href={item.href} onClick={() => setMenuOpen(false)}>
                        {item.label}
                      </Link>
                    </Button>
                  </motion.div>
                ))}

                <motion.div variants={itemVariants} className="py-2">
                  <ConnectButton
                    isConnected={isConnected}
                    setIsConnected={setIsConnected}
                  />
                </motion.div>

                {user ? (
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col space-y-2"
                  >
                    <Link href="/profile/me" onClick={() => setMenuOpen(false)}>
                      <Button variant="ghost" className="text-gray-300 w-full">
                        {user.email}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="border-red-500 text-red-500 hover:bg-red-500/10 w-full"
                    >
                      Sign Out
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants}>
                    <Link href="/signin" onClick={() => setMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500/10 w-full"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
