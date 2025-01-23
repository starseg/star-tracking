import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse } from "date-fns";
import { toast } from "react-toastify";

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

export function dateTimeFormat(date: string | undefined) {
  if (date) {
    const parsedDate = parse(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date());
    return format(parsedDate, "yyyy-MM-dd'T'HH:mm");
  } else return "";
}

export function Toast(message: string, type: string) {
  if (type === "error") {
    return toast.error(message, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  if (type === "success") {
    return toast.success(message, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
}

export const status = [
  {
    value: "ACTIVE",
    label: "Ativo",
  },
  {
    value: "INACTIVE",
    label: "Inativo",
  },
];
