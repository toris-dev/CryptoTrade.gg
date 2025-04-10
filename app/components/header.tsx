"use client";

import { Logo } from "@/app/components/logo";
import { useScrollDirection } from "@/app/hooks/use-scroll-direction";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../../components/theme-toggle";
import { ConnectButton } from "./connect-button";

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const isScrollingUp = useScrollDirection();
  const router = useRouter();

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
    <motion.header
      className="header-container header-bg fixed top-0 left-0 right-0 z-50 border-b"
      initial={{ y: 0 }}
      animate={{ y: isScrollingUp ? 0 : "-100%" }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 header-content">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold web3-glow"
          >
            <Logo />
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="secondary"
              asChild
              size="sm"
              className="interactive-button"
            >
              <Link href="/stats">Stats</Link>
            </Button>
            <Button
              variant="secondary"
              asChild
              size="sm"
              className="interactive-button"
            >
              <Link href="/leaderboard">Leaderboard</Link>
            </Button>
            <ThemeToggle />
            <ConnectButton
              isConnected={isConnected}
              setIsConnected={setIsConnected}
            />
            {user && (
              <div className="flex items-center gap-2">
                <Link href="/mypage">
                  <Button
                    variant="ghost"
                    className="interactive-button text-foreground"
                    size="sm"
                  >
                    {user.user_metadata.display_name || user.email}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="interactive-button border-red-500 text-red-500 hover:bg-red-500/10"
                  size="sm"
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(!menuOpen)}
              className="interactive-button text-foreground"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden py-4 absolute top-16 w-2/4 right-0 bg-card/95 backdrop-blur-lg border-l border-b border-border z-50"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div className="flex flex-col space-y-3 pb-3 px-4">
                {menuItems.map((item, index) => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Button
                      variant="secondary"
                      asChild
                      className="w-full interactive-button"
                    >
                      <Link href={item.href} onClick={() => setMenuOpen(false)}>
                        {item.label}
                      </Link>
                    </Button>
                  </motion.div>
                ))}

                <motion.div variants={itemVariants} className="py-2">
                  <ThemeToggle />
                  <ConnectButton
                    isConnected={isConnected}
                    setIsConnected={setIsConnected}
                  />
                </motion.div>

                {user && (
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col space-y-2"
                  >
                    <Link href="/mypage" onClick={() => setMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        className="text-foreground w-full interactive-button"
                      >
                        {user.user_metadata.display_name || user.email}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="border-red-500 text-red-500 hover:bg-red-500/10 w-full interactive-button"
                    >
                      Sign Out
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
