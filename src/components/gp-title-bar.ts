import { LitElement, html, css, CSSResult } from 'lit';
import type { Theme } from '../types.js';

declare global {
  interface Window {
    electronAPI?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      platform?: string;
    };
  }
}

export class TitleBar extends LitElement {
  static properties = {
    theme: { type: String }
  };

  static styles: CSSResult | CSSResult[] = css`
    :host {
      display: block;
      -webkit-app-region: drag;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 32px;
      background-color: var(--color-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      font-family: var(--font-title);
      font-size: 12px;
      user-select: none;
      z-index: 2000;
      box-sizing: border-box;
    }

    :host([platform="darwin"]) {
      display: none;
    }

    .window-controls {
      display: flex;
      -webkit-app-region: no-drag;
      gap: 2px;
      margin-left: auto;
    }

    .window-button {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: background-color 0.2s ease;
      border-radius: 4px;
    }

    .window-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .window-button.close:hover {
      background-color: #e81123;
      color: white;
    }

    .window-button.minimize:hover,
    .window-button.maximize:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }

    :host([theme*="dark"]) .window-button {
      color: rgba(255, 255, 255, 0.9);
    }

    :host([theme*="dark"]) .window-button:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }

    :host([theme*="kawaii"]) .window-button {
      color: rgba(255, 255, 255, 0.95);
    }

    :host([theme*="kawaii"]) .window-button.close:hover {
      background-color: #ff6b9d;
    }
  `;

  theme: Theme = "dark";

  connectedCallback(): void {
    super.connectedCallback();
    this.updatePlatform();
    this.updateTheme();
    const root = this.getRootNode() as ShadowRoot | Document;
    const appRoot = root.querySelector('app-root') as HTMLElement;
    if (appRoot) {
      const observer = new MutationObserver(() => {
        this.updateTheme();
      });
      observer.observe(appRoot, {
        attributes: true,
        attributeFilter: ['theme']
      });
    }
  }

  updatePlatform(): void {
    const platform = window.electronAPI?.platform || '';
    if (platform === 'darwin') {
      this.setAttribute('platform', 'darwin');
    }
  }

  updateTheme(): void {
    const root = this.getRootNode() as ShadowRoot | Document;
    const appRoot = root.querySelector('app-root') as HTMLElement;
    if (appRoot) {
      const themeAttr = appRoot.getAttribute('theme');
      if (themeAttr) {
        this.theme = themeAttr as Theme;
        this.setAttribute('theme', this.theme);
      }
    }
  }

  minimizeWindow(): void {
    if (window.electronAPI) {
      window.electronAPI.minimize();
    }
  }

  maximizeWindow(): void {
    if (window.electronAPI) {
      window.electronAPI.maximize();
    }
  }

  closeWindow(): void {
    if (window.electronAPI) {
      window.electronAPI.close();
    }
  }

  render() {
    return html`
      <div class="window-controls">
        <button 
          class="window-button minimize" 
          @click=${this.minimizeWindow}
          title="Minimizar">
          <span>−</span>
        </button>
        <button 
          class="window-button maximize" 
          @click=${this.maximizeWindow}
          title="Maximizar">
          <span>□</span>
        </button>
        <button 
          class="window-button close" 
          @click=${this.closeWindow}
          title="Cerrar">
          <span>×</span>
        </button>
      </div>
    `;
  }
}

customElements.define('gp-title-bar', TitleBar);

