export interface Card {
  title: string;
  description: string;
  dueDate?: string;
  completed: boolean;
}

export type Theme = 
  | "blue" 
  | "blue-dark" 
  | "dark" 
  | "kawaii-pink" 
  | "kawaii-lavender" 
  | "kawaii-pink-dark" 
  | "kawaii-lavender-dark";

export interface ThemeToggleEventDetail {
  theme: Theme;
}

export interface PaletteChangeEventDetail {
  palette: Theme;
}

export interface ToggleCompletedEventDetail {
  title: string;
  completed: boolean;
}


