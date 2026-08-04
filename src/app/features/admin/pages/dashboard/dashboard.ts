import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AdminProjectService } from '@core/services/admin-project.service';
import { AdminMessageService } from '@core/services/admin-message.service';
import { AdminTechnologyService } from '@core/services/admin-technology.service';
import { AdminSkillService } from '@core/services/admin-skill.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly projectService = inject(AdminProjectService);
  private readonly messageService = inject(AdminMessageService);
  private readonly technologyService = inject(AdminTechnologyService);
  private readonly skillService = inject(AdminSkillService);

  readonly projectsCount = signal<number>(0);
  readonly messagesCount = signal<number>(0);
  readonly unreadMessages = signal<number>(0);
  readonly technologiesCount = signal<number>(0);
  readonly skillsCount = signal<number>(0);
  readonly loading = signal<boolean>(true);
  readonly recentProjects = signal<unknown[]>([]);
  readonly recentMessages = signal<unknown[]>([]);

  readonly quickActions = [
    { label: 'New Project', icon: '🚀', route: '/admin/projects' },
    { label: 'Add Technology', icon: '⚡', route: '/admin/technologies' },
    { label: 'Add Skill', icon: '🎯', route: '/admin/skills' },
    { label: 'Add Experience', icon: '💼', route: '/admin/experience' },
    { label: 'View Messages', icon: '✉️', route: '/admin/messages' },
    { label: 'Settings', icon: '⚙️', route: '/admin/settings' },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      await Promise.all([
        this.projectService.load(),
        this.messageService.load(),
        this.technologyService.load(),
        this.skillService.load(),
      ]);

      this.projectsCount.set(this.projectService.projects().length);
      this.messagesCount.set(this.messageService.messages().length);
      this.unreadMessages.set(this.messageService.unreadCount());
      this.technologiesCount.set(this.technologyService.technologies().length);
      this.skillsCount.set(this.skillService.skills().length);
      this.recentProjects.set(this.projectService.projects().slice(0, 5));
      this.recentMessages.set(this.messageService.messages().slice(0, 5));
    } finally {
      this.loading.set(false);
    }
  }
}
