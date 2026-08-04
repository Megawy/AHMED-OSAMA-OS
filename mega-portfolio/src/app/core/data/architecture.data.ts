export interface ArchitectureService {
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface TechStackItem {
  category: string;
  items: string[];
}

export interface DeploymentStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export const SERVICES: ArchitectureService[] = [
  {
    name: 'API Gateway',
    icon: '🌐',
    description: 'YARP reverse proxy routing requests to downstream microservices.',
    color: '#00e5ff',
  },
  {
    name: 'Auth Service',
    icon: '🔐',
    description: 'JWT-based authentication with refresh tokens and role-based access.',
    color: '#7c3aed',
  },
  {
    name: 'Kafka Event Bus',
    icon: '📡',
    description: 'Asynchronous event streaming for inter-service communication.',
    color: '#f59e0b',
  },
  {
    name: 'Redis Cache',
    icon: '⚡',
    description: 'Distributed caching layer for high-throughput read operations.',
    color: '#ef4444',
  },
  {
    name: 'Order Service',
    icon: '📦',
    description: 'Domain-driven order processing with saga orchestration.',
    color: '#10b981',
  },
  {
    name: 'Payment Service',
    icon: '💳',
    description: 'PCI-compliant payment processing with idempotent transactions.',
    color: '#3b82f6',
  },
  {
    name: 'Notification Service',
    icon: '🔔',
    description: 'Multi-channel notifications: email, SMS, and push via SignalR.',
    color: '#ec4899',
  },
  {
    name: 'Product Service',
    icon: '🏷️',
    description: 'Product catalog management with CQRS read/write separation.',
    color: '#8b5cf6',
  },
];

export const TECH_STACK: TechStackItem[] = [
  {
    category: 'Backend',
    items: ['.NET 9', 'C#', 'MediatR', 'FluentValidation', 'AutoMapper'],
  },
  {
    category: 'Messaging',
    items: ['Apache Kafka', 'RabbitMQ', 'SignalR', 'gRPC'],
  },
  {
    category: 'Database',
    items: ['SQL Server', 'Redis', 'Elasticsearch', 'MongoDB'],
  },
  {
    category: 'DevOps',
    items: ['Docker', 'Kubernetes', 'GitHub Actions', 'Prometheus', 'Grafana'],
  },
  {
    category: 'Cloud',
    items: ['Azure', 'Azure Container Apps', 'Azure SQL', 'Azure Redis'],
  },
  {
    category: 'Frontend',
    items: ['Angular 21', 'TypeScript', 'Tailwind CSS', 'GSAP'],
  },
];

export const DEPLOYMENT_PIPELINE: DeploymentStep[] = [
  {
    step: 1,
    title: 'Code Push',
    description: 'Developer pushes code to GitHub main branch.',
    icon: '💻',
  },
  {
    step: 2,
    title: 'CI Pipeline',
    description: 'GitHub Actions runs tests, linting, and builds artifacts.',
    icon: '🔧',
  },
  {
    step: 3,
    title: 'Docker Build',
    description: 'Multi-stage Docker build creates optimized container images.',
    icon: '🐳',
  },
  {
    step: 4,
    title: 'Registry Push',
    description: 'Images pushed to Azure Container Registry.',
    icon: '📦',
  },
  {
    step: 5,
    title: 'K8s Deploy',
    description: 'Rolling deployment to Kubernetes cluster with health checks.',
    icon: '☸️',
  },
  {
    step: 6,
    title: 'Monitoring',
    description: 'Prometheus metrics and Grafana dashboards track performance.',
    icon: '📊',
  },
];

export const BEST_PRACTICES = [
  {
    title: 'Domain-Driven Design',
    description: 'Bounded contexts, aggregates, and domain events define service boundaries.',
    icon: '🎯',
  },
  {
    title: 'CQRS Pattern',
    description: 'Separate read and write models for optimized query and command performance.',
    icon: '📐',
  },
  {
    title: 'Event Sourcing',
    description: 'Immutable event log as the source of truth for business transactions.',
    icon: '📜',
  },
  {
    title: 'Circuit Breaker',
    description: 'Polly-based circuit breakers prevent cascading failures across services.',
    icon: '🔌',
  },
  {
    title: 'Saga Orchestration',
    description: 'Coordinated distributed transactions with compensating actions.',
    icon: '🔄',
  },
  {
    title: 'Observability',
    description: 'Structured logging, distributed tracing, and metrics with OpenTelemetry.',
    icon: '🔍',
  },
];
