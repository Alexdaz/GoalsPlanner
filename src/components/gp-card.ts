import { LitElement, html, css, CSSResult } from 'lit';
import type { Card } from '../types.js';

export class AppCard extends LitElement {
  static properties = {
    title: { type: String },
    description: { type: String },
    completed: { type: Boolean },
    dueDate: { type: String }
  };

  static styles: CSSResult | CSSResult[] = css`
    .card {
      margin-top: 80px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 1rem auto;
      padding: 1rem;
      width: 500px;
      min-height: 120px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      background: var(--color-card-bg);
      color: var(--color-text);
      font-family: var(--font-base);
      box-sizing: border-box;
      transition: background-color 0.3s ease, color 0.3s ease;
      position: relative;
    }

    h2 {
      font-weight: bold;
      margin: 0 0 0.5rem 0;
      font-size: 20px;
      color: var(--color-text);
    }

    p {
      margin: 0 0 0.5rem 0;
      color: var(--color-text);
      font-size: 18px;
      line-height: 1.4;
    }

    .date {
      font-size: 14px;
      margin-top: 0.5rem;
    }

    .overdue {
      color: #e53935;
      font-weight: bold;
    }

    .completed {
      text-decoration: line-through;
      opacity: 0.6;
    }

    .card-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      gap: 4px;
    }

    button {
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s ease;
    }

    button:hover {
      background: var(--color-primary-hover);
    }

    button.delete {
      background: var(--color-cancel-bg);
      color: var(--color-cancel-text);
    }

    button.delete:hover {
      background: var(--color-cancel-hover);
    }
  `;

  title: string = '';
  description: string = '';
  completed: boolean = false;
  dueDate: string = "";

  constructor() {
    super();
  }

  toggleCompleted(): void {
    this.completed = !this.completed;
    this.dispatchEvent(new CustomEvent("toggle-completed", {
      detail: { title: this.title, completed: this.completed },
      bubbles: true,
      composed: true
    }));
  }

  deleteCard(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const event = new CustomEvent("delete-card", {
      detail: { title: this.title },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  isOverdue(): boolean {
    if (!this.dueDate || this.completed) return false;
    const today = new Date();
    const due = new Date(this.dueDate);
    return due < today;
  }

  render() {
    const overdue = this.isOverdue();
    return html`
      <div class="card ${this.completed ? 'completed' : ''}">
        <h2>${this.title}</h2>
        <p>${this.description}</p>
        ${this.dueDate ? html`
          <div class="date ${overdue ? 'overdue' : ''}">
            Due date: ${this.dueDate} ${overdue ? "⚠️" : ""}
          </div>` : ""}
        <div class="card-actions">
          <button class="delete" @click=${this.deleteCard} title="Delete goal">
            x
          </button>
          <button @click=${this.toggleCompleted}>
            ${this.completed ? "Unmark" : "Complete"}
          </button>
        </div>
      </div>
    `;
  }

  getJson(): Card {
    return {
      title: this.title,
      description: this.description,
      completed: this.completed,
      dueDate: this.dueDate
    };
  }
}

customElements.define('app-card', AppCard);

