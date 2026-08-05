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
      category: 'Full Stack',
      featured: true,
      status: 'Completed',
      coverImage: '',
      gallery: [],
      github: 'https://github.com/Megawy/mega-portfolio',
      liveDemo: '',
      technologies: ['angular', 'firebase', 'tailwind'],
      order: 1,
    },
  },
];

// slug doubles as the deterministic doc id — reruns upsert instead of duplicating.
const tech = (
  id: string,
  name: string,
  category: string,
  yearsOfExperience: number,
  color: string,
  order: number,
): SeedDoc => ({ id, data: { name, icon: id, category, color, yearsOfExperience, order } });

export const TECHNOLOGIES: SeedDoc[] = [
  tech('csharp', 'C#', 'language', 3, '#239120', 1),
  tech('dotnet', '.NET', 'backend', 3, '#512BD4', 2),
  tech('aspnet-core', 'ASP.NET Core', 'backend', 3, '#512BD4', 3),
  tech('ef-core', 'Entity Framework Core', 'backend', 3, '#68217A', 4),
  tech('sql-server', 'SQL Server', 'database', 3, '#CC2927', 5),
  tech('postgresql', 'PostgreSQL', 'database', 2, '#336791', 6),
  tech('redis', 'Redis', 'backend', 2, '#DC382D', 7),
  tech('kafka', 'Kafka', 'backend', 2, '#231F20', 8),
  tech('docker', 'Docker', 'devops', 2, '#2496ED', 9),
  tech('git', 'Git', 'devops', 3, '#F05032', 10),
  tech('microservices', 'Microservices', 'architecture', 2, '#14B8A6', 11),
  tech('clean-architecture', 'Clean Architecture', 'architecture', 2, '#06B6D4', 12),
  tech('ddd', 'DDD', 'architecture', 1, '#7C3AED', 13),
  tech('cqrs', 'CQRS', 'architecture', 2, '#8B5CF6', 14),
  tech('mediatr', 'MediatR', 'library', 2, '#9333EA', 15),
  tech('signalr', 'SignalR', 'backend', 2, '#0094FF', 16),
  tech('jwt', 'JWT', 'security', 3, '#000000', 17),
  tech('firebase', 'Firebase', 'cloud', 1, '#FFCA28', 18),
  tech('firestore', 'Firestore', 'database', 1, '#FFCA28', 19),
  tech('firebase-auth', 'Firebase Authentication', 'security', 1, '#FFA000', 20),
  tech('firebase-storage', 'Firebase Storage', 'cloud', 1, '#FFB300', 21),
  tech('angular', 'Angular', 'frontend', 2, '#DD0031', 22),
  tech('typescript', 'TypeScript', 'language', 2, '#3178C6', 23),
  tech('tailwindcss', 'Tailwind CSS', 'frontend', 2, '#38BDF8', 24),
  tech('scss', 'SCSS', 'frontend', 3, '#CF649A', 25),
  tech('html5', 'HTML5', 'frontend', 4, '#E34F26', 26),
  tech('css3', 'CSS3', 'frontend', 4, '#1572B6', 27),
  // Auto-detected from repo/portfolio content (dependencies, SSR server,
  // deployment targets, project descriptions).
  tech('rxjs', 'RxJS', 'library', 2, '#B7178C', 29),
  tech('nodejs', 'Node.js', 'backend', 2, '#339933', 30),
  tech('express', 'Express', 'backend', 1, '#000000', 31),
  tech('gsap', 'GSAP', 'library', 2, '#0AE448', 32),
  tech('azure', 'Azure', 'cloud', 2, '#0078D4', 33),
  tech('gitlab-cicd', 'GitLab CI/CD', 'devops', 1, '#FC6D26', 34),
  tech('vitest', 'Vitest', 'tools', 1, '#6E9F43', 35),
  tech('firebase-hosting', 'Firebase Hosting', 'cloud', 1, '#FFCA28', 36),
  tech('rabbitmq', 'RabbitMQ', 'backend', 1, '#FF6600', 37),
  tech('serilog', 'Serilog', 'library', 1, '#1E88E5', 38),
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
