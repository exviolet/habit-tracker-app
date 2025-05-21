// lib/habits.ts

import { normalizeDate } from "./utils";
import type { Habit, NewHabit, HabitProgress, FrequencyType, WeekdayType } from "@/types/habit";

// Интерфейс для сырых данных из localStorage
interface RawHabit {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  specificDays?: string[];
  icon: string;
  goal: number;
  createdAt: string;
  progress: RawHabitProgress[];
  categoryIds?: string[];
}

interface RawHabitProgress {
  date: string;
  value: number;
  completed: boolean;
}

const HABITS_STORAGE_KEY = "habits";
const ARCHIVED_HABITS_STORAGE_KEY = "archivedHabits";
const HABIT_ORDER_STORAGE_KEY = "habitOrder"; // Новый ключ для порядка привычек

export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];

  const habitsJson = localStorage.getItem(HABITS_STORAGE_KEY);
  if (!habitsJson) return [];

  try {
    const rawHabits = JSON.parse(habitsJson) as RawHabit[];
    return rawHabits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency as FrequencyType,
      specificDays: habit.specificDays as WeekdayType[] | undefined,
      icon: habit.icon,
      goal: habit.goal,
      createdAt: new Date(habit.createdAt),
      progress: habit.progress.map((p) => ({
        date: new Date(p.date),
        value: p.value,
        completed: p.completed,
      })),
      categoryIds: habit.categoryIds || [],
    })).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); // Сортировка по умолчанию
  } catch (e) {
    console.error("Error parsing habits from localStorage", e);
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === "undefined") return;
  const rawHabits = habits.map((habit) => ({
    id: habit.id,
    name: habit.name,
    description: habit.description,
    frequency: habit.frequency,
    specificDays: habit.specificDays,
    icon: habit.icon,
    goal: habit.goal,
    createdAt: habit.createdAt.toISOString(),
    progress: habit.progress.map((p) => ({
      date: p.date.toISOString(),
      value: p.value,
      completed: p.completed,
    })),
    categoryIds: habit.categoryIds,
  }));
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(rawHabits));
}

// Новая функция для сохранения порядка
export function getHabitOrder(): string[] {
  if (typeof window === "undefined") return [];
  const orderJson = localStorage.getItem(HABIT_ORDER_STORAGE_KEY);
  return orderJson ? JSON.parse(orderJson) : [];
}

export function saveHabitOrder(habitIds: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HABIT_ORDER_STORAGE_KEY, JSON.stringify(habitIds));
}

export function getArchivedHabits(): Habit[] {
  if (typeof window === "undefined") return [];

  const archivedHabitsJson = localStorage.getItem(ARCHIVED_HABITS_STORAGE_KEY);
  if (!archivedHabitsJson) return [];

  try {
    const archivedHabits = JSON.parse(archivedHabitsJson) as RawHabit[];
    return archivedHabits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency as FrequencyType,
      specificDays: habit.specificDays as WeekdayType[] | undefined,
      icon: habit.icon,
      goal: habit.goal,
      createdAt: new Date(habit.createdAt),
      progress: habit.progress.map((p) => ({
        date: new Date(p.date),
        value: p.value,
        completed: p.completed,
      })),
      categoryIds: habit.categoryIds || [],
    }));
  } catch (e) {
    console.error("Error parsing archived habits from localStorage", e);
    return [];
  }
}

export function saveArchivedHabits(archivedHabits: Habit[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ARCHIVED_HABITS_STORAGE_KEY, JSON.stringify(archivedHabits));
}

export function removeCategoryFromHabits(categoryId: string): void {
  const habits = getHabits();
  const updatedHabits = habits.map((habit) => ({
    ...habit,
    categoryIds: habit.categoryIds?.filter((id) => id !== categoryId) || [],
  }));
  saveHabits(updatedHabits);

  const archivedHabits = getArchivedHabits();
  const updatedArchivedHabits = archivedHabits.map((habit) => ({
    ...habit,
    categoryIds: habit.categoryIds?.filter((id) => id !== categoryId) || [],
  }));
  saveArchivedHabits(updatedArchivedHabits);
}

export function getHabitById(id: string): Habit | undefined {
  const habits = getHabits();
  return habits.find((habit) => habit.id === id);
}

export function createHabit(newHabit: NewHabit): Habit {
  const habits = getHabits();

  const habit: Habit = {
    ...newHabit,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    progress: [],
    categoryIds: newHabit.categoryIds || [],
  };

  const updatedHabits = [...habits, habit];
  saveHabits(updatedHabits);
  return habit;
}

export function updateHabit(id: string, updatedHabit: Partial<Habit>): Habit | undefined {
  const habits = getHabits();
  const habitIndex = habits.findIndex((habit) => habit.id === id);

  if (habitIndex === -1) return undefined;

  const updatedHabits = [...habits];
  updatedHabits[habitIndex] = {
    ...updatedHabits[habitIndex],
    ...updatedHabit,
    categoryIds: updatedHabit.categoryIds || updatedHabits[habitIndex].categoryIds || [],
  };

  saveHabits(updatedHabits);
  return updatedHabits[habitIndex];
}

