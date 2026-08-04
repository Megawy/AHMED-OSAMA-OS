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

  readonly action = output<void>();

  onAction(): void {
    this.action.emit();
  }
}
