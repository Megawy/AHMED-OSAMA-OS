import { Component, input } from '@angular/core';

@Component({
  selector: 'app-admin-card',
  standalone: true,
  templateUrl: './admin-card.html',
  styleUrl: './admin-card.scss',
})
export class AdminCard {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly variant = input<'default' | 'danger'>('default');
}
