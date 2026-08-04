export interface SiteSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  socialLinks: SocialLink[];
  updatedAt: Date;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}
