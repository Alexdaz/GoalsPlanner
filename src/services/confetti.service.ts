import confetti from 'canvas-confetti';
import type { Theme } from '../types.js';

export class ConfettiService {
  private static readonly BLUE_THEME_COLORS = [
    '#FFD700', '#FFA500', '#FFC107', '#FFEB3B', '#FFD54F',
    '#FF1744', '#E91E63', '#F44336',
    '#1976D2', '#2196F3', '#03A9F4'
  ];

  private static readonly DEFAULT_COLORS = [
    '#ffb6c1', '#cba6f7', '#90caf9', '#fce4ec'
  ];

  private static randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static launch(theme: Theme): void {
    const isBlueTheme = theme === 'blue' || theme === 'blue-dark';
    const colors = isBlueTheme ? this.BLUE_THEME_COLORS : this.DEFAULT_COLORS;
    
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: colors
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: this.randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: this.randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }
}

