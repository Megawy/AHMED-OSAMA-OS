import { Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "app-hero",
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: "./hero.html",
  styleUrl: "./hero.scss",
})
export class Hero {}
