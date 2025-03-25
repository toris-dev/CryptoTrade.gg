"use client";

import TradingHistory from "@/app/components/trading-history";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  thumbnail_img: string | null;
}

export default function TraderProfile() {
  const params = useParams();
  const username = params.username as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("*")
          .eq("username", username)
          .single();

        if (userError) {
          console.error("Error fetching user:", userError);
          return;
        }

        if (userData) {
          setUser({
            id: String(userData.id),
            username: userData.username,
            display_name: userData.display_name,
            thumbnail_img: userData.thumbnail_img,
          });
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username, supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          <p className="text-blue-400 text-sm animate-pulse">로딩중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-3">
            트레이더를 찾을 수 없습니다
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
            요청하신 트레이더가 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-5xl">
          {/* 프로필 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm mb-6 sm:mb-8 lg:mb-12 hover:bg-gray-800/40 transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 hover:from-blue-400 hover:to-purple-500 transition-all duration-300"
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                      {user.thumbnail_img ? (
                        <img
                          src={user.thumbnail_img}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-100">
                          {user.display_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </motion.div>
                  <div className="text-center sm:text-left flex-1">
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                    >
                      {user.display_name}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-base sm:text-lg text-gray-400 mt-2"
                    >
                      @{user.username}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 거래 내역 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4 sm:space-y-6"
          >
            <TradingHistory userId={user.id} />
          </motion.div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
