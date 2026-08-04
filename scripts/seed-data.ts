import { SeedDoc } from './lib';

// ---------------------------------------------------------------------------
// Base seed data (idempotent, deterministic IDs)
// ---------------------------------------------------------------------------

export const SETTINGS: SeedDoc[] = [
  {
    id: 'site',
    data: {
      siteTitle: 'Ahmed Osama | Portfolio',
      siteDescription: 'Angular & Firebase Full-Stack Developer',
      github: 'https://github.com/Megawy',
      linkedin: 'https://linkedin.com/in/ahmed-osama-72a255241',
      email: 'contact@ahmedosama.dev',
      phone: '',
      resumeUrl: '',
      logo: '',
      favicon: '/favicon.ico',
      heroTitle: 'Ahmed Osama',
      heroSubtitle: 'Building fast, accessible web applications with Angular and Firebase.',
    },
  },
];

export const ANALYTICS: SeedDoc[] = [
  {
    id: 'counters',
    data: { views: 0, downloads: 0, messages: 0 },
  },
];

// ---------------------------------------------------------------------------
// Demo content
// ---------------------------------------------------------------------------

export const PROJECTS: SeedDoc[] = [
  {
    id: 'mega-portfolio',
    data: {
      slug: 'mega-portfolio',
      title: 'Mega Portfolio',
      shortDescription: 'SSR Angular portfolio with Firebase admin dashboard.',
      description:
        'Portfolio website built with Angular 21, SSR, Tailwind CSS v4 and Firebase (Firestore, Auth, Storage) with a full admin dashboard.',
      category: 'web',
      featured: true,
      status: 'published',
      coverImage: '',
      gallery: [],
      github: 'https://github.com/Megawy/mega-portfolio',
      liveDemo: '',
      technologies: ['angular', 'firebase', 'tailwind'],
      order: 1,
    },
  },
];

export const TECHNOLOGIES: SeedDoc[] = [
  {
    id: 'angular',
    data: {
      name: 'Angular',
      icon: 'angular',
      category: 'frontend',
      color: '#DD0031',
      level: 90,
      order: 1,
    },
  },
  {
    id: 'typescript',
    data: {
      name: 'TypeScript',
      icon: 'typescript',
      category: 'language',
      color: '#3178C6',
      level: 88,
      order: 2,
    },
  },
  {
    id: 'firebase',
    data: {
      name: 'Firebase',
      icon: 'firebase',
      category: 'backend',
      color: '#FFCA28',
      level: 85,
      order: 3,
    },
  },
  {
    id: 'tailwind',
    data: {
      name: 'Tailwind CSS',
      icon: 'tailwind',
      category: 'frontend',
      color: '#38BDF8',
      level: 82,
      order: 4,
    },
  },
];

export const SKILLS: SeedDoc[] = [
  {
    id: 'angular-dev',
    data: {
      name: 'Angular Development',
      percentage: 90,
      category: 'frontend',
      icon: 'code',
      order: 1,
    },
  },
  {
    id: 'rxjs',
    data: { name: 'RxJS & Signals', percentage: 85, category: 'frontend', icon: 'zap', order: 2 },
  },
  {
    id: 'firebase-dev',
    data: {
      name: 'Firebase Backend',
      percentage: 85,
      category: 'backend',
      icon: 'database',
      order: 3,
    },
  },
  {
    id: 'ui-ux',
    data: {
      name: 'UI / UX Implementation',
      percentage: 80,
      category: 'design',
      icon: 'palette',
      order: 4,
    },
  },
];

export const EXPERIENCE: SeedDoc[] = [
  {
    id: 'freelance-frontend',
    data: {
      company: 'Freelance',
      position: 'Frontend Developer',
      description: 'Building responsive web applications with Angular and Firebase.',
      location: 'Remote',
      startDate: new Date('2024-01-01'),
      endDate: null,
      current: true,
      technologies: ['angular', 'firebase', 'tailwind'],
      order: 1,
    },
  },
];

export const MESSAGES: SeedDoc[] = [
  {
    id: 'welcome-message',
    data: {
      name: 'Seed Bot',
      email: 'seed@localhost.dev',
      subject: 'Database seeded',
      message: 'This placeholder document activates the messages collection. Safe to delete.',
      read: false,
    },
  },
];

export const MEDIA: SeedDoc[] = [
  {
    id: 'placeholder-logo',
    data: {
      fileName: 'logo.svg',
      url: '/favicon.ico',
      type: 'image',
      size: 0,
      width: 0,
      height: 0,
      uploadedAt: new Date(0),
    },
  },
];
