"use client";

import TradingHistory from "@/app/components/trading-history";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-300 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-400">
            The trader you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* 프로필 섹션 */}
          <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm mb-8 hover:bg-gray-800/40 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                    {user.thumbnail_img ? (
                      <img
                        src={user.thumbnail_img}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl md:text-5xl font-bold text-gray-100">
                        {user.display_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {user.display_name}
                  </h1>
                  <p className="text-lg text-gray-400 mt-2">@{user.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 거래 내역 섹션 */}
          <div className="space-y-6">
            <TradingHistory userId={user.id} />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
