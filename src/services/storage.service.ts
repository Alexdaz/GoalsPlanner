import type { Card } from '../types.js';

const STORAGE_KEYS = {
  CARDS: 'cards',
  THEME: 'theme'
} as const;

const MAX_STORAGE_SIZE = 5 * 1024 * 1024;

export class StorageService {
  static saveCards(cards: Card[]): void {
    try {
      const data = JSON.stringify(cards);
      if (data.length > MAX_STORAGE_SIZE) {
        alert("Data is too large to save. Please export some data first.");
        return;
      }
      localStorage.setItem(STORAGE_KEYS.CARDS, data);
    } catch (err) {
      if (err instanceof DOMException && err.name === "QuotaExceededError") {
        alert("Not enough storage space. Please export some data first.");
      } else {
        alert("Error saving data.");
        console.error("Error saving to localStorage:", err);
      }
    }
  }

  static loadCards(): Card[] {
    const savedCards = localStorage.getItem(STORAGE_KEYS.CARDS);
    if (savedCards) {
      try {
        return JSON.parse(savedCards) as Card[];
      } catch {
        return [];
      }
    }
    return [];
  }

  static saveTheme(theme: string): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  static loadTheme(): string | null {
    return localStorage.getItem(STORAGE_KEYS.THEME);
  }
}

