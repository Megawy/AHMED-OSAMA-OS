import { Experience } from '../models/experience.model';

export const EXPERIENCES: Experience[] = [
  {
    company: 'Enterprise Solutions',
    role: 'Senior Software Architect',
    location: 'Cairo, Egypt',
    startDate: new Date('2022-01-01'),
    endDate: null,
    current: true,
    description:
      'Leading architecture design and implementation of distributed microservices systems.',
    achievements: [
      'Architected event-driven microservices platform handling 10K+ requests/sec',
      'Reduced deployment time by 80% through Docker containerization and CI/CD',
      'Mentored team of 12 engineers on DDD and clean architecture principles',
    ],
    technologies: ['.NET 9', 'Kafka', 'Redis', 'Docker', 'Kubernetes', 'SQL Server'],
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    company: 'Tech Corp',
    role: 'Lead Backend Developer',
    location: 'Cairo, Egypt',
    startDate: new Date('2019-06-01'),
    endDate: new Date('2021-12-31'),
    current: false,
    description: 'Built scalable backend systems for e-commerce and supply chain management.',
    achievements: [
      'Delivered 5 enterprise microservices from design to production',
      'Implemented CQRS and Event Sourcing patterns for audit compliance',
      'Optimized database queries reducing response time by 60%',
    ],
    technologies: ['.NET Core', 'RabbitMQ', 'Redis', 'SQL Server', 'Docker'],
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    company: 'Digital Agency',
    role: 'Full Stack Developer',
    location: 'Cairo, Egypt',
    startDate: new Date('2017-03-01'),
    endDate: new Date('2019-05-31'),
    current: false,
    description: 'Developed web applications using Angular and .NET.',
    achievements: [
      'Built 10+ client-facing web applications',
      'Introduced automated testing increasing code coverage to 85%',
      'Implemented responsive designs supporting 5+ device breakpoints',
    ],
    technologies: ['Angular', '.NET', 'SQL Server', 'TypeScript', 'SCSS'],
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
