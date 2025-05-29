// app/calendar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isToday } from "date-fns";
import { ka, kk, ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getHabits, getProgressForDate } from "@/lib/habits";
import type { Habit } from "@/types/habit";
import CircularProgressBar from "@/components/CircularProgressBar";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<string>("");

  useEffect(() => {
    const loadedHabits = getHabits();
    setHabits(loadedHabits);
    if (loadedHabits.length > 0 && !selectedHabit) {
      setSelectedHabit(loadedHabits[0].id);
    }
  }, [selectedHabit]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startWeekDay = getDay(monthStart);

  // Названия дней недели
  const weekDays = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жк"];

  // Переход к следующему месяцу
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Переход к предыдущему месяцу
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Получение выбранной привычки
  const selectedHabitData = habits.find(habit => habit.id === selectedHabit);

  // Получение прогресса для дня
  const getProgressForDay = (date: Date) => {
    if (!selectedHabitData) return { progress: 0, completed: false };

    const progressData = getProgressForDate(selectedHabitData.id, date);
    if (!progressData) return { progress: 0, completed: false };

    const progress = progressData.value / selectedHabitData.goal; // Например, 2/3 = 0.66
    return { progress: Math.min(progress, 1), completed: progressData.completed };
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Әдеттер күнтізбесі</h1>

      {habits.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Сізде әлі әдеттеріңіз жоқ. Күнтізбеде бақылау үшін әдеттерді жасаңыз.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Әдетті таңдаңыз</label>
            <Select
              value={selectedHabit}
              onValueChange={setSelectedHabit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Әдетті таңдаңыз" />
              </SelectTrigger>
              <SelectContent>
                {habits.map(habit => (
                  <SelectItem key={habit.id} value={habit.id}>
                    {habit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft />
                </Button>
                <CardTitle>
                  {format(currentDate, "LLLL yyyy", { locale: kk })}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {/* Пустые клетки для правильного начала месяца */}
                {Array.from({ length: startWeekDay === 0 ? 6 : startWeekDay - 1 }).map((_, index) => (
                  <div key={`empty-start-${currentDate.getMonth()}-${index}`} className="h-9" />
                ))}

                {/* Дни месяца */}
                {monthDays.map(day => {
                  const { progress, completed } = getProgressForDay(day);
                  const isCurrentDay = isToday(day);
                  return (
                    <div
                      key={day.toString()}
                      className={`h-10 w-10 flex items-center justify-center rounded-full text-sm relative
                        ${isCurrentDay ? "border-2 border-primary" : ""}
                      `}
                      style={{ aspectRatio: "1 / 1" }} // Убеждаемся, что ячейка квадратная
                    >
                      {/* Прогресс-бар в виде круга */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CircularProgressBar
                          progress={progress}
                          size={32}
                          strokeWidth={3}
                        />
                      </div>
                      {/* Число дня с круглым контуром */}
                      <span
                        className={`relative z-10 `}
                        style={{ aspectRatio: "1 / 1" }}
                      >
                        {format(day, "d")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
