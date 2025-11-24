import { LitElement, html, css, CSSResult } from 'lit';

export class AddGoalModal extends LitElement {
  static properties = {
    open: { type: Boolean },
    title: { type: String },
    description: { type: String },
    dueDate: { type: String }
  };

  static styles: CSSResult | CSSResult[] = css`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3000;
    }

    .modal {
      background: var(--color-card-bg);
      color: var(--color-text);
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 300px;
      width: 100%;
      animation: fadeIn 0.3s ease;
      box-sizing: border-box;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    input, textarea {
      font-family: var(--font-base);
      font-size: 14px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      outline: none;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      margin-bottom: 0.75rem;
      resize: vertical;
      background: var(--color-card-bg);
      color: var(--color-text);
    }

    :host([theme="blue"]) input,
    :host([theme="blue"]) textarea,
    :host([theme="blue-dark"]) input,
    :host([theme="blue-dark"]) textarea {
      font-family: 'Roboto', sans-serif;
    }

    input:focus, textarea:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 4px rgba(25,118,210,0.3);
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    button {
      background: transparent;
      color: var(--color-primary-hover);
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s ease, color 0.2s ease;
    }

    button:hover {
      background: var(--color-primary-hover);
      color: white;
    }

    .cancel-no-bg {
      background: transparent;
      color: var(--color-text);
      transition: background 0.2s ease, color 0.2s ease;
    }

    .cancel-no-bg:hover {
      background: rgba(0, 0, 0, 0.1);
      color: var(--color-text);
    }

    :host([theme*="dark"]) .cancel-no-bg:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `;

  open: boolean = false;
  title: string = '';
  description: string = '';
  dueDate: string = '';

  private handleInput(e: Event): void {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const field = target.name;
    const value = target.value;

    this.dispatchEvent(new CustomEvent('input-change', {
      detail: { field, value },
      bubbles: true,
      composed: true
    }));
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('submit', {
      bubbles: true,
      composed: true
    }));
  }

  private handleCancel(): void {
    this.dispatchEvent(new CustomEvent('cancel', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (!this.open) {
      return html``;
    }

    return html`
      <div class="modal-overlay" @click=${this.handleCancel}>
        <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
          <form @submit=${this.handleSubmit}>
            <input 
              type="text" 
              name="title" 
              .value=${this.title} 
              placeholder="Title" 
              @input=${this.handleInput} 
              required>
            <textarea 
              name="description" 
              .value=${this.description} 
              placeholder="Description" 
              @input=${this.handleInput} 
              required></textarea>
            <input 
              type="date" 
              name="dueDate" 
              .value=${this.dueDate || ''} 
              @input=${this.handleInput}
              required>
            <div class="actions">
              <button type="button" class="cancel-no-bg" @click=${this.handleCancel}>Cancel</button>
              <button type="submit">Add</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }
}

customElements.define('gp-add-goal-modal', AddGoalModal);

