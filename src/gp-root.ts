import { LitElement, html, css, CSSResult } from 'lit';
import './components/gp-title-bar.js';
import './components/gp-header.js';
import './components/gp-card.js';
import './components/gp-fab.js';
import './components/gp-calendar.js';
import './components/gp-add-goal-modal.js';
import './components/gp-delete-confirm-modal.js';
import type { Card, Theme, ThemeToggleEventDetail, PaletteChangeEventDetail } from './types.js';
import { StorageService } from './services/storage.service.js';
import { JsonService } from './services/json.service.js';
import { ConfettiService } from './services/confetti.service.js';

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

export class AppRoot extends LitElement {
  static properties = {
    cards: { type: Array },
    newTitle: { type: String },
    newDescription: { type: String },
    newDueDate: { type: String },
    showForm: { type: Boolean },
    theme: { type: String },
    showCalendar: { type: Boolean },
    showDeleteConfirm: { type: Boolean },
    cardToDeleteIndex: { type: Number },
    cardToDeleteTitle: { type: String },
    showDeleteAllConfirm: { type: Boolean }
  };

  static styles: CSSResult | CSSResult[] = css`
    :host {
      display: block;
      margin: 0;
      padding: 0;
      width: 100vw;
      min-height: 100vh;
      box-sizing: border-box;
      font-family: var(--font-base);
      overflow-x: hidden;
      overflow-y: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
      --color-bg: #f5f5f5;
      --color-text: #000000;
      --color-card-bg: #ffffff;
      --color-primary: #1976d2;
      --color-primary-hover: #1565c0;
      --color-cancel-bg: #ccc;
      --color-cancel-hover: #999;
      --color-cancel-text: #333;

      background-color: var(--color-bg);
      color: var(--color-text);
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    :host([theme="blue"]) {
      --color-primary: #1976d2;
      --color-primary-hover: #1565c0;
      --color-card-bg: #ffffff;
      --color-text: #000000;
      --color-cancel-bg: #d32f2f;
      --color-cancel-text: #ffffff;
      --font-base: 'Roboto', sans-serif;
      --font-title: 'Roboto', sans-serif;
    }

    :host([theme="blue-dark"]) {
      --color-primary: #90caf9;
      --color-primary-hover: #64b5f6;
      --color-card-bg: #1e1e1e;
      --color-bg: #121212;
      --color-text: #e0e0e0;
      --color-cancel-bg: #ef5350;
      --color-cancel-text: #ffffff;
      --font-base: 'Roboto', sans-serif;
      --font-title: 'Roboto', sans-serif;
    }

    :host([theme="dark"]) {
      --color-bg: #121212;
      --color-text: #ffffff;
      --color-card-bg: #1e1e1e;
      --color-primary: #90caf9;
      --color-primary-hover: #64b5f6;
      --color-cancel-bg: #444;
      --color-cancel-hover: #666;
      --color-cancel-text: #ddd;
    }

    :host([theme="kawaii-pink"]) {
      --color-bg: #fff0f6;
      --color-text: #4a4a4a;
      --color-card-bg: #ffffff;
      --color-primary: #ffb6c1;
      --color-primary-hover: #ff91af;
      --color-cancel-bg: #ff91af;
      --color-cancel-hover: #ff6b9d;
      --color-cancel-text: #ffffff;
    }

    :host([theme="kawaii-lavender"]) {
      --color-bg: #f3e8ff;
      --color-text: #4a4a4a;
      --color-card-bg: #ffffff;
      --color-primary: #cba6f7;
      --color-primary-hover: #b185f0;
      --color-cancel-bg: #cba6f7;
      --color-cancel-hover: #b185f0;
      --color-cancel-text: #ffffff;
    }

    :host([theme="kawaii-pink-dark"]) {
      --color-bg: #2a1a1f;
      --color-text: #fce4ec;
      --color-card-bg: #3b2a30;
      --color-primary: #ff91af;
      --color-primary-hover: #ffb6c1;
      --color-cancel-bg: #ff6b9d;
      --color-cancel-hover: #ff4d7a;
      --color-cancel-text: #ffffff;
    }

    :host([theme="kawaii-lavender-dark"]) {
      --color-bg: #241a2f;
      --color-text: #ede7f6;
      --color-card-bg: #32243f;
      --color-primary: #b185f0;
      --color-primary-hover: #cba6f7;
      --color-cancel-bg: #7b1fa2;
      --color-cancel-hover: #6a1b9a;
      --color-cancel-text: #ffffff;
    }

    :host {
      --font-base: 'Quicksand', sans-serif;
      --font-title: 'Baloo 2', cursive;
    }

    main {
      padding-top: 96px;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      width: 100%;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    :host([platform="darwin"]) main {
      padding-top: 92px;
    }

    main::-webkit-scrollbar {
      display: none;
    }

    .calendar-container {
      margin-top: 1rem;
      padding-bottom: 1rem;
    }

    .file-input-hidden {
      display: none;
    }
  `;

