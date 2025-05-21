// components/habits/sort-dialog.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { GripVertical, Check } from "lucide-react";
import type { Habit } from "@/types/habit";
import { saveHabitOrder } from "@/lib/habits";
import { HabitIcon } from "./habit-card";

interface SortDialogProps {
  habits: Habit[];
  onClose: () => void;
  onSort: (habits: Habit[]) => void;
}

interface SortableItemProps {
  habit: Habit;
}

function SortableItem({ habit }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { scale: "1.05" } : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 mb-2 rounded-md bg-muted transition-all duration-200"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      <div className="flex items-center gap-2 flex-1">
        <div className="bg-muted p-2 rounded-md">
          <HabitIcon icon={habit.icon} />
        </div>
        <span>{habit.name}</span>
      </div>
    </div>
  );
}

export function SortDialog({ habits, onClose, onSort }: SortDialogProps) {
  const [items, setItems] = useState(habits);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);

  useEffect(() => {
    setItems(habits);
  }, [habits]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 500, // Активация через 500 мс (долгое нажатие)
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((h) => h.id === active.id);
        const newIndex = items.findIndex((h) => h.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setIsDraggingEnabled(false);
    setActiveHabitId(null);
  };

  const handleSave = () => {
    onSort(items);
    saveHabitOrder(items.map((h) => h.id));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-4 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-2">Отсортировать привычки</h3>
        <p className="text-sm text-muted-foreground mb-2">Зажмите элемент, чтобы перетащить</p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={() => setIsDraggingEnabled(true)}
        >
          <SortableContext items={items.map((h) => h.id)}>
            {items.map((habit) => (
              <SortableItem key={habit.id} habit={habit} />
            ))}
          </SortableContext>
        </DndContext>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" /> Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}
