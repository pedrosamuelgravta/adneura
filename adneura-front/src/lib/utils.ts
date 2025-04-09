import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatStep = (step: string) => {
  return step.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const formatBrandName = (name: string) => {
  if (!name) {
    return "";
  }
  const lastLetter = name.slice(-1);
  if (lastLetter === "s") {
    return name + "'";
  } else {
    return name + "'s";
  }
};
