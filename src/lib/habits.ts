// lib/habits.ts
"use client";

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

export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];

  const habitsJson = localStorage.getItem(HABITS_STORAGE_KEY);
  if (!habitsJson) return [];

  try {
    const habits = JSON.parse(habitsJson) as RawHabit[];
    return habits.map((habit) => ({
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
    console.error("Error parsing habits from localStorage", e);
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
}

// Новая функция для удаления categoryId из всех привычек
export function removeCategoryFromHabits(categoryId: string): void {
  const habits = getHabits();
  const updatedHabits = habits.map((habit) => ({
    ...habit,
    categoryIds: habit.categoryIds?.filter((id) => id !== categoryId) || [],
  }));
  saveHabits(updatedHabits);
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

export function updateHabitProgress(
  habitId: string,
  date: Date,
  value: number
): Habit | undefined {
  const habits = getHabits();
  const habitIndex = habits.findIndex((habit) => habit.id === habitId);

  if (habitIndex === -1) return undefined;

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
  if (!habit) return undefined;

  const normalizedTarget = normalizeDate(date).getTime();
  return habit.progress.find(
    (p) => normalizeDate(p.date).getTime() === normalizedTarget
  );
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
