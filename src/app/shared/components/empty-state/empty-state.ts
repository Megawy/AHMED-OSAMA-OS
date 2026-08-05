import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input() icon = '🔍';
  @Input() actionLabel = '';
  /** Illustration shown above the text. Pass '' to fall back to the emoji icon. */
  @Input() image = '/assets/illustrations/no-data.svg';

  readonly action = output<void>();

  onAction(): void {
    this.action.emit();
  }
}
