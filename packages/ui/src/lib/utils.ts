import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化数字
export const formatNumber = (num: number, decimals: number = 1): string => {
  if (num == 0) {
    return `${num}`;
  }

  const units = ["", "K", "M", "B"];

  const order = Math.floor(Math.log10(num) / 3);
  const unitName = units[order];
  const value = (num / Math.pow(1000, order)).toFixed(decimals);

  return `${value}${unitName}`;
};
