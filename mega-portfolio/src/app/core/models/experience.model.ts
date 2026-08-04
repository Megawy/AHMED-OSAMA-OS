export interface Experience {
  id?: string;
  company: string;
  role: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceTimeline {
  year: string;
  items: Experience[];
}