  cards: Card[] = [];
  newTitle: string = '';
  newDescription: string = '';
  newDueDate: string = '';
  showForm: boolean = false;
  theme: Theme = "dark";
  showCalendar: boolean = false;
  showDeleteConfirm: boolean = false;
  cardToDeleteIndex: number = -1;
  cardToDeleteTitle: string = '';
  showDeleteAllConfirm: boolean = false;

  constructor() {
    super();
    this.setAttribute("theme", this.theme);
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.updatePlatform();
    this.cards = StorageService.loadCards();
    const savedTheme = StorageService.loadTheme();
    if (savedTheme) {
      this.theme = savedTheme as Theme;
      this.setAttribute("theme", this.theme);
    } else {
      this.theme = "dark";
      this.setAttribute("theme", this.theme);
    }
  }

  updatePlatform(): void {
    const platform = window.electronAPI?.platform || '';
    if (platform === 'darwin') {
      this.setAttribute('platform', 'darwin');
    }
  }

  handleFormInput(e: CustomEvent<{ field: string; value: string }>): void {
    const { field, value } = e.detail;
    if (field === 'title') {
      this.newTitle = value;
    } else if (field === 'description') {
      this.newDescription = value;
    } else if (field === 'dueDate') {
      this.newDueDate = value;
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.newTitle = '';
      this.newDescription = '';
      this.newDueDate = '';
    }
  }

  addCardFromForm(): void {
    const title = this.newTitle?.trim() || '';
    const description = this.newDescription?.trim() || '';
    const dueDate = this.newDueDate?.trim() || '';
    
    if (!title || !description || !dueDate) {
      const missingFields: string[] = [];
      if (!title) missingFields.push('Title');
      if (!description) missingFields.push('Description');
      if (!dueDate) missingFields.push('Due date');
      
      alert(`Please fill in all fields:\n${missingFields.join(', ')}`);
      return;
    }

    const trimmedTitle = title.substring(0, 500);
    const trimmedDescription = description.substring(0, 5000);
    const trimmedDueDate = dueDate.substring(0, 10);

    this.cards = [...this.cards, {
      title: trimmedTitle,
      description: trimmedDescription,
      dueDate: trimmedDueDate,
      completed: false
    }];
    this.newTitle = '';
    this.newDescription = '';
    this.newDueDate = '';
    this.showForm = false;
    StorageService.saveCards(this.cards);
    this.requestUpdate();
  }

  handleDeleteCard(e: CustomEvent<{ title: string }>, index: number): void {
    if (index >= 0 && index < this.cards.length && this.cards[index].title === e.detail.title) {
      this.cardToDeleteIndex = index;
      this.cardToDeleteTitle = e.detail.title;
      this.showDeleteConfirm = true;
      this.requestUpdate();
    }
  }

  confirmDelete(): void {
    if (this.cardToDeleteIndex >= 0 && this.cardToDeleteIndex < this.cards.length) {
      this.cards = this.cards.filter((_, index) => index !== this.cardToDeleteIndex);
      StorageService.saveCards(this.cards);
      this.cancelDelete();
      this.requestUpdate();
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.cardToDeleteIndex = -1;
    this.cardToDeleteTitle = '';
  }

  handleDeleteAll(): void {
    if (this.cards.length > 0) {
      this.showDeleteAllConfirm = true;
      this.requestUpdate();
    }
  }

  confirmDeleteAll(): void {
    this.cards = [];
    StorageService.saveCards(this.cards);
    this.cancelDeleteAll();
    this.requestUpdate();
  }

  cancelDeleteAll(): void {
    this.showDeleteAllConfirm = false;
  }

  toggleTheme(e: CustomEvent<ThemeToggleEventDetail>): void {
    this.theme = e.detail.theme;
    this.setAttribute("theme", this.theme);
    StorageService.saveTheme(this.theme);
  }

  saveJson(): void {
    JsonService.exportCards(this.cards);
  }

  async importJsonFromFile(e: Event): Promise<void> {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) {
      alert("No file selected.");
      return;
    }

    const result = await JsonService.importCards(file);
    if (result.success && result.cards) {
      this.cards = result.cards;
      StorageService.saveCards(this.cards);
      this.requestUpdate();
    } else if (result.error) {
      alert(result.error);
    }
  }

