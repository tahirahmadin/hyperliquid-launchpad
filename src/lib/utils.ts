import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProgressPercent(
  totalRaised: string,
  targetAmount: string
): string {
  return ((Number(totalRaised) * 100) / Number(targetAmount)).toFixed(2);
}

export function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? Number(value) : value;

  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num.toFixed(2)}`;
}

export function formatTimeRemaining(
  startAt: string,
  endAt: string
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date().getTime();
  const end = new Date(endAt).getTime();
  const timeLeft = end - now;

  if (timeLeft <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}
