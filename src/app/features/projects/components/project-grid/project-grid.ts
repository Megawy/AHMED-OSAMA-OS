import { Component, inject } from "@angular/core";

import { ProjectCard } from "../project-card/project-card";
import { SkeletonCard } from "@shared/components/skeleton-card/skeleton-card";
import { EmptyState } from "@shared/components/empty-state/empty-state";
import { ErrorState } from "@shared/components/error-state/error-state";

import { ProjectStateService } from "../../services/project-state.service";

@Component({
  selector: "app-project-grid",
  standalone: true,
  imports: [ProjectCard, SkeletonCard, EmptyState, ErrorState],
  templateUrl: "./project-grid.html",
  styleUrl: "./project-grid.scss",
})
export class ProjectGrid {
  readonly state = inject(ProjectStateService);
}