  importJson(): void {
    const fileInput = this.shadowRoot?.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  render() {
    const completedCount = this.cards.filter(c => c.completed).length;
    const totalCount = this.cards.length;

    return html`
    <gp-title-bar .theme=${this.theme}></gp-title-bar>
    
    <app-header 
      .theme=${this.theme} 
      .completedCount=${completedCount} 
      .totalCount=${totalCount}
      .showCalendar=${this.showCalendar}
      @toggle-theme=${this.toggleTheme}
      @toggle-calendar=${this.toggleCalendar}
      @change-palette=${(e: CustomEvent<PaletteChangeEventDetail>) => {
        this.theme = e.detail.palette;
        this.setAttribute("theme", this.theme);
        StorageService.saveTheme(this.theme);
      }}>
    </app-header>

    <main>
      ${this.cards.map((c, index) => html`
        <app-card 
          .title=${c.title} 
          .description=${c.description} 
          .completed=${c.completed || false}
          .dueDate=${c.dueDate || ""}
          @toggle-completed=${(e: CustomEvent<{ completed: boolean }>) => {
          const wasAllCompleted = this.cards.filter(c => c.completed).length === this.cards.length && this.cards.length > 0;
          this.cards[index].completed = e.detail.completed;
          const isAllCompleted = this.cards.filter(c => c.completed).length === this.cards.length && this.cards.length > 0;
          if (e.detail.completed && isAllCompleted && !wasAllCompleted) {
            ConfettiService.launch(this.theme);
          }
          StorageService.saveCards(this.cards);
          this.requestUpdate();
        }}
          @delete-card=${(e: CustomEvent<{ title: string }>) => {
          this.handleDeleteCard(e, index);
        }}>
        </app-card>
      `)}
    </main>

    ${this.showCalendar ? html`
      <div class="calendar-container">
        <app-calendar .cards=${this.cards}></app-calendar>
      </div>
    ` : ""}

    <input 
      type="file" 
      id="fileInput" 
      accept="application/json" 
      class="file-input-hidden"
      @change=${this.importJsonFromFile}>

    <gp-add-goal-modal
      .open=${this.showForm}
      .title=${this.newTitle}
      .description=${this.newDescription}
      .dueDate=${this.newDueDate}
      @input-change=${this.handleFormInput}
      @submit=${this.addCardFromForm}
      @cancel=${this.toggleForm}>
    </gp-add-goal-modal>

    <gp-delete-confirm-modal
      .open=${this.showDeleteConfirm}
      .title=${this.cardToDeleteTitle}
      .message=${`Are you sure you want to delete the goal "${this.cardToDeleteTitle}"?`}
      .isDeleteAll=${false}
      @confirm=${this.confirmDelete}
      @cancel=${this.cancelDelete}>
    </gp-delete-confirm-modal>

    <app-fab 
      @add-card=${this.toggleForm} 
      @save-json=${this.saveJson} 
      @import-json=${this.importJson}
      @delete-all=${this.handleDeleteAll}>
    </app-fab>

    <gp-delete-confirm-modal
      .open=${this.showDeleteAllConfirm}
      .title="Delete all goals"
      .message=${`Are you sure you want to delete all ${this.cards.length} goal${this.cards.length !== 1 ? 's' : ''}?`}
      .isDeleteAll=${true}
      @confirm=${this.confirmDeleteAll}
      @cancel=${this.cancelDeleteAll}>
    </gp-delete-confirm-modal>
  `;
  }
}
customElements.define('app-root', AppRoot);
