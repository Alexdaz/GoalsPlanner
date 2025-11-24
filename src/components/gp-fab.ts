import { LitElement, html, css, CSSResult } from 'lit';

export class AppFab extends LitElement {
  static styles: CSSResult | CSSResult[] = css`
  .fab {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    transition: transform 0.3s ease, background 0.3s ease;
    z-index: 1000;
  }

  .fab:active {
    transform: scale(0.95);
  }

  .fab.open {
    transform: rotate(45deg);   
    background: var(--color-cancel-bg);
    color: var(--color-cancel-text);
  }

  .menu {
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: var(--color-card-bg);
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    opacity: 0;
    transform: translateY(20px);
    pointer-events: none;
    transition: all 0.3s ease;
    z-index: 999;
  }

  .menu.show {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .menu button {
    background: none;
    border: none;
    padding: 10px 16px;
    text-align: left;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    transition: background 0.2s ease;
    color: var(--color-text);
  }

  .menu button:hover {
    background: var(--color-primary-hover);
    color: white;
  }
`;

  static properties = {
    open: { type: Boolean }
  };

  open: boolean = false;
  private _handleOutsideClick: (e: MouseEvent) => void;
  private _handleKeydown: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this._handleOutsideClick = this.handleOutsideClick.bind(this);
    this._handleKeydown = this.handleKeydown.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click', this._handleOutsideClick);
    document.addEventListener('keydown', this._handleKeydown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
    document.removeEventListener('keydown', this._handleKeydown);
  }

  handleOutsideClick(e: MouseEvent): void {
    const path = e.composedPath ? e.composedPath() : [];
    const clickedInside = path.includes(this);
    if (this.open && !clickedInside) {
      this.open = false;
    }
  }

  handleKeydown(e: KeyboardEvent): void {
    if (this.open && e.key === 'Escape') {
      this.open = false;
    }
  }

  toggleMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.open = !this.open;
  }

  render() {
    return html`
      <div class="fab ${this.open ? 'open' : ''}" @click=${this.toggleMenu}>
        ${this.open ? '✕' : '+'}
      </div>
      <div class="menu ${this.open ? 'show' : ''}" @click=${(e: Event) => e.stopPropagation()}>
        <button @click=${() => this.dispatchEvent(new CustomEvent('add-card'))}>➕ Add goal</button>
        <button @click=${() => this.dispatchEvent(new CustomEvent('save-json'))}>💾 Save JSON</button>
        <button @click=${() => this.dispatchEvent(new CustomEvent('import-json'))}>📂 Import JSON</button>
        <button @click=${() => this.dispatchEvent(new CustomEvent('delete-all'))}>🗑️ Delete all goals</button>
      </div>
    `;
  }
}

customElements.define('app-fab', AppFab);

