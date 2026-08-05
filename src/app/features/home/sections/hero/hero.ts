import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-hero",
  standalone: true,
  imports: [TranslatePipe, RouterLink, RouterLinkActive],
  templateUrl: "./hero.html",
  styleUrl: "./hero.scss",
})
export class Hero {}
