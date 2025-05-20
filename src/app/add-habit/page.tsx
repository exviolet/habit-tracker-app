"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createHabit, getHabitIcons } from "@/lib/habits";
import type { FrequencyType, NewHabit } from "@/types/habit";
import { IconSelector } from "@/components/habits/icon-selector";

export default function AddHabitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<NewHabit>>({
    name: "",
    description: "",
    frequency: "daily",
    goal: 1,
    icon: "star",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.frequency || !formData.icon || !formData.goal) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    createHabit(formData as NewHabit);
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
        <h1 className="text-2xl font-bold">Жаңа әдет</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Әдетті құру</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Аты *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Мысалы: кітап оқу"
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
                defaultValue={formData.frequency}
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
              <Label htmlFor="goal">Мақсаты (саны) *</Label>
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
          <CardFooter>
            <Button className="w-full" type="submit">
              Сақтау
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
