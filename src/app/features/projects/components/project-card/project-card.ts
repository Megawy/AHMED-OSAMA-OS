import { Component, Input, inject, signal } from "@angular/core";
import { Project } from "@core/models/project.model";
import { TechnologyService } from "@core/services/technology.service";

@Component({
  selector: "app-project-card",
  standalone: true,
  imports: [],
  templateUrl: "./project-card.html",
  styleUrl: "./project-card.scss",
})
export class ProjectCard {
  @Input({ required: true })
  project!: Project;

  private readonly technologyService = inject(TechnologyService);
  private readonly techNames = signal<Record<string, string>>({});

  constructor() {
    this.technologyService
      .getNameMap()
      .then((map) => this.techNames.set(map));
  }

  /** Resolves stored technology IDs/names to display names. */
  techLabel(value: string): string {
    return this.techNames()[value.toLowerCase()] ?? value;
  }
}
