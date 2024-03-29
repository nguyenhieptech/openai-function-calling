import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * `baseURL: 'http://localhost:3333/api/v1/'` if using `NestJS`
 */
export const http = axios.create({ baseURL: 'http://localhost:3333/api/v1/' });