export function deleteHabit(id: string): boolean {
  const habits = getHabits();
  const filteredHabits = habits.filter((habit) => habit.id !== id);

  if (filteredHabits.length === habits.length) return false;

  saveHabits(filteredHabits);
  return true;
}

export function archiveHabit(id: string): boolean {
  const habits = getHabits();
  const habitIndex = habits.findIndex((habit) => habit.id === id);

  if (habitIndex === -1) return false;

  const habitToArchive = habits[habitIndex];
  const updatedHabits = habits.filter((habit) => habit.id !== id);
  saveHabits(updatedHabits);

  const archivedHabits = getArchivedHabits();
  const updatedArchivedHabits = [...archivedHabits, habitToArchive];
  saveArchivedHabits(updatedArchivedHabits);

  return true;
}

export function restoreHabit(id: string): boolean {
  const archivedHabits = getArchivedHabits();
  const habitIndex = archivedHabits.findIndex((habit) => habit.id === id);

  if (habitIndex === -1) return false;

  const habitToRestore = archivedHabits[habitIndex];
  const updatedArchivedHabits = archivedHabits.filter((habit) => habit.id !== id);
  saveArchivedHabits(updatedArchivedHabits);

  const habits = getHabits();
  const updatedHabits = [...habits, habitToRestore];
  saveHabits(updatedHabits);

  return true;
}

export function deleteArchivedHabit(id: string): boolean {
  const archivedHabits = getArchivedHabits();
  const filteredArchivedHabits = archivedHabits.filter((habit) => habit.id !== id);

  if (filteredArchivedHabits.length === archivedHabits.length) return false;

  saveArchivedHabits(filteredArchivedHabits);
  return true;
}

export function updateHabitProgress(
  habitId: string,
  date: Date,
  value: number
): Habit | undefined {
  const habits = getHabits();
  const habitIndex = habits.findIndex((habit) => habit.id === habitId);

  if (habitIndex === -1) {
    // Проверим в архиве
    const archivedHabits = getArchivedHabits();
    const archivedHabitIndex = archivedHabits.findIndex((habit) => habit.id === habitId);
    if (archivedHabitIndex === -1) return undefined;

    const habit = archivedHabits[archivedHabitIndex];
    const normalizedDate = normalizeDate(date);
    const progressIndex = habit.progress.findIndex(
      (p) => normalizeDate(p.date).getTime() === normalizedDate.getTime()
    );

    const updatedArchivedHabits = [...archivedHabits];
    if (progressIndex > -1) {
      const updatedProgress = [...habit.progress];
      updatedProgress[progressIndex] = {
        date: normalizedDate,
        value,
        completed: value >= habit.goal,
      };
      updatedArchivedHabits[archivedHabitIndex] = {
        ...habit,
        progress: updatedProgress,
      };
    } else {
      updatedArchivedHabits[archivedHabitIndex] = {
        ...habit,
        progress: [
          ...habit.progress,
          {
            date: normalizedDate,
            value,
            completed: value >= habit.goal,
          },
        ],
      };
    }
    saveArchivedHabits(updatedArchivedHabits);
    return updatedArchivedHabits[archivedHabitIndex];
  }

  const habit = habits[habitIndex];
  const normalizedDate = normalizeDate(date);
  const progressIndex = habit.progress.findIndex(
    (p) => normalizeDate(p.date).getTime() === normalizedDate.getTime()
  );

  const updatedHabits = [...habits];
  if (progressIndex > -1) {
    const updatedProgress = [...habit.progress];
    updatedProgress[progressIndex] = {
      date: normalizedDate,
      value,
      completed: value >= habit.goal,
    };
    updatedHabits[habitIndex] = {
      ...habit,
      progress: updatedProgress,
    };
  } else {
    updatedHabits[habitIndex] = {
      ...habit,
      progress: [
        ...habit.progress,
        {
          date: normalizedDate,
          value,
          completed: value >= habit.goal,
        },
      ],
    };
  }
  saveHabits(updatedHabits);
  return updatedHabits[habitIndex];
}

export function getProgressForDate(habitId: string, date: Date): HabitProgress | undefined {
  const habit = getHabitById(habitId);
  if (habit) {
    const normalizedTarget = normalizeDate(date).getTime();
    return habit.progress.find((p) => normalizeDate(p.date).getTime() === normalizedTarget);
  }

  const archivedHabits = getArchivedHabits();
  const archivedHabit = archivedHabits.find((habit) => habit.id === habitId);
  if (archivedHabit) {
    const normalizedTarget = normalizeDate(date).getTime();
    return archivedHabit.progress.find((p) => normalizeDate(p.date).getTime() === normalizedTarget);
  }

  return undefined;
}

export function getHabitIcons(): string[] {
  return [
    "walking",
    "bicycle",
    "clock",
    "book",
    "pencil",
    "droplets",
    "cake",
    "check",
    "smile",
    "user",
    "coffee",
    "shopping-cart",
    "ticket",
    "music",
    "wrench",
    "umbrella",
    "star",
    "train",
    "package",
    "fuel",
  ];
}
