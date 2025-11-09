import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format time string to HH:mm:ss format required by backend
 * @param time - Time string in HH:mm or H:mm format
 * @returns Formatted time string in HH:mm:ss format, or undefined if input is invalid
 */
export function formatTimeForBackend(time: string | undefined): string | undefined {
  if (!time) return undefined

  const [hours, minutes] = time.split(':')
  if (!hours || !minutes) return undefined

  const paddedHours = hours.padStart(2, '0')
  const paddedMinutes = minutes.padStart(2, '0')
  return `${paddedHours}:${paddedMinutes}:00`
}

/**
 * Format time string to HH:mm format (removes seconds if present)
 * @param time - Time string in any format
 * @returns Formatted time string in HH:mm format
 */
export function formatTimeDisplay(time: string | undefined): string {
  if (!time) return ''

  const parts = time.split(':')
  const hours = parts[0]?.padStart(2, '0') || '00'
  const minutes = parts[1]?.padStart(2, '0') || '00'
  return `${hours}:${minutes}`
}
