import { clsx, type ClassValue } from 'clsx';

/** Merge conditional class names together. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Simulate a network delay for mock services. */
export function mockDelay<T>(data: T, ms = 1200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/** Format an ISO date string consistently across the app. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Format an ISO date string with time. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Format a relative time string, e.g. "3 hours ago". */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.round((now - date) / 1000);
  const units: [number, string][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.345, 'week'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ];
  let value = diffSec;
  let unitLabel = 'second';
  for (const [amount, label] of units) {
    if (Math.abs(value) < amount) {
      unitLabel = label;
      break;
    }
    value = Math.round(value / amount);
    unitLabel = label;
  }
  return `${value} ${unitLabel}${Math.abs(value) !== 1 ? 's' : ''} ago`;
}

/** Format bytes/KB into a human readable size. */
export function formatFileSize(kb: number): string {
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/** Format a number with thousands separators. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/** Copy text to the clipboard, returning success state. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Generate a pseudo-unique id for mock records. */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
