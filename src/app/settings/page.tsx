"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Пока что имитация языков
const languages = [
  { value: "ru", label: "Русский" },
  { value: "kk", label: "Қазақша" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState("ru");

  // Предотвращаем несоответствие рендеринга между сервером и клиентом
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // В реальном приложении здесь должно быть переключение языка
  };

  const clearAllData = () => {
    if (typeof window !== "undefined" &&
        window.confirm("Вы уверены, что хотите удалить все данные приложения? Это действие нельзя отменить.")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Настройки</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Внешний вид</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <Label htmlFor="theme-toggle">Темная тема</Label>
            </div>
            <Switch
              id="theme-toggle"
              checked={isDark}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Язык</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <Label>Выберите язык</Label>
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите язык" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Опасная зона</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full"
            onClick={clearAllData}
          >
            Удалить все данные
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Это действие удалит все ваши привычки и историю прогресса. Это действие нельзя отменить.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
