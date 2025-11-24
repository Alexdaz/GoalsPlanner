import { LitElement, html, css, CSSResult } from 'lit';
import type { Card } from '../types.js';

export class AppCalendar extends LitElement {
  static properties = {
    cards: { type: Array },
    month: { type: Number },
    year: { type: Number },
    weekStart: { type: Number }
  };

  static styles: CSSResult | CSSResult[] = css`
    :host {
      display: block;
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
      box-sizing: border-box;
      position: relative;
    }
    .calendar-container {
      margin: 1rem;
      text-align: center;
      max-width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
    }
    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-bottom: 0.5rem;
      font-family: var(--font-title);
      flex-wrap: wrap;
    }
    .calendar {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      max-width: 100%;
      box-sizing: border-box;
    }
    .day-name {
      font-family: var(--font-title);
      font-weight: bold;
      font-size: 14px;
      text-align: center;
      padding: 6px 4px;
      background: var(--color-primary);
      color: white;
      border-radius: 6px;
    }
    .day, .empty {
      min-height: 90px;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 4px;
      background: var(--color-card-bg);
      color: var(--color-text);
      font-size: 12px;
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
      word-wrap: break-word;
    }
    .empty {
      background: rgba(0,0,0,0.03);
    }
    .date {
      font-weight: bold;
      font-size: 14px;
    }
    .meta {
      font-size: 12px;
      margin-top: 4px;
      padding: 2px 4px;
      border-radius: 4px;
      background: var(--color-primary);
      color: white;
      word-break: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .overdue { background: #e53935; }
    .completed { background: #4caf50; }
  `;

  cards: Card[] = [];
  month: number = 0;
  year: number = 2024;
  weekStart: number = 0;

  constructor() {
    super();
    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.weekStart = 0;
  }

  getDayNames(): string[] {
    const namesSunFirst = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (this.weekStart === 0) return namesSunFirst;
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  }

  getMonthCells(): (Date | null)[] {
    const firstDay = new Date(this.year, this.month, 1);
    const lastDay = new Date(this.year, this.month + 1, 0);
    const totalDays = lastDay.getDate();

    const firstDow = firstDay.getDay();
    const offset = (firstDow - this.weekStart + 7) % 7;

    const cells: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(new Date(this.year, this.month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    while (cells.length < 42) cells.push(null);

    return cells;
  }

  prevMonth(): void {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this.requestUpdate();
  }

  nextMonth(): void {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this.requestUpdate();
  }

  private escapeICSField(field: string): string {
    return field
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "")
      .substring(0, 1000);
  }

  exportToICS(): void {
    if (!this.cards || this.cards.length === 0) {
      alert("No goals to export.");
      return;
    }

    let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//MyGoals//EN\r\n";
    this.cards.forEach((card, index) => {
      if (card.dueDate) {
        const dateMatch = card.dueDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!dateMatch) {
          return;
        }

        const startDate = card.dueDate.replace(/-/g, "");
        const endDate = startDate;
        
        const safeTitle = this.escapeICSField(card.title || "");
        const safeDescription = this.escapeICSField(card.description || "");
        
        icsContent += "BEGIN:VEVENT\r\n";
        icsContent += `UID:${index}@my-goals\r\n`;
        icsContent += `DTSTAMP:${startDate}T000000Z\r\n`;
        icsContent += `DTSTART;VALUE=DATE:${startDate}\r\n`;
        icsContent += `DTEND;VALUE=DATE:${endDate}\r\n`;
        icsContent += `SUMMARY:${safeTitle}\r\n`;
        icsContent += `DESCRIPTION:${safeDescription}\r\n`;
        icsContent += "END:VEVENT\r\n";
      }
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "goals-calendar.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  render() {
    const monthName = new Date(this.year, this.month).toLocaleString("en-US", { month: "long" });
    const dayNames = this.getDayNames();
    const cells = this.getMonthCells();

    return html`
      <div class="calendar-container">
        <div class="controls">
          <button @click=${this.prevMonth}>◀️</button>
          <span><strong>${monthName} ${this.year}</strong></span>
          <button @click=${this.nextMonth}>▶️</button>
          <button @click=${this.exportToICS}>📅 Export .ICS</button>
        </div>

        <div class="calendar">
          ${dayNames.map(name => html`<div class="day-name">${name}</div>`)}
          ${cells.map(day => {
            if (!day) return html`<div class="empty"></div>`;
            const iso = new Date(day.getFullYear(), day.getMonth(), day.getDate()).toISOString().split("T")[0];
            const metas = this.cards.filter(c => c.dueDate === iso);
            return html`
              <div class="day">
                <div class="date">${day.getDate()}</div>
                ${metas.map(m => html`
                  <div class="meta ${m.completed ? 'completed' : (new Date(m.dueDate!) < new Date() ? 'overdue' : '')}">
                    ${m.title}
                  </div>
                `)}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

customElements.define('app-calendar', AppCalendar);

