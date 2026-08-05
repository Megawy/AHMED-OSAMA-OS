import { Routes } from '@angular/router';

import { adminGuard, loginGuard } from '@core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/pages/home/home').then((m) => m.Home),
      },

      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/pages/projects/projects').then((m) => m.Projects),
      },

      {
        path: 'architecture',
        loadComponent: () =>
          import('./features/architecture/pages/architecture/architecture').then(
            (m) => m.Architecture,
          ),
      },

      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/pages/contact/contact').then((m) => m.Contact),
      },

      {
        path: 'blog',
        loadComponent: () => import('./features/blog/pages/blog/blog').then((m) => m.Blog),
      },
    ],
  },

  {
    path: 'admin/login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/admin/pages/login/login').then((m) => m.Login),
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/layout/admin-shell/admin-shell').then((m) => m.AdminShell),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/admin/pages/projects/projects').then((m) => m.AdminProjects),
      },
      {
        path: 'technologies',
        loadComponent: () =>
          import('./features/admin/pages/technologies/technologies').then(
            (m) => m.AdminTechnologies,
          ),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/admin/pages/skills/skills').then((m) => m.AdminSkills),
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./features/admin/pages/experience/experience').then((m) => m.AdminExperience),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/admin/pages/messages/messages').then((m) => m.AdminMessages),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/pages/settings/settings').then((m) => m.AdminSettings),
      },
      {
        path: 'media',
        loadComponent: () => import('./features/admin/pages/media/media').then((m) => m.AdminMedia),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
