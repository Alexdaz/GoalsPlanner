import { LitElement, html, css, CSSResult } from 'lit';

export class DeleteConfirmModal extends LitElement {
  static properties = {
    open: { type: Boolean },
    title: { type: String },
    message: { type: String },
    isDeleteAll: { type: Boolean }
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

    .modal-title,
    .modal-message {
      margin: 0 0 1rem 0;
      color: var(--color-text);
    }

    .modal-warning {
      margin: 0 0 1rem 0;
      font-size: 12px;
      color: var(--color-text);
      opacity: 0.7;
    }
  `;

  open: boolean = false;
  title: string = '';
  message: string = '';
  isDeleteAll: boolean = false;

  private handleConfirm(): void {
    this.dispatchEvent(new CustomEvent('confirm', {
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
          <h3 class="modal-title">⚠️ Confirm deletion</h3>
          <p class="modal-message">
            ${this.message}
          </p>
          <p class="modal-warning">
            This action cannot be undone.
          </p>
          <div class="actions">
            <button type="button" class="cancel-no-bg" @click=${this.handleCancel}>Cancel</button>
            <button type="submit" @click=${this.handleConfirm}>
              ${this.isDeleteAll ? 'Delete all' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('gp-delete-confirm-modal', DeleteConfirmModal);

