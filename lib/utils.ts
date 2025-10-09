import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LucideBriefcase,LucideUser } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const roles = [
  {
    label: "Manager",
    description: "Manage projects, assign tasks, and track progress efficiently.",
    icon: LucideBriefcase,
  },
  {
    label: "Team Member",
    description: "Collaborate on tasks and contribute to your team's goals.",
    icon: LucideUser,
  },
];