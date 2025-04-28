"use client";

import { useState } from "react";
import {
  Book,
  Bike,
  Clock,
  Pencil,
  Droplets,
  Cake,
  Check,
  Smile,
  User,
  Coffee,
  ShoppingCart,
  Ticket,
  Music,
  Wrench,
  Umbrella,
  Star,
  Train,
  Package,
  Fuel
} from "lucide-react";
import { getHabitIcons } from "@/lib/habits";

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

// Компонент для отображения иконки привычки
function HabitIcon({ icon, size = 24 }: { icon: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    book: <Book size={size} />,
    bicycle: <Bike size={size} />,
    clock: <Clock size={size} />,
    pencil: <Pencil size={size} />,
    droplets: <Droplets size={size} />,
    cake: <Cake size={size} />,
    check: <Check size={size} />,
    smile: <Smile size={size} />,
    user: <User size={size} />,
    coffee: <Coffee size={size} />,
    "shopping-cart": <ShoppingCart size={size} />,
    ticket: <Ticket size={size} />,
    music: <Music size={size} />,
    wrench: <Wrench size={size} />,
    umbrella: <Umbrella size={size} />,
    star: <Star size={size} />,
    train: <Train size={size} />,
    package: <Package size={size} />,
    fuel: <Fuel size={size} />,
  };

  return icons[icon] || <Star size={size} />;
}

export function IconSelector({ selectedIcon, onSelectIcon }: IconSelectorProps) {
  const habitIcons = getHabitIcons();

  return (
    <div className="grid grid-cols-5 gap-2">
      {habitIcons.map((icon) => (
        <div
          key={icon}
          className={`flex items-center justify-center p-3 cursor-pointer rounded-md
            ${selectedIcon === icon
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
            }`}
          onClick={() => onSelectIcon(icon)}
        >
          <HabitIcon icon={icon} />
        </div>
      ))}
    </div>
  );
}
