"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Settings } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="max-w-md mx-auto flex justify-around items-center p-2">
        <Link
          href="/habits"
          className={`flex flex-col items-center p-2 ${
            pathname === "/habits" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Әдеттер</span>
        </Link>

        <Link
          href="/calendar"
          className={`flex flex-col items-center p-2 ${
            pathname === "/calendar" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Calendar className="h-6 w-6" />
          <span className="text-xs">Күнтізбе</span>
        </Link>

        <Link
          href="/settings"
          className={`flex flex-col items-center p-2 ${
            pathname === "/settings" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs">Параметрлер</span>
        </Link>
      </div>
    </div>
  );
}
