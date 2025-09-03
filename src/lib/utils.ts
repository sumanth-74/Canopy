import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-GB').format(num)
}

export function calculateCPM(impressions: number, spend: number): number {
  return (spend / impressions) * 1000
}

export function calculateImpressions(budget: number, cpm: number = 7): number {
  return Math.round((budget / cpm) * 1000)
}
