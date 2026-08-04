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
