export interface Project {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  gallery: string[];
  technologies: string[];
  github?: string;
  liveDemo?: string;
  category: ProjectCategory;
  featured: boolean;
  status: ProjectStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectCategory =
  | 'All'
  | 'Backend'
  | 'Frontend'
  | 'Full Stack'
  | 'DevOps'
  | 'Mobile';

export type ProjectStatus = 'Completed' | 'In Progress' | 'Archived';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'All',
  'Backend',
  'Frontend',
  'Full Stack',
  'DevOps',
  'Mobile',
];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  Completed: 'Completed',
  'In Progress': 'In Progress',
  Archived: 'Archived',
};

// ── Legacy value normalization ──────────────────────────────────────────────
// Older seed data stored lowercase/free-form values ('web', 'published', ...).
// Map them to the canonical enums so selects and filters match.

const CATEGORY_ALIASES: Record<string, ProjectCategory> = {
  web: 'Full Stack',
  website: 'Full Stack',
  'full stack': 'Full Stack',
  fullstack: 'Full Stack',
  backend: 'Backend',
  frontend: 'Frontend',
  devops: 'DevOps',
  mobile: 'Mobile',
};

const STATUS_ALIASES: Record<string, ProjectStatus> = {
  published: 'Completed',
  completed: 'Completed',
  done: 'Completed',
  draft: 'In Progress',
  'in progress': 'In Progress',
  'in-progress': 'In Progress',
  archived: 'Archived',
};

export function normalizeProjectCategory(value: string): ProjectCategory {
  const canonical = PROJECT_CATEGORIES.find((c) => c !== 'All' && c.toLowerCase() === value.toLowerCase());
  return canonical ?? CATEGORY_ALIASES[value.toLowerCase()] ?? 'Frontend';
}

export function normalizeProjectStatus(value: string): ProjectStatus {
  const known = (Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).find(
    (s) => s.toLowerCase() === value.toLowerCase(),
  );
  return known ?? STATUS_ALIASES[value.toLowerCase()] ?? 'In Progress';
}

export function normalizeProject<T extends Partial<Project>>(project: T): T {
  return {
    ...project,
    ...(project.category ? { category: normalizeProjectCategory(String(project.category)) } : {}),
    ...(project.status ? { status: normalizeProjectStatus(String(project.status)) } : {}),
  };
}
