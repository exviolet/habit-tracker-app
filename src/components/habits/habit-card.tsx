"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Edit,
  Trash2,
  MoreVertical,
  Book,
  Bike,
  Clock,
  Pencil,
  Droplets,
  Cake,
  CheckCheck,
  Smile,
  User,
  Coffee,
  ShoppingCart,
  Ticket,
  Music,
  Wrench,
  Umbrella,
  Star,
  Train,
  Package,
  Fuel
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import type { Habit } from "@/types/habit";
import { deleteHabit, updateHabitProgress, getProgressForDate } from "@/lib/habits";

// Компонент для отображения иконки привычки
function HabitIcon({ icon }: { icon: string }) {
  const size = 24;

  const icons: Record<string, React.ReactNode> = {
    book: <Book size={size} />,
    bicycle: <Bike size={size} />,
    clock: <Clock size={size} />,
    pencil: <Pencil size={size} />,
    droplets: <Droplets size={size} />,
    cake: <Cake size={size} />,
    check: <CheckCheck size={size} />,
    smile: <Smile size={size} />,
    user: <User size={size} />,
    coffee: <Coffee size={size} />,
    "shopping-cart": <ShoppingCart size={size} />,
    ticket: <Ticket size={size} />,
    music: <Music size={size} />,
    wrench: <Wrench size={size} />,
    umbrella: <Umbrella size={size} />,
    star: <Star size={size} />,
    train: <Train size={size} />,
    package: <Package size={size} />,
    fuel: <Fuel size={size} />,
  };

  return icons[icon] || <Star size={size} />;
}

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const [localHabit, setLocalHabit] = useState(habit);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const today = new Date();
  const todayProgress = getProgressForDate(habit.id, today) || { value: 0, completed: false, date: today };

  const progressPercentage = Math.min(Math.round((todayProgress.value / habit.goal) * 100), 100);

  const handleDelete = () => {
    deleteHabit(habit.id);
    window.location.reload();
  };

  const handleComplete = () => {
    const updatedHabit = updateHabitProgress(habit.id, new Date(), habit.goal);
    if (updatedHabit) {
      setLocalHabit(updatedHabit);
    }
  };

  const handleIncrement = () => {
    const newValue = todayProgress.value + 1;
    const updatedHabit = updateHabitProgress(habit.id, new Date(), newValue);
    if (updatedHabit) {
      setLocalHabit(updatedHabit);
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-muted p-2 rounded-md">
              <HabitIcon icon={habit.icon} />
            </div>
            <CardTitle className="text-lg">{habit.name}</CardTitle>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/edit-habit/${habit.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Редактировать</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowConfirmDelete(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Удалить</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {habit.description && (
          <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
        )}

        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium">Прогресс:</p>
          <p className="text-sm">
            {todayProgress.value} / {habit.goal}
          </p>
        </div>

        <Progress value={progressPercentage} className="h-2" />
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrement}
          >
            +1
          </Button>

          <Button
            variant={todayProgress.completed ? "secondary" : "default"}
            size="sm"
            onClick={handleComplete}
            disabled={todayProgress.completed}
          >
            {todayProgress.completed ? (
              <>
                <Check className="mr-1 h-4 w-4" />
                Выполнено
              </>
            ) : (
              "Отметить выполнение"
            )}
          </Button>
        </div>
      </CardFooter>

      <AlertDialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие удалит привычку "{habit.name}" и всю историю ее выполнения.
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
