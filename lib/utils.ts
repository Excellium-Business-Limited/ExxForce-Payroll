import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a number to Nigerian Naira using Intl and replacing NGN with ₦
export function formatNaira(amount: number | string | undefined | null, fallback: string = '₦0.00') {
  if (amount === null || amount === undefined) return fallback;
  const num = typeof amount === 'string' ? Number(amount) : amount;
  if (!isFinite(num as number)) return fallback;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(num as number).replace('NGN', '₦');
}
