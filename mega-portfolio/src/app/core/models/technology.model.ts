export interface TechnologyGroup {
  title: string;
  items: string[];
}

export interface Technology {
  id?: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  yearsOfExperience: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export const TECHNOLOGY_CATEGORIES: string[] = [
  'Backend',
  'Frontend',
  'Database',
  'DevOps',
  'Cloud',
  'Architecture',
  'Tools',
  'Languages',
];
