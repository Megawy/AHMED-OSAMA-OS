import { Component, afterNextRender, inject } from "@angular/core";

import { ProjectHero } from "../../components/project-hero/project-hero";
import { ProjectSearch } from "../../components/project-search/project-search";
import { ProjectFilter } from "../../components/project-filter/project-filter";
import { ProjectGrid } from "../../components/project-grid/project-grid";
import { ProjectStateService } from "../../services/project-state.service";

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [ProjectHero, ProjectSearch, ProjectFilter, ProjectGrid],
  templateUrl: "./projects.html",
  styleUrl: "./projects.scss",
})
export class Projects {
  private readonly state = inject(ProjectStateService);

  constructor() {
    // Browser-only: keeps prerendering free of Firestore calls.
    afterNextRender(() => this.state.loadProjects());
  }
}
