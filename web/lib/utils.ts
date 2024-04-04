import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = 'http://localhost:3333/api/v1';

/**
 * `baseURL: 'http://localhost:3333/api/v1/'`
 */
export const http = axios.create({ baseURL: `${API_URL}/` });
