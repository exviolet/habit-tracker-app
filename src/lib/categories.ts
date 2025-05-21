// lib/categories.ts
import type { Category } from "@/types/category";

const CATEGORIES_KEY = "categories";
const MAX_CATEGORIES = 10;

// Получить все категории
export function getCategories(): Category[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CATEGORIES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveCategories(categories: Category[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// Создать новую категорию
export function createCategory(category: Omit<Category, "id">): Category | null {
  const categories = getCategories();
  if (categories.length >= MAX_CATEGORIES) {
    return null; // Лимит категорий достигнут
  }
  const newCategory: Category = {
    id: crypto.randomUUID(),
    ...category,
  };
  const updatedCategories = [...categories, newCategory];
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
  return newCategory;
}

// Обновить категорию
export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories();
  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) return null;
  const updatedCategory = { ...categories[index], ...updates };
  categories[index] = updatedCategory;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  return updatedCategory;
}

// Новая функция для удаления категории
export function deleteCategory(categoryId: string): boolean {
  const categories = getCategories();
  const filteredCategories = categories.filter((category) => category.id !== categoryId);

  if (filteredCategories.length === categories.length) {
    return false; // Категория не найдена
  }

  saveCategories(filteredCategories);
  return true;
}
