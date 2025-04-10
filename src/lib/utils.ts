import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';
import { format, formatDistance } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fromBackend = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'User-Agent': process.env.APP_NAME || 'nextjs-web'
  },
  validateStatus: function (status) {
    return status < 500; // Resolve only if the status code is less than 500
  }
});

export const clientRequest = axios.create({
  validateStatus: function (status) {
    return status < 500; // Resolve only if the status code is less than 500
  }
});

export const DateFormatter = { format, formatDistance }

export const COOKIE_NAME = process.env.COOKIE_NAME || 'cookie-name-not-set';
export const TOKEN_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET);