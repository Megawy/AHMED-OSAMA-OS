import { Component, Input } from "@angular/core";
import { Project } from "@core/models/project.model";

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
}
