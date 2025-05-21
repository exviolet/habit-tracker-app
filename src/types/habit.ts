// Тип для частоты привычки
export type FrequencyType = 'daily' | 'weekly' | 'specificDays';

// Тип для дней недели
export type WeekdayType = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Интерфейс для привычки
export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: FrequencyType;
  specificDays?: WeekdayType[];
  icon: string;
  goal: number;
  createdAt: Date;
  progress: HabitProgress[];
  categoryIds: string[];
}

// Интерфейс для прогресса привычки
export interface HabitProgress {
  date: Date;
  value: number;
  completed: boolean;
}

// Тип для создания новой привычки (без id, createdAt и progress)
export type NewHabit = Omit<Habit, 'id' | 'createdAt' | 'progress'> & { categoryIds: string[] };
