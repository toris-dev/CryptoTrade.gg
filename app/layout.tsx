import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import Header from "./components/header";
import { AuthProvider } from "./context/auth-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoTrade.GG",
  description: "암호화폐 투자 전적 사이트",
  icons: {
    icon: "/placeholder-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
