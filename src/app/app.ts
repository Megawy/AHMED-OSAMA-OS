import { Component, inject, signal } from "@angular/core";
import { Router, RouterOutlet, NavigationEnd } from "@angular/router";
import { filter } from "rxjs";

import { WhatsappFloat } from "@shared/components/whatsapp-float/whatsapp-float";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, WhatsappFloat],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  private readonly router = inject(Router);

  /** Hide the contact button inside the admin area. */
  readonly showWhatsapp = signal<boolean>(true);

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showWhatsapp.set(!(e as NavigationEnd).urlAfterRedirects.startsWith('/admin'));
      });
  }
}
