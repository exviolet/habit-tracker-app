// app/settings/archived-habits/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getArchivedHabits, restoreHabit, deleteArchivedHabit } from "@/lib/habits";
import type { Habit } from "@/types/habit";
import { HabitIcon } from "@/components/habits/habit-card";

export default function ArchivedHabitsPage() {
  const [archivedHabits, setArchivedHabits] = useState<Habit[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setArchivedHabits(getArchivedHabits());
  };

  const handleRestore = (habitId: string) => {
    if (restoreHabit(habitId)) {
      loadData();
    }
  };

  const handleDelete = (habitId: string) => {
    if (deleteArchivedHabit(habitId)) {
      loadData();
      setShowConfirmDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Link href="/settings">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Әдеттер мұрағаты</h1>
      </div>

      {archivedHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-muted-foreground text-center">
            Мұрағат бос. Мұнда сіз мұрағаттаған әдеттер көрсетіледі
          </p>
          <Link href="/habits">
            <Button>Әдеттерге оралу</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {archivedHabits.map((habit) => (
            <Card key={habit.id} className="shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-muted p-2 rounded-md">
                    <HabitIcon icon={habit.icon} />
                  </div>
                  <CardTitle className="text-lg">{habit.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {habit.description && (
                  <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleRestore(habit.id)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Қалпына келтіру
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowConfirmDelete(habit.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Біржола жою
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={showConfirmDelete !== null}
        onOpenChange={() => setShowConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Әдетті біржола жою керек пе?</AlertDialogTitle>
            <AlertDialogDescription>
             Бұл әрекет әдетті және оның бүкіл орындалу тарихын жояды. Бұл әрекетті қайтару мүмкін емес!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Болдырмау</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(showConfirmDelete!)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Жою
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
