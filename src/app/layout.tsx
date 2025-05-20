import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habit Tracker - Әдеттерді бақылау",
  description: "Әдеттеріңізді бақылаңыз және өміріңізді жақсартыңыз",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="max-w-md mx-auto p-4 pb-20 min-h-screen flex flex-col">
            {children}
          </div>
          <Navigation />
        </ThemeProvider>
      </body>
    </html>
  );
}
