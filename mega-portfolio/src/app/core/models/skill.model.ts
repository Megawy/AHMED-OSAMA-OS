export interface Skill {
  id?: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsOfExperience: number;
  icon?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SkillCategory =
  'Backend' | 'Frontend' | 'Database' | 'DevOps' | 'Cloud' | 'Architecture' | 'Tools';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Backend',
  'Frontend',
  'Database',
  'DevOps',
  'Cloud',
  'Architecture',
  'Tools',
];

export const SKILL_LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
