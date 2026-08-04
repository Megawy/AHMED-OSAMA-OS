import { Component } from '@angular/core';

import { Hero } from '../../sections/hero/hero';
import { ArchitecturePreview } from '../../sections/architecture-preview/architecture-preview';
import { FeaturedProjects } from '../../sections/featured-projects/featured-projects';
import { SystemDesignLab } from '../../sections/system-design-lab/system-design-lab';
import { TechRadar } from '../../sections/tech-radar/tech-radar';
import { Stats } from '../../sections/stats/stats';
// import { OverflowDetector } from '../../components/overflow-detector/overflow-detector';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Hero,
    ArchitecturePreview,
    FeaturedProjects,
    SystemDesignLab,
    TechRadar,
    Stats,
    // OverflowDetector,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
