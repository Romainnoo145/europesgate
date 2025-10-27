import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Get the API URL with smart detection for development and production
 *
 * Priority:
 * 1. Use NEXT_PUBLIC_API_URL env var if set
 * 2. Detect localhost and use common development port (8006)
 * 3. For production, use same hostname with port 8000
 *
 * @returns API URL string
 */
export function getApiUrl(): string {
  // Priority 1: Use env var if set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Priority 2: Detect environment
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      // Development: use common local backend port
      return 'http://localhost:8006';
    } else {
      // Production: use same host with backend port
      return `${window.location.protocol}//${window.location.hostname}:8000`;
    }
  }

  // Fallback for SSR
  return 'http://localhost:8006';
}