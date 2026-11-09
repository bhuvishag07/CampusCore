import { ToneIndex } from '@/types';

export function getTone(index: number): ToneIndex {
  return (index % 3) as ToneIndex;
}

export function getInitials(name: string): string {
  if (!name) return 'CH';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const toneBgClasses = ['tone-0', 'tone-1', 'tone-2'] as const;
