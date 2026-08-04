import { Component } from "@angular/core";

import { ProjectHero } from "../../components/project-hero/project-hero";
import { ProjectSearch } from "../../components/project-search/project-search";
import { ProjectFilter } from "../../components/project-filter/project-filter";
import { ProjectGrid } from "../../components/project-grid/project-grid";

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [ProjectHero, ProjectSearch, ProjectFilter, ProjectGrid],
  templateUrl: "./projects.html",
  styleUrl: "./projects.scss",
})
export class Projects {}
