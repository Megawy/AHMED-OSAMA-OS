export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface Environment {
  production: boolean;
  debug: boolean;
  analytics: boolean;
  appName: string;
  version: string;
  contactEmail: string;
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  baseApiUrl: string;
  firebase: FirebaseConfig;
}
