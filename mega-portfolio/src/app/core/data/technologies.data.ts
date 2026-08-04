import { TechnologyGroup } from "../models/technology.model";

export const RADAR: TechnologyGroup[] = [
  {
    title: "ADOPT",
    items: [".NET 9", "Docker", "Redis", "SQL Server", "Angular"],
  },

  {
    title: "TRIAL",
    items: ["Kafka", "RabbitMQ", "SignalR", "YARP"],
  },

  {
    title: "ASSESS",
    items: ["Kubernetes", "gRPC", "OpenTelemetry"],
  },

  {
    title: "LEARN",
    items: ["Azure", "Event Sourcing", "Service Mesh"],
  },
];
