// components/CircularProgressBar.tsx
import React from "react";
import { useTheme } from "next-themes";

interface CircularProgressBarProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  completedColor?: string;
  emptyColor?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress,
  size = 24,
  strokeWidth = 3,
  completedColor = "#22c55e",
  emptyColor,
}) => {
  const { theme } = useTheme();
  const defaultEmptyColor = theme === "dark" ? "#4b5563" : "#e5e7eb"; // Тёмно-серый для тёмной темы

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        stroke={emptyColor || defaultEmptyColor}
        fill="none"
        strokeWidth={strokeWidth}
        cx={size / 2}
        cy={size / 2}
        r={radius}
      />
      {progress > 0 && (
        <circle
          stroke={completedColor}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="transition-all duration-500 ease-in-out"
        />
      )}
    </svg>
  );
};

export default CircularProgressBar;
