import { Component } from '@angular/core';

import { ArchitectureHero } from '../../components/architecture-hero/architecture-hero';
import { MicroservicesDiagram } from '../../components/microservices-diagram/microservices-diagram';
import { KafkaSection } from '../../components/kafka-section/kafka-section';
import { RedisSection } from '../../components/redis-section/redis-section';
import { KubernetesSection } from '../../components/kubernetes-section/kubernetes-section';
import { DockerSection } from '../../components/docker-section/docker-section';
import { BestPractices } from '../../components/best-practices/best-practices';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [
    ArchitectureHero,
    MicroservicesDiagram,
    KafkaSection,
    RedisSection,
    KubernetesSection,
    DockerSection,
    BestPractices,
  ],
  templateUrl: './architecture.html',
  styleUrl: './architecture.css',
})
export class Architecture {}
