import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-admin-select',
  standalone: true,
  template: `
    <div class="select" [class.open]="open()" [class.disabled]="disabled()">
      <button
        type="button"
        class="trigger"
        role="combobox"
        [attr.aria-expanded]="open()"
        aria-haspopup="listbox"
        [disabled]="disabled()"
        (click)="toggle()"
        (keydown)="onKeydown($event)"
      >
        <span [class.muted]="!value()">{{ value() || placeholder() }}</span>
        <svg
          class="chevron"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      @if (open()) {
        <div class="panel" role="listbox">
          @if (searchable()) {
            <input
              #searchInput
              class="search"
              type="text"
              [value]="query()"
              (input)="onQuery($event)"
              (keydown)="onKeydown($event)"
              placeholder="Search..."
              aria-label="Search options"
            />
          }
          @for (opt of filtered(); track opt; let i = $index) {
            <button
              type="button"
              class="option"
              role="option"
              [attr.aria-selected]="opt === value()"
              [class.active]="i === highlighted()"
              [class.selected]="opt === value()"
              (click)="choose(opt)"
              (mouseenter)="highlighted.set(i)"
            >
              {{ opt }}
              @if (opt === value()) {
                <span class="check" aria-hidden="true">✓</span>
              }
            </button>
          } @empty {
            <div class="option empty">No results</div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }

      /* Keep an open panel above sibling cards (e.g. sticky .form-side cards
         in the project drawer would otherwise paint over the options). */
      :host(.open) {
        z-index: 40;
      }

      .select.disabled .trigger {
        opacity: 0.45;
        cursor: not-allowed;
      }

      .trigger {
        width: 100%;
        height: 3.125rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0 1rem;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.02);
        color: #f8fafc;
        font-size: 0.8125rem;
        font-family: inherit;
        cursor: pointer;
        transition:
          border-color 0.15s,
          box-shadow 0.15s;
      }

      .trigger:hover:not(:disabled) {
        border-color: rgba(255, 255, 255, 0.12);
      }

      .trigger:focus-visible,
      .select.open .trigger {
        border-color: #00e5ff;
        box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.08);
        outline: none;
      }

      .trigger .muted {
        color: #475569;
      }

      .chevron {
        color: #64748b;
        flex-shrink: 0;
        transition: transform 0.15s;
      }

      .select.open .chevron {
        transform: rotate(180deg);
      }

      .panel {
        position: absolute;
        top: calc(100% + 6px);
        inset-inline-start: 0;
        inset-inline-end: 0;
        z-index: 30;
        background: #0f172a;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
        padding: 0.375rem;
        max-height: 250px;
        overflow-y: auto;
        animation: asIn 0.15s ease;
      }

      @keyframes asIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }

      .search {
        width: 100%;
        height: 2.25rem;
        margin-bottom: 0.375rem;
        padding: 0 0.75rem;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.02);
        color: #f8fafc;
        font-size: 0.75rem;
        font-family: inherit;
        outline: none;
      }

      .search:focus {
        border-color: #00e5ff;
      }

      .option {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.5rem 0.625rem;
        border: none;
        background: transparent;
        color: #cbd5e1;
        font-size: 0.8125rem;
        font-family: inherit;
        border-radius: 8px;
        cursor: pointer;
        text-align: start;
      }

      .option.active,
      .option:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #f8fafc;
      }

      .option.selected {
        color: #00e5ff;
      }

      .check {
        color: #00e5ff;
        font-size: 0.75rem;
      }

      .option.empty {
        color: #475569;
        cursor: default;
      }
    `,
  ],
  host: {
    '[class.open]': 'open()',
    '(document:click)': 'onDocClick($event)',
  },
})
export class AdminSelect {
  private readonly el = inject(ElementRef);
  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  readonly options = input.required<string[]>();
  readonly value = model<string>('');
  readonly placeholder = input<string>('Select...');
  readonly disabled = input<boolean>(false);

  readonly open = signal<boolean>(false);
  readonly query = signal<string>('');
  readonly highlighted = signal<number>(0);

  readonly searchable = computed<boolean>(() => this.options().length > 6);

  readonly filtered = computed<string[]>(() => {
    const q = this.query().toLowerCase();
    return q ? this.options().filter((o) => o.toLowerCase().includes(q)) : this.options();
  });

  toggle(): void {
    if (this.disabled()) return;
    this.open.update((v) => !v);
    if (this.open()) {
      this.query.set('');
      this.highlighted.set(0);
      setTimeout(() => this.searchInput?.nativeElement.focus());
    }
  }

  choose(option: string): void {
    this.value.set(option);
    this.open.set(false);
  }

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.highlighted.set(0);
  }

  onKeydown(event: KeyboardEvent): void {
    const list = this.filtered();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open()) this.toggle();
        else this.highlighted.update((h) => Math.min(h + 1, list.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlighted.update((h) => Math.max(h - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (this.open() && list[this.highlighted()]) this.choose(list[this.highlighted()]);
        else this.toggle();
        break;
      case 'Escape':
      case 'Tab':
        this.open.set(false);
        break;
    }
  }

  onDocClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) this.open.set(false);
  }
}
