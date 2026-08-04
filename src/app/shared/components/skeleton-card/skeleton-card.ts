import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  templateUrl: './skeleton-card.html',
  styleUrl: './skeleton-card.scss',
})
export class SkeletonCard {
  @Input() count = 1;
}
