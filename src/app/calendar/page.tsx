"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isToday } from "date-fns";
import { ru } from "date-fns/locale";
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
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

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

  // Проверка статуса выполнения привычки в определенный день
  const getStatusForDay = (date: Date) => {
    if (!selectedHabitData) return "none";

    const progress = getProgressForDate(selectedHabitData.id, date);
    if (!progress) return "none";
    return progress.completed ? "completed" : "incomplete";
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Календарь привычек</h1>

      {habits.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              У вас пока нет привычек. Создайте привычки для отслеживания в календаре.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Выберите привычку</label>
            <Select
              value={selectedHabit}
              onValueChange={setSelectedHabit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите привычку" />
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
                  {format(currentDate, "LLLL yyyy", { locale: ru })}
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
                  const status = getStatusForDay(day);
                  return (
                    <div
                      key={day.toString()}
                      className={`h-9 flex items-center justify-center rounded-full text-sm
                        ${isToday(day) ? "border border-primary" : ""}
                        ${status === "completed" ? "bg-green-500/20 dark:bg-green-500/20" : ""}
                        ${status === "incomplete" ? "bg-red-500/20 dark:bg-red-500/20" : ""}
                      `}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-green-500/20" />
                  <span>Выполнено</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-red-500/20" />
                  <span>Не выполнено</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
