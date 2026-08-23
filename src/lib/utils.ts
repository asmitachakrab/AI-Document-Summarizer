import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number of bytes into a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates if the uploaded file is of an accepted type.
 */
export function isValidFileType(file: File): boolean {
  const validTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/tiff',
  ];
  return validTypes.includes(file.type);
}

/**
 * Extracts the extension from a filename.
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Estimates reading time based on word count.
 */
export function estimateReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200);
  return minutes <= 1 ? '1 min read' : `${minutes} min read`;
}

/**
 * Counts the number of words in a text string.
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
