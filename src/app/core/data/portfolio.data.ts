export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface SkillItem {
  name: string;
  iconKey: string;
  category?: 'backend' | 'frontend' | 'architecture' | 'database' | 'devops';
  highlight?: boolean;
}

export interface WorkExperience {
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  countryFlag?: string;
  type: string;
  period: string;
  current?: boolean;
  achievements: string[];
}

export interface ProjectItem {
  title: string;
  subtitle: string;
  role: string;
  url?: string;
  technologies: string[];
  achievements: string[];
}

export interface UsesItem {
  label: string;
  value: string;
  url?: string;
}

export interface UsesCategory {
  title: string;
  items: UsesItem[];
}

export interface PortfolioData {
  profile: {
    initials: string;
    name: string;
    headline: string;
    roleTitle: string;
    location: string;
    phone: string;
    email: string;
    cvUrl: string;
    bioParagraphs: string[];
  };
  socialLinks: SocialLink[];
  skills: SkillItem[];
  workHistory: WorkExperience[];
  projects: ProjectItem[];
  hardware: UsesItem[];
  devTools: UsesItem[];
  productivity: UsesItem[];
}

export const PORTFOLIO_DATA: PortfolioData = {
  profile: {
    initials: 'AO',
    name: 'Ahmed Osama Abdalla',
    headline: "Hey, I'm Ahmed Osama!",
    roleTitle: 'Full Stack Software Engineer | .NET • Angular • Python / Django',
    location: 'Cairo, Egypt',
    phone: '+20 100 227 5366',
    email: 'ahmed.osama001@outlook.com',
    cvUrl: '/assets/cv/Ahmed_Osama_Abdalla_-_Full_Stack_Engineer_CV.pdf',
    bioParagraphs: [
      'Results-driven Full Stack Software Engineer with 3+ years of experience designing, developing, and deploying high-performance web applications and backend microservices.',
      'Proficient in C#, ASP.NET Core, Python/Django, and Angular. Proven track record in architecting event-driven systems using Apache Kafka, Redis, and Clean Architecture.',
      'Adept at API security, database optimization, CI/CD pipelines, and leveraging AI-assisted engineering tools to accelerate development cycles and deliver production-ready code.',
    ],
  },

  socialLinks: [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/ahmedosamaabdalla', icon: 'linkedin' },
    { name: 'GitHub', url: 'https://github.com/Megawy', icon: 'github' },
    { name: 'WhatsApp', url: 'https://wa.me/201002275366', icon: 'whatsapp' },
    { name: 'Email', url: 'mailto:ahmed.osama001@outlook.com', icon: 'envelope' },
  ],

  skills: [
    { name: 'C# / .NET', iconKey: 'dotnet', highlight: true },
    { name: 'ASP.NET Core', iconKey: 'dotnet', highlight: true },
    { name: 'Angular', iconKey: 'angular', highlight: true },
    { name: 'Python', iconKey: 'python', highlight: true },
    { name: 'Django', iconKey: 'django', highlight: true },
    { name: 'TypeScript', iconKey: 'typescript', highlight: true },
    { name: 'JavaScript (ES6+)', iconKey: 'javascript' },
    { name: 'Apache Kafka', iconKey: 'kafka', highlight: true },
    { name: 'Redis Caching', iconKey: 'redis', highlight: true },
    { name: 'Docker', iconKey: 'docker', highlight: true },
    { name: 'PostgreSQL', iconKey: 'postgres', highlight: true },
    { name: 'SQLite', iconKey: 'sqlite', highlight: true },
    { name: 'SQL Server', iconKey: 'sqlserver', highlight: true },
    { name: 'Clean Architecture', iconKey: 'microservices', highlight: true },
    { name: 'Microservices', iconKey: 'microservices' },
    { name: 'GitLab CI/CD', iconKey: 'gitlab' },
    { name: 'Git', iconKey: 'git' },
    { name: 'SignalR', iconKey: 'signalr' },
    { name: 'Nginx', iconKey: 'nginx' },
    { name: 'Tailwind CSS', iconKey: 'tailwind' },
    { name: 'PrimeNG', iconKey: 'primeng' },
    { name: 'RabbitMQ', iconKey: 'rabbitmq' },
    { name: 'gRPC', iconKey: 'grpc' },
    { name: 'GitHub', iconKey: 'github' },
  ],

  workHistory: [
    {
      role: 'Full Stack .NET Developer',
      company: 'GoGetOffer',
      companyUrl: 'https://gogetoffer.com',
      location: 'Cairo, Egypt',
      countryFlag: '🇪🇬',
      type: 'Full-Time',
      period: 'Nov 2023 — May 2026',
      current: true,
      achievements: [
        'Engineered scalable microservices and backend systems using C#, ASP.NET Core, and Clean Architecture for an enterprise platform comprising 12+ core microservices.',
        'Configured and deployed an enterprise API Gateway utilizing YARP, optimizing request routing, rate limiting, and backend authorization flow.',
        'Reduced system latency and enabled real-time features using Redis caching, SignalR, and event-driven asynchronous messaging via Apache Kafka.',
        'Applied CQRS with MediatR, FluentValidation, AutoMapper, and Repository Pattern to build modular, testable, and highly maintainable codebases.',
        'Built reactive frontend features with Angular and TypeScript, integrating seamless RESTful APIs and enhancing application performance.',
        'Containerized microservices using Docker and integrated automated build/deployment workflows via GitLab CI/CD pipelines.',
        'Coordinated team development tasks, conducted technical code reviews, and contributed to key system architecture decisions.',
      ],
    },
  ],

  projects: [
    {
      title: 'Platinumail',
      subtitle: 'Production Email Platform',
      role: 'Full Stack & DevOps',
      url: 'https://platinumail.com',
      technologies: ['Angular', 'Python', 'Django', 'PostgreSQL', 'Docker Compose', 'Nginx', 'Stalwart Mail'],
      achievements: [
        'Architected and deployed a full-stack production email platform using Angular, Python/Django, PostgreSQL, and Docker Compose on an Ubuntu VPS.',
        'Integrated Stalwart mail server with Nginx reverse proxy, configuring complete SPF, DKIM, and DMARC settings for optimal email deliverability.',
        'Implemented mailbox management, custom domain configuration, SMTP/IMAP communications, and automated recovery flows.',
      ],
    },
    {
      title: 'Ticket Booking Platform',
      subtitle: 'Modular Monolith Architecture',
      role: 'Full Stack Developer',
      technologies: ['.NET Core', 'Angular', 'Clean Architecture', 'CQRS', 'Redis', 'SQL Server'],
      achievements: [
        'Engineered a scalable ticket booking platform with Domain-Driven Design (DDD) and Modular Monolithic architecture.',
        'Implemented high-concurrency real-time seat reservation with Redis distributed locking and CQRS via MediatR.',
        'Built modern responsive front-end dashboard with Angular and PrimeNG.',
      ],
    },
  ],

  hardware: [
    { label: 'Workstation', value: 'AMD Ryzen 5 5600X / RTX 3050 / 64GB RAM' },
    { label: 'Display 1 (Primary / 144Hz)', value: 'BenQ 23.5" 144Hz TN' },
    { label: 'Display 2 (IPS)', value: 'Dell 27" IPS 60Hz' },
    { label: 'Display 3 (IPS)', value: 'Fujitsu 24" IPS 60Hz' },
    { label: 'Headset', value: 'Razer BlackShark V3 Pro' },
    { label: 'Mouse', value: 'Logitech G PRO X Superlight' },
    { label: 'Keyboard', value: 'Redragon K552 Mechanical Keyboard' },
  ],

  devTools: [
    { label: 'IDE & Editors', value: 'Visual Studio 2022, Visual Studio Code' },
    { label: 'AI Assistants', value: 'Cursor, Claude 3.7 Sonnet, GitHub Copilot' },
    { label: 'Terminal', value: 'Windows Terminal + PowerShell 7 + Zsh on WSL2' },
    { label: 'Containers', value: 'Docker Desktop + Docker Compose' },
    { label: 'API Testing', value: 'Postman, Bruno, Swagger / OpenAPI' },
  ],

  productivity: [
    { label: 'Databases', value: 'PostgreSQL, SQLite, SQL Server (SSMS)' },
    { label: 'System Design', value: 'Draw.io, Excalidraw, Figma' },
    { label: 'CI/CD & VCS', value: 'Git, GitLab CI/CD, GitHub' },
    { label: 'Docs & Tasks', value: 'Notion, Obsidian, Linear' },
  ],
};
