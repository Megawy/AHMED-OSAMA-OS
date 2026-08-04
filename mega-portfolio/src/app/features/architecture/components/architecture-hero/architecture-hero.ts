import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-architecture-hero',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './architecture-hero.html',
  styleUrl: './architecture-hero.scss',
})
export class ArchitectureHero {}
