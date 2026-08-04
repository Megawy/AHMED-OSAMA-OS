import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { SERVICES, ArchitectureService } from '@core/data/architecture.data';

@Component({
  selector: 'app-microservices-diagram',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './microservices-diagram.html',
  styleUrl: './microservices-diagram.scss',
})
export class MicroservicesDiagram {
  readonly services: ArchitectureService[] = SERVICES;
}
