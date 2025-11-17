"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getHabitById, updateHabit } from "@/lib/habits";
import type { FrequencyType, Habit } from "@/types/habit";
import { IconSelector } from "@/components/habits/icon-selector";

function EditHabitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [habit, setHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState<Partial<Habit>>({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }
    const loadedHabit = getHabitById(id);
    if (loadedHabit) {
      setHabit(loadedHabit);
      setFormData({
        name: loadedHabit.name,
        description: loadedHabit.description,
        frequency: loadedHabit.frequency,
        goal: loadedHabit.goal,
        icon: loadedHabit.icon,
      });
    } else {
      setNotFound(true);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.frequency || !formData.icon || !formData.goal) {
      alert("Барлық қажетті өрістерді толтырыңыз!");
      return;
    }

    updateHabit(id, formData);
    router.push("/habits");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const numValue = Number.parseInt(value, 10);
    if (!Number.isNaN(numValue) && numValue > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  if (notFound) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/habits")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Әдет табылмады</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Көрсетілген идентификаторы бар әдет табылмады. Ол жойылған болуы мүмкін
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => router.push("/habits")}
            >
              Әдеттер тізіміне оралу
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Жүктелуде...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Әдетті өңдеу</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Әдетті жаңарту</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Аты *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Мысалы: Кітап оқу"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Сипаттама</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Әдеттің қосымша сипаттамасы"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="frequency">Жиілігі *</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) =>
                  handleSelectChange("frequency", value as FrequencyType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Жиілігті таңдау" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Күнделікті</SelectItem>
                  <SelectItem value="weekly">Апта сайын</SelectItem>
                  <SelectItem value="specificDays">Апта күндері бойынша</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="goal">Күніне орындалуы *</Label>
              <Input
                id="goal"
                name="goal"
                type="number"
                min="1"
                value={formData.goal}
                onChange={handleNumberChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Белгіше *</Label>
              <IconSelector
                selectedIcon={formData.icon || "star"}
                onSelectIcon={(icon) => handleSelectChange("icon", icon)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" className="w-1/2" onClick={() => router.back()}>
              Болдырмау
            </Button>
            <Button className="w-1/2" type="submit">
              Сақтау
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function EditHabitPage() {
  return (
    <Suspense fallback={<div>Жүктелуде...</div>}>
      <EditHabitContent />
    </Suspense>
  );
}
