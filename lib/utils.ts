import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getRiskColor(level: string): string {
  const colors: Record<string, string> = {
    critical: '#EF4444',
    high: '#F59E0B',
    medium: '#3B82F6',
    low: '#22C55E',
    minimal: '#94A3B8',
  };
  return colors[level] || colors.minimal;
}

export function getSeverityColor(severity: string): string {
  return getRiskColor(severity);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    online: '#22C55E',
    offline: '#EF4444',
    warning: '#F59E0B',
    maintenance: '#3B82F6',
    active: '#EF4444',
    investigating: '#F59E0B',
    contained: '#3B82F6',
    resolved: '#22C55E',
    closed: '#94A3B8',
  };
  return colors[status] || '#94A3B8';
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
