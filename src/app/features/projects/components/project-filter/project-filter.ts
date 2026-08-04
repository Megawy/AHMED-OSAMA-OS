import { Component } from "@angular/core";

@Component({
  selector: "app-project-filter",
  standalone: true,
  imports: [],
  templateUrl: "./project-filter.html",
  styleUrl: "./project-filter.scss",
})
export class ProjectFilter {
  selected = "All";

  filters = [
    "All",

    "Backend",

    "Frontend",

    "Angular",

    "Firebase",

    "Docker",

    "Kafka",

    "Redis",

    "Microservices",

    "Cloud",
  ];
}
