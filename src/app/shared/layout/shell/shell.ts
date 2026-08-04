import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { Navbar } from "@shared/layout/navbar/navbar";
import { Footer } from "@shared/layout/footer/footer";
import { MobileSidebar } from "@shared/components/mobile-sidebar/mobile-sidebar";

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, MobileSidebar],
  templateUrl: "./shell.html",
  styleUrl: "./shell.scss",
})
export class Shell {
  readonly isMobileSidebarOpen = signal<boolean>(false);

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update((open) => !open);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }
}
