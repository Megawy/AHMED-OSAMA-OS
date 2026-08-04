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

  readonly retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
