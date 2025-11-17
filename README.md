# Habit Tracker

A modern and intuitive application to help you build and maintain good habits. Track your progress, organize your goals, and stay motivated on your journey to self-improvement.

## ✨ Features

- **Habit Management:** Easily create, edit, archive, and delete habits.
- **Progress Tracking:** Log your daily progress and see how you're doing at a glance.
- **Categorization:** Organize your habits with custom categories, colors, and icons.
- **Calendar View:** Visualize your consistency and progress over time with a dedicated calendar.
- **Customizable Goals:** Set specific goals for each habit (e.g., run 5 km, read 30 pages).
- **Sorting:** Arrange your habits in the order that works best for you.
- **Light & Dark Mode:** Switch between themes for your viewing comfort.
- **Responsive Design:** Works beautifully on both desktop and mobile devices.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
- **State Management:** React Hooks & `localStorage`
- **Date & Time:** [date-fns](https://date-fns.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Package Manager:** [Bun](https://bun.sh/)

## 🚀 Getting Started

### Prerequisites

Make sure you have [Bun](httpss://bun.sh/docs/installation) installed on your system.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd habit-tracker-app
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Run the development server:**
    ```bash
    bun run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚙️ Scripts

| Script | Description                               | Command        |
| :------| :-----------------------------------------| :--------------|
| dev    | Runs the application in development mode. | `bun run dev`  |
| build  | Creates an optimized production build.    | `bun run build`|
| start  | Starts the built application.             | `bun run start`|
| lint   | Main check script: Executes Biome (formatting + linting) and runs TypeScript type checking. | `bun run lint` |
