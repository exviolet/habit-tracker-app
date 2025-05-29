// components/habits/habit-card.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Edit,
  Archive,
  MoreVertical,
  SortAsc,
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
  Fuel,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import type { Habit } from "@/types/habit";
import { getCategories } from "@/lib/categories";
import { archiveHabit, updateHabitProgress, getProgressForDate, saveHabitOrder } from "@/lib/habits";

export function HabitIcon({ icon }: { icon: string }) {
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

  const iconMap: Record<string, string> = {
    "📚": "book",
    "🚲": "bicycle",
    "⏰": "clock",
    "✏️": "pencil",
    "💧": "droplets",
    "🍰": "cake",
    "✅": "check",
    "😊": "smile",
    "👤": "user",
    "☕": "coffee",
    "🛒": "shopping-cart",
    "🎟️": "ticket",
    "🎵": "music",
    "🔧": "wrench",
    "☔": "umbrella",
    "⭐": "star",
    "🚆": "train",
    "📦": "package",
    "⛽": "fuel",
  };

  const iconKey = iconMap[icon] || icon;
  return icons[iconKey] || <Star size={size} />;
}

interface HabitCardProps {
  habit: Habit;
  onChange?: () => void;
  habitsList?: Habit[]; // Для передачи списка привычек в модальное окно
}

export function HabitCard({ habit, onChange, habitsList = [] }: HabitCardProps) {
  const [localHabit, setLocalHabit] = useState(habit);
  const [showConfirmArchive, setShowConfirmArchive] = useState(false);
  const [showSortDialog, setShowSortDialog] = useState(false);
  const categories = getCategories();
  const habitCategories = categories.filter((cat) => habit.categoryIds?.includes(cat.id));

  const today = new Date();
  const todayProgress = getProgressForDate(habit.id, today) || { value: 0, completed: false, date: today };
  const progressPercentage = Math.min(Math.round((todayProgress.value / habit.goal) * 100), 100);

  const handleArchive = () => {
    archiveHabit(habit.id);
    if (onChange) onChange();
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

  const handleDecrement = () => {
    const newValue = Math.max(0, todayProgress.value - 1);
    const updatedHabit = updateHabitProgress(habit.id, new Date(), newValue);
    if (updatedHabit) {
      setLocalHabit(updatedHabit);
    }
  };

  const handleSort = () => {
    setShowSortDialog(true);
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
                  <span>Өңдеу</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSort}>
                <SortAsc className="mr-2 h-4 w-4" />
                <span>Әдеттерді сұрыптау</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowConfirmArchive(true)}
              >
                <Archive className="mr-2 h-4 w-4" />
                <span>Мұрағат</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {habit.description && (
          <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
        )}
        {habitCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {habitCategories.map((category) => (
              <span
                key={category.id}
                className="text-xs px-2 py-1 rounded-md"
                style={{ backgroundColor: category.color, color: "#fff" }}
              >
                {category.name}
              </span>
            ))}
          </div>
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={todayProgress.value === 0}
            >
              -1
            </Button>
            <Button variant="outline" size="sm" onClick={handleIncrement}>
              +1
            </Button>
          </div>
          <Button
            variant={todayProgress.completed ? "secondary" : "default"}
            size="sm"
            onClick={handleComplete}
            disabled={todayProgress.completed}
          >
            {todayProgress.completed ? (
              <>
                <Check className="mr-1 h-4 w-4" />
                Орындалды
              </>
            ) : (
              "Орындалуын белгілеу"
            )}
          </Button>
        </div>
      </CardFooter>

      <AlertDialog open={showConfirmArchive} onOpenChange={setShowConfirmArchive}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Сіз әдетті мұрағатқа жібергіңіз келе ме?</AlertDialogTitle>
            <AlertDialogDescription>
              "{habit.name}" әдеті мұрағатқа көшіріледі. Параметрлер бөлімінде оны қалпына келтіруге немесе біржола жоюға болады
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Болдырмау</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Мұрағат
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showSortDialog && (
        <SortDialog
          habits={habitsList}
          onClose={() => setShowSortDialog(false)}
          onSort={(sortedHabits) => {
            // Здесь можно будет сохранить новый порядок
            console.log("Sorted habits:", sortedHabits);
            if (onChange) onChange();
          }}
        />
      )}
    </Card>
  );
}

import { SortDialog } from "./sort-dialog";
