import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-danger-100 text-danger-800';
    case 'high':
      return 'bg-warning-100 text-warning-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'new':
      return 'bg-primary-100 text-primary-800';
    case 'acknowledged':
      return 'bg-warning-100 text-warning-800';
    case 'resolved':
      return 'bg-success-100 text-success-800';
    case 'false_positive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    self_harm: 'Self-Harm',
    suicidal_ideation: 'Suicidal Ideation',
    grooming: 'Grooming',
    cyberbullying: 'Cyberbullying',
    sexual_content: 'Sexual Content',
    violence: 'Violence/Threats',
    drugs: 'Drugs/Alcohol',
    hate_speech: 'Hate Speech',
    inappropriate_language: 'Inappropriate Language',
  };
  return labels[category] || category;
}
