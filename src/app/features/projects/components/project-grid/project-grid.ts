import { Component, inject } from "@angular/core";
import { AsyncPipe } from "@angular/common";

import { ProjectCard } from "../project-card/project-card";

import { ProjectService } from "@core/services/project.service";

@Component({
  selector: "app-project-grid",
  standalone: true,
  imports: [AsyncPipe, ProjectCard],
  templateUrl: "./project-grid.html",
  styleUrl: "./project-grid.scss",
})
export class ProjectGrid {
  private readonly projectService = inject(ProjectService);

  readonly projects$ = this.projectService.getProjects();
}
