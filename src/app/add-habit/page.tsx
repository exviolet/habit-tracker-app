// app/add-habit/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createHabit, getHabitIcons } from "@/lib/habits";
import { getCategories, createCategory } from "@/lib/categories";
import type { FrequencyType, NewHabit } from "@/types/habit";
import type { Category } from "@/types/category";
import { IconSelector } from "@/components/habits/icon-selector";

export default function AddHabitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<NewHabit>>({
    name: "",
    description: "",
    frequency: "daily",
    goal: 1,
    icon: "star",
    categoryIds: [],
  });
  const [categories, setCategories] = useState<Category[]>(getCategories());
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "star", color: "#FF6B6B" });

  const colors = [
    "#FF6B6B", "#FF8E53", "#FFCE56", "#4BC0C0", "#36A2EB",
    "#9966FF", "#FF9FF3", "#4CAF50", "#607D8B", "#B0BEC5",
  ];

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.frequency || !formData.icon || !formData.goal) {
    alert("Пожалуйста, заполните все обязательные поля");
    return;
  }
  createHabit(formData as NewHabit);
  router.push("/habits"); // Возвращаемся на страницу привычек
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = Number.parseInt(value, 10);
    if (!Number.isNaN(numValue) && numValue > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const currentCategories = formData.categoryIds || [];
    const updatedCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];
    setFormData((prev) => ({
      ...prev,
      categoryIds: updatedCategories,
    }));
  };

  const handleCreateCategory = () => {
    const createdCategory = createCategory(newCategory);
    if (!createdCategory) {
      alert("Достигнут лимит категорий (максимум 10)");
      return;
    }
    setCategories([...categories, createdCategory]);
    setFormData((prev) => ({
      ...prev,
      categoryIds: [...(prev.categoryIds || []), createdCategory.id],
    }));
    setShowCreateCategory(false);
    setNewCategory({ name: "", icon: "star", color: "#FF6B6B" });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Новая привычка</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Создать привычку</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Например: читать книгу"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Дополнительное описание привычки"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="frequency">Частота *</Label>
              <Select
                defaultValue={formData.frequency}
                onValueChange={(value) =>
                  handleSelectChange("frequency", value as FrequencyType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите частоту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Ежедневно</SelectItem>
                  <SelectItem value="weekly">Еженедельно</SelectItem>
                  <SelectItem value="specificDays">По дням недели</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="goal">Цель (количество) *</Label>
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
              <Label>Иконка *</Label>
              <IconSelector
                selectedIcon={formData.icon || "star"}
                onSelectIcon={(icon) => handleSelectChange("icon", icon)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Категории</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      formData.categoryIds?.includes(category.id)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleCategoryChange(category.id)}
                    style={{ backgroundColor: formData.categoryIds?.includes(category.id) ? category.color : undefined }}
                  >
                    {category.name}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setShowCreateCategory(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Создать категорию
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Сохранить
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать новую категорию</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="categoryName">Название категории *</Label>
              <Input
                id="categoryName"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Например: Здоровье"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Иконка *</Label>
              <IconSelector
                selectedIcon={newCategory.icon}
                onSelectIcon={(icon) =>
                  setNewCategory((prev) => ({ ...prev, icon }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Цвет *</Label>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`w-10 h-10 rounded-md cursor-pointer border-2 ${
                      newCategory.color === color ? "border-primary" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      setNewCategory((prev) => ({ ...prev, color }))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCategory(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateCategory} disabled={!newCategory.name}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
