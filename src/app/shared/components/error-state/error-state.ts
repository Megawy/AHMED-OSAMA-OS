import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
})
export class ErrorState {
  @Input({ required: true }) message!: string;
  @Input() retryLabel = 'Try Again';
  /** Illustration shown above the text. Pass '' to fall back to the icon. */
  @Input() image = '/assets/illustrations/oh-no.svg';

  readonly retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
