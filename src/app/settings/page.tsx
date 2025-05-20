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
      <h1 className="text-2xl font-bold">Параметрлер</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Сыртқы түрі</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <Label htmlFor="theme-toggle">Түнгі тема</Label>
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
          <CardTitle className="text-lg">Тіл</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <Label>Тілді таңдаңыз</Label>
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
          <CardTitle className="text-lg text-destructive">Қауіпті аймақ</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full"
            onClick={clearAllData}
          >
            Барлық деректерді жою
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Бұл әрекет сіздің барлық әдеттеріңізді және прогресс тарихын жояды. Бұл әрекетті жою мүмкін емес.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
