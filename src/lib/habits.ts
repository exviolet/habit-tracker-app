"use client";

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
}

interface RawHabitProgress {
  date: string;
  value: number;
  completed: boolean;
}

// Ключ для хранения привычек в localStorage
const HABITS_STORAGE_KEY = "habits";

// Функция для получения всех привычек
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
        completed: p.completed
      }))
    }));
  } catch (e) {
    console.error("Error parsing habits from localStorage", e);
    return [];
  }
}

// Функция для сохранения всех привычек
export function saveHabits(habits: Habit[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
}

// Функция для получения привычки по ID
export function getHabitById(id: string): Habit | undefined {
  const habits = getHabits();
  return habits.find(habit => habit.id === id);
}

// Функция для создания новой привычки
export function createHabit(newHabit: NewHabit): Habit {
  const habits = getHabits();

  const habit: Habit = {
    ...newHabit,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date(),
    progress: []
  };

  saveHabits([...habits, habit]);
  return habit;
}

// Функция для обновления привычки
export function updateHabit(id: string, updatedHabit: Partial<Habit>): Habit | undefined {
  const habits = getHabits();
  const habitIndex = habits.findIndex(habit => habit.id === id);

  if (habitIndex === -1) return undefined;

  const updatedHabits = [...habits];
  updatedHabits[habitIndex] = {
    ...updatedHabits[habitIndex],
    ...updatedHabit
  };

  saveHabits(updatedHabits);
  return updatedHabits[habitIndex];
}

// Функция для удаления привычки
export function deleteHabit(id: string): boolean {
  const habits = getHabits();
  const filteredHabits = habits.filter(habit => habit.id !== id);

  if (filteredHabits.length === habits.length) return false;

  saveHabits(filteredHabits);
  return true;
}

// Функция для обновления прогресса привычки
export function updateHabitProgress(
  habitId: string,
  date: Date,
  value: number
): Habit | undefined {
  const habits = getHabits();
  const habitIndex = habits.findIndex(habit => habit.id === habitId);

  if (habitIndex === -1) return undefined;

  const habit = habits[habitIndex];

  // Проверяем, есть ли уже запись за этот день
  const dateString = date.toISOString().split('T')[0];
  const progressIndex = habit.progress.findIndex(
    p => p.date.toISOString().split('T')[0] === dateString
  );

  const updatedHabits = [...habits];

  if (progressIndex > -1) {
    // Обновляем существующую запись
    const updatedProgress = [...habit.progress];
    updatedProgress[progressIndex] = {
      date,
      value,
      completed: value >= habit.goal
    };

    updatedHabits[habitIndex] = {
      ...habit,
      progress: updatedProgress
    };
  } else {
    // Создаем новую запись
    updatedHabits[habitIndex] = {
      ...habit,
      progress: [
        ...habit.progress,
        {
          date,
          value,
          completed: value >= habit.goal
        }
      ]
    };
  }

  saveHabits(updatedHabits);
  return updatedHabits[habitIndex];
}

// Функция для получения прогресса за определенный день
export function getProgressForDate(habitId: string, date: Date): HabitProgress | undefined {
  const habit = getHabitById(habitId);
  if (!habit) return undefined;

  const dateString = date.toISOString().split('T')[0];
  return habit.progress.find(
    p => p.date.toISOString().split('T')[0] === dateString
  );
}

// Функция для получения всех иконок привычек
export function getHabitIcons(): string[] {
  return [
    "walking", "bicycle", "clock", "book", "pencil", "droplets", "cake",
    "check", "smile", "user", "coffee", "shopping-cart", "ticket", "music",
    "wrench", "umbrella", "star", "train", "package", "fuel"
  ];
}
