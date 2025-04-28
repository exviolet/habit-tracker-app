"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { getHabits } from "@/lib/habits";
import type { Habit } from "@/types/habit";
import { HabitCard } from "@/components/habits/habit-card";

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    setHabits(getHabits());
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Привычки</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link href="/add-habit">
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-muted-foreground text-center">
            У вас пока нет привычек. Создайте свою первую привычку, нажав на кнопку "+".
          </p>
          <Link href="/add-habit">
            <Button>Добавить привычку</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}
