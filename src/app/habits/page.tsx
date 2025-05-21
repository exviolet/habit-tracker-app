// app/habits/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/mode-toggle";
import { getHabits, removeCategoryFromHabits, getHabitOrder } from "@/lib/habits";
import { getCategories, deleteCategory } from "@/lib/categories";
import type { Habit } from "@/types/habit";
import type { Category } from "@/types/category";
import { HabitCard } from "@/components/habits/habit-card";
import {
  Book,
  Bike,
  Clock,
  Pencil,
  Droplets,
  Cake,
  Check,
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

function CategoryIcon({ icon, isActive, activeColor }: { icon: string; isActive: boolean; activeColor?: string }) {
  const size = 16;
  const icons: Record<string, React.ReactNode> = {
    book: <Book size={size} />,
    bicycle: <Bike size={size} />,
    clock: <Clock size={size} />,
    pencil: <Pencil size={size} />,
    droplets: <Droplets size={size} />,
    cake: <Cake size={size} />,
    check: <Check size={size} />,
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
  return (
    <span style={isActive && activeColor ? { color: activeColor } : {}}>
      {icons[icon] || <Star size={size} />}
    </span>
  );
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const tabsListRef = useRef<HTMLDivElement>(null);

const loadData = () => {
  const allHabits = getHabits();
  console.log("allHabits:", allHabits); // Отладка
  if (!Array.isArray(allHabits)) {
    console.error("getHabits returned invalid data:", allHabits);
    setHabits([]);
    return;
  }

  const order = getHabitOrder();
  console.log("order:", order); // Отладка
  if (!Array.isArray(order)) {
    console.error("getHabitOrder returned invalid data:", order);
    setHabits(allHabits);
    return;
  }

  const orderedHabits = order.length > 0
    ? order.map((id) => allHabits.find((h) => h.id === id)).filter((h): h is Habit => Boolean(h))
    : allHabits;
  setHabits(orderedHabits);

  const categories = getCategories();
  console.log("categories:", categories); // Отладка
  setCategories(categories);
};

  useEffect(() => {
    loadData();
    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener("storage", handleStorageChange);

    if (tabsListRef.current) {
      tabsListRef.current.scrollLeft = 0;
    }

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filteredHabits =
    selectedCategory === "all" || selectedCategory === null
      ? habits
      : selectedCategory === "no-category"
      ? habits.filter((habit) => !habit.categoryIds || habit.categoryIds.length === 0)
      : habits.filter((habit) => habit.categoryIds?.includes(selectedCategory));

  const scrollLeft = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

const handleLongPressStart = (categoryId: string) => {
  longPressTimeout.current = setTimeout(() => {
    handleDeleteCategory(categoryId);
  }, 1000);
};

const handleLongPressEnd = () => {
  if (longPressTimeout.current) {
    clearTimeout(longPressTimeout.current);
    longPressTimeout.current = null;
  }
};

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить категорию?`)) {
      const success = deleteCategory(categoryId);
      if (success) {
        removeCategoryFromHabits(categoryId);
        loadData();
        if (selectedCategory === categoryId) {
          setSelectedCategory(null);
        }
      } else {
        alert("Не удалось удалить категорию.");
      }
    }
  };

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

<div className="relative">
  <Tabs
    defaultValue="all"
    value={selectedCategory || "all"}
    onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
  >
    <div className="flex gap-2 mb-4">
      <Button
        variant={selectedCategory === null ? "secondary" : "ghost"}
        onClick={() => setSelectedCategory(null)}
      >
        Все
      </Button>
      <Button
        variant={selectedCategory === "no-category" ? "secondary" : "ghost"}
        onClick={() => setSelectedCategory("no-category")}
      >
        Без категории
      </Button>
    </div>

    {categories.length > 0 && (
      <TabsList
        ref={tabsListRef}
        className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide justify-start"
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <div key={category.id} className="relative flex items-center">
              <TabsTrigger
                value={category.id}
                className="flex items-center gap-2 text-white data-[state=active]:bg-background whitespace-nowrap pr-6"
                style={isActive ? { backgroundColor: "#fff" } : { backgroundColor: category.color }}
                onMouseDown={() => handleLongPressStart(category.id)}
                onMouseUp={handleLongPressEnd}
                onTouchStart={() => handleLongPressStart(category.id)}
                onTouchEnd={handleLongPressEnd}
              >
                <CategoryIcon icon={category.icon} isActive={isActive} activeColor={category.color} />
                <span style={isActive ? { color: category.color } : {}}>
                  {category.name}
                </span>
              </TabsTrigger>
            </div>
          );
        })}
      </TabsList>
    )}
  </Tabs>
</div>

      {filteredHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-muted-foreground text-center">
            У вас пока нет привычек. Нажмите на кнопку "+", чтобы добавить первую привычку.
          </p>
          <Link href="/add-habit">
            <Button>Добавить привычку</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onChange={loadData}
              habitsList={filteredHabits} // Передаём список привычек
            />
          ))}
        </div>
      )}
    </div>
  );
}
