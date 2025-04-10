"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserWallets, type UserWallet } from "@/lib/utils/wallet";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { ArrowDownUp, Edit2, Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Transaction {
  id: string;
  created_at: string;
  side: string;
  quantity: number;
  price: number;
  total: number;
  fee: number;
  fee_asset: string;
  status: string;
}

export default function MyPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/signin");
          return;
        }
        setUser(user);
        setDisplayName(user.user_metadata.display_name || "");

        // Fetch user's wallets
        const userWallets = await getUserWallets(user.id);
        setWallets(userWallets);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [supabase, router]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      setIsLoadingTransactions(true);
      try {
        const { data, error } = await supabase
          .from("trades")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [user, supabase]);

  const handleDisplayNameChange = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });

      if (error) throw error;

      Swal.fire({
        title: "변경 완료",
        text: "표시 이름이 변경되었습니다.",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#1e293b",
        color: "#fff",
      });
    } catch (error) {
      console.error("Error updating display name:", error);
      Swal.fire({
        title: "오류",
        text: "표시 이름 변경 중 오류가 발생했습니다.",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#1e293b",
        color: "#fff",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Section */}
          <div className="w-full md:w-1/3">
            <Card className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                  <Image
                    src={
                      user?.user_metadata?.avatar_url || "/placeholder-user.jpg"
                    }
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {displayName || user?.email}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {user?.email}
                </p>
                <div className="w-full">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="표시 이름"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDisplayNameChange}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Section */}
          <div className="flex-1">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">개요</TabsTrigger>
                <TabsTrigger value="wallets">지갑</TabsTrigger>
                <TabsTrigger value="transactions">거래내역</TabsTrigger>
                <TabsTrigger value="settings">설정</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">계정 정보</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">이메일</p>
                      <p>{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">가입일</p>
                      <p>
                        {new Date(user?.created_at || "").toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        마지막 로그인
                      </p>
                      <p>
                        {user?.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : "없음"}
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="wallets">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">연결된 지갑</h3>
                  <div className="space-y-4">
                    {wallets.length === 0 ? (
                      <div className="text-center py-8">
                        <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          연결된 지갑이 없습니다.
                        </p>
                      </div>
                    ) : (
                      wallets.map((wallet) => (
                        <Card key={wallet.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {wallet.nickname ||
                                  `${wallet.wallet_type} 지갑`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {wallet.wallet_address.substring(0, 6)}...
                                {wallet.wallet_address.substring(
                                  wallet.wallet_address.length - 4
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {wallet.is_primary && (
                                <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded">
                                  기본
                                </span>
                              )}
                              <Button variant="ghost" size="sm">
                                연결 해제
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="transactions">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">거래 내역</h3>
                  <div className="space-y-4">
                    {isLoadingTransactions ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <ArrowDownUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          거래 내역이 없습니다.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {transactions.map((tx) => (
                          <Card key={tx.id} className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {tx.side === "buy" ? "매수" : "매도"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(tx.created_at).toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-mono">
                                  {tx.quantity.toLocaleString()} {tx.fee_asset}
                                </p>
                                <p
                                  className={`text-sm ${
                                    tx.side === "buy"
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {tx.total.toLocaleString()} KRW
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  수수료: {tx.fee.toLocaleString()}{" "}
                                  {tx.fee_asset}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">계정 설정</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        표시 이름
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="표시 이름"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                        />
                        <Button onClick={handleDisplayNameChange}>변경</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
