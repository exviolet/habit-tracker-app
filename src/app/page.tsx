"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  // Перенаправление на страницу привычек
  useEffect(() => {
    redirect('/habits');
  }, []);

  return null;
}
