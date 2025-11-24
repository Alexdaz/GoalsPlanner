import type { Card } from '../types.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_CARDS = 10000;
const MAX_TITLE_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 5000;

export class JsonService {
  static validateCard(card: unknown): card is Card {
    return (
      card !== null &&
      typeof card === 'object' &&
      'title' in card &&
      'description' in card &&
      typeof (card as Card).title === "string" &&
      (card as Card).title.trim() !== "" &&
      typeof (card as Card).description === "string" &&
      (card as Card).title.length <= MAX_TITLE_LENGTH &&
      (card as Card).description.length <= MAX_DESCRIPTION_LENGTH
    );
  }

  static validateCards(cards: unknown): cards is Card[] {
    if (!Array.isArray(cards)) {
      return false;
    }
    return cards.every(card => this.validateCard(card));
  }

  static exportCards(cards: Card[]): void {
    if (!cards || cards.length === 0) {
      alert("No cards to save.");
      return;
    }

    const validCards = cards.filter(card => this.validateCard(card));

    if (validCards.length === 0) {
      alert("No valid cards to save.");
      return;
    }

    if (validCards.length !== cards.length) {
      alert("Some cards were omitted due to incorrect structure.");
    }

    const data = JSON.stringify(validCards, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "goals.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    const fileName = file.name;
    
    if (!fileName.toLowerCase().endsWith(".json") || 
        fileName.includes("..") || 
        fileName.includes("/") || 
        fileName.includes("\\")) {
      return { valid: false, error: "Please select a valid .json file." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File is too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` };
    }

    if (file.type && !file.type.includes("json") && file.type !== "application/json") {
      return { valid: false, error: "File does not appear to be a valid JSON file." };
    }

    return { valid: true };
  }

  static async importCards(file: File): Promise<{ success: boolean; cards?: Card[]; error?: string }> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          
          if (result.length > MAX_FILE_SIZE) {
            resolve({ success: false, error: "File content is too large." });
            return;
          }

          const data = JSON.parse(result) as unknown;

          if (!Array.isArray(data)) {
            resolve({ success: false, error: "File must contain an array of cards." });
            return;
          }

          if (data.length > MAX_CARDS) {
            resolve({ success: false, error: `File contains too many cards (${data.length}). Maximum allowed is ${MAX_CARDS}.` });
            return;
          }

          const validCards = data.filter(card => this.validateCard(card)) as Card[];

          if (validCards.length !== data.length) {
            alert("Some cards do not have the correct structure or exceed size limits.");
          }

          resolve({ success: true, cards: validCards });
        } catch (err) {
          resolve({ success: false, error: "JSON file is invalid or corrupted." });
          console.error("Error importing JSON:", err);
        }
      };
      
      reader.onerror = () => {
        resolve({ success: false, error: "Error reading file." });
      };
      
      reader.readAsText(file);
    });
  }
}

