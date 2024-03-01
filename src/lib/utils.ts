import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormat(value: Date | string) {
  const date = new Date(value);
  return format(date, "dd/MM/yyyy");
}

export function englishDateFormat(value: Date | string) {
  const date = new Date(value);
  return format(date, "yyyy-MM-dd");
}

export function StringDateFormat(value: Date | string) {
  const date = new Date(value);
  date.setHours(date.getHours() + 3);
  return date.toISOString();
}
