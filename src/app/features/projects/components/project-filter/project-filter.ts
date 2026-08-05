import { Component, inject } from "@angular/core";

import { PROJECT_CATEGORIES, type ProjectCategory } from "@core/models/project.model";

import { ProjectStateService } from "../../services/project-state.service";

@Component({
  selector: "app-project-filter",
  standalone: true,
  imports: [],
  templateUrl: "./project-filter.html",
  styleUrl: "./project-filter.scss",
})
export class ProjectFilter {
  readonly state = inject(ProjectStateService);

  readonly filters: ProjectCategory[] = PROJECT_CATEGORIES;

  select(category: ProjectCategory): void {
    this.state.setCategory(category);
  }
}
