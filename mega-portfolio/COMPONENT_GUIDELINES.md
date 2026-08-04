# Component Guidelines — MegaPortfolio

## Standalone Component Template

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss',
})
export class MyComponent {
  private readonly myService = inject(MyService);

  readonly items = signal<Item[]>([]);
  readonly loading = signal(false);
}
```

## Inputs / Outputs

```typescript
// Inputs with signal()
readonly title = input<string>('');
readonly items = input.required<Item[]>();

// Outputs with output()
readonly itemSelected = output<Item>();

// Emit
this.itemSelected.emit(item);
```

## CRUD Page Pattern

Every admin CRUD page follows this structure:

```typescript
export class AdminXxx {
  private readonly service = inject(AdminXxxService);

  readonly items = computed(() => this.service.items());
  readonly loading = computed(() => this.service.loading());
  readonly form = signal<Partial<Xxx>>({});
  readonly editingId = signal<string | null>(null);
  readonly showModal = signal(false);
  readonly search = signal('');

  updateField<K extends keyof Xxx>(key: K, value: Xxx[K]): void {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.set({});
    this.showModal.set(true);
  }

  openEdit(item: Xxx): void {
    this.editingId.set(item.id);
    this.form.set({ ...item });
    this.showModal.set(true);
  }

  async save(): Promise<void> {
    const data = this.form() as Omit<Xxx, 'id'>;
    if (this.editingId()) {
      await this.service.update(this.editingId()!, data);
    } else {
      await this.service.create(data);
    }
    this.showModal.set(false);
  }

  async delete(id: string): Promise<void> {
    if (confirm('Delete this item?')) {
      await this.service.delete(id);
    }
  }
}
```

## Template Binding Pattern

```html
<!-- Text input -->
<input [ngModel]="form().name"
       (ngModelChange)="updateField('name', $event)"
       name="name" placeholder="Name" />

<!-- Select -->
<select [ngModel]="form().category"
        (ngModelChange)="updateField('category', $event)"
        name="category" aria-label="Category">
  <option value="">Select...</option>
  <option value="a">Option A</option>
</select>

<!-- Checkbox -->
<label class="checkbox">
  <input type="checkbox"
         [ngModel]="form().active"
         (ngModelChange)="updateField('active', $event)"
         name="active" />
  Active
</label>
```

## Lifecycle Rules

| Hook | Use For |
|------|---------|
| `constructor()` | DI only (`inject()`) |
| `ngOnInit()` | Load data from services |
| `afterNextRender()` | DOM access, GSAP animations |
| `ngOnDestroy()` | Cleanup animations, subscriptions |

## Animation Setup

```typescript
private readonly animation = inject(AnimationService);
private animations: gsap.core.Tween[] = [];

afterNextRender(async () => {
  const elements = document.querySelectorAll('.reveal');
  this.animations = elements.map(el => this.animation.reveal(el));
});

ngOnDestroy() {
  this.animations?.forEach(a => a.kill());
}
```

## Responsive Design

```scss
// Grid with overflow protection
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(0, 1fr));
  gap: 1.5rem;
}

// Breakpoints
@media (max-width: 768px) { /* tablet */ }
@media (max-width: 600px) { /* mobile */ }
```

## Shared Admin Styles

All CRUD pages use global `.admin-page` classes from `styles.scss`:

- `.admin-page .page-header` — Title + action button
- `.admin-page .toolbar` — Search + filter bar
- `.admin-page .data-table` — Responsive table
- `.admin-page .badge` — Status badges (`.new`, `.read`, `.archived`)
- `.admin-page .btn-primary/.btn-secondary/.btn-danger` — Buttons
- `.admin-page .modal-backdrop/.modal` — Modal overlay
- `.admin-page .form-grid/.field` — Form layout
- `.admin-page .pagination` — Page controls
- `.admin-page .loading/.empty/.alert` — State indicators

Per-page SCSS only needs `:host { display: block; }` plus page-specific overrides.
