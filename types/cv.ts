export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  militaryStatus: string;
  location: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface TrainingExperience {
  role: string;
  institution: string;
  organization: string;
  mode: string;
  location: string;
  period: string;
  isCurrent: boolean;
  highlights: string[];
  upcomingModules?: string[];
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  type?: string;
  period: string;
  stack: string[];
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
}

export interface Certification {
  title: string;
  hours?: number;
  issuer: string;
  issuedDate: string;
  location?: string;
  credentialUrl?: string;
  highlights: string[];
}

export interface VolunteerExperience {
  role: string;
  organization: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface CVData {
  contact: ContactInfo;
  summary: string;
  skills: SkillCategory[];
  training: TrainingExperience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  volunteer: VolunteerExperience[];
}
