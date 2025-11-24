import { LitElement, html, css, CSSResult } from 'lit';
import type { Theme } from '../types.js';

export class AppHeader extends LitElement {
  static properties = {
    theme: { type: String },
    completedCount: { type: Number },
    totalCount: { type: Number },
    showCalendar: { type: Boolean }
  };

  static styles: CSSResult | CSSResult[] = css`
    header {
      position: fixed;
      top: 32px;
      left: 0;
      width: 100%;
      background-color: var(--color-primary);
      color: white;
      height: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-title);
      font-size: 20px;
      font-weight: 500;
      box-shadow: 0px 2px 4px rgba(0,0,0,0.2);
      padding: 0 24px;
      z-index: 1500;
      box-sizing: border-box;
    }

    .title {
      flex-shrink: 0;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
      margin-right: 32px;
    }

    .progress {
      font-size: 16px;
      opacity: 0.9;
    }

    button {
      font-family: inherit;
      font-size: 16px;
      padding: 6px 10px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      background: var(--color-bg);
      color: var(--color-primary);
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    button:hover {
      background-color: var(--color-primary-hover);
      color: white;
    }

    button.theme-toggle {
      font-size: 22px;
      border-radius: 50%;
      padding: 0;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-card-bg);
      color: var(--color-primary);
      line-height: 1;
    }

    button.theme-toggle span {
      display: inline-block;
      line-height: 1;
      font-size: 20px;
    }

    button.theme-toggle:hover {
      transform: rotate(20deg);
    }
  `;

  theme: Theme = "dark";
  completedCount: number = 0;
  totalCount: number = 0;
  showCalendar: boolean = false;

  toggleTheme(): void {
    const base = this.theme.includes("pink") ? "kawaii-pink"
               : this.theme.includes("lavender") ? "kawaii-lavender"
               : this.theme.includes("blue") ? "blue"
               : "dark";

    const isDark = this.theme.includes("dark");
    const newTheme = (isDark ? base : `${base}-dark`) as Theme;

    this.dispatchEvent(new CustomEvent('toggle-theme', {
      detail: { theme: newTheme },
      bubbles: true,
      composed: true
    }));
  }

  toggleCalendar(): void {
    this.dispatchEvent(new CustomEvent('toggle-calendar', { bubbles: true, composed: true }));
  }

  changePalette(e: Event): void {
    const target = e.target as HTMLSelectElement;
    const base = target.value;
    const isDark = this.theme.includes("dark");
    const newTheme = (isDark ? `${base}-dark` : base) as Theme;
    this.dispatchEvent(new CustomEvent('change-palette', {
      detail: { palette: newTheme },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const allDone = this.completedCount === this.totalCount && this.totalCount > 0;
    const isDark = this.theme.includes("dark");

    return html`
      <header>
        <div class="title">My Goals 💫</div>
        <div class="controls">
          <span class="progress ${allDone ? 'all-done' : ''}">
            Completed: ${this.completedCount} / ${this.totalCount}
            ${allDone ? " 🎉" : ""}
          </span>
          <button @click=${this.toggleCalendar}>
            ${this.showCalendar ? "📅 Hide" : "📅 Show"}
          </button>
          <select @change=${this.changePalette}>
            <option value="kawaii-pink" ?selected=${this.theme.includes("pink")}>🌸 Pink</option>
            <option value="kawaii-lavender" ?selected=${this.theme.includes("lavender")}>💜 Lavender</option>
            <option value="blue" ?selected=${this.theme.includes("blue")}>🔵 Blue</option>
          </select>
          <button class="theme-toggle" @click=${this.toggleTheme}>
            <span>${isDark ? "🌙" : "☀️"}</span>
          </button>
        </div>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);

