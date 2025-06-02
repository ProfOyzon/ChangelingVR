import type { Identifiable } from './common';

export interface Member extends Identifiable {
  uuid: string;
  email: string;
  password: string;
}

export interface Profile {
  display_name?: string;
  bio?: string;
  terms?: number[];
  teams?: string[];
  roles?: string[];
  links: {
    email: string;
    website: string;
    github: string;
    linkedin: string;
  };
  username: string;
  avatar_url?: string;
}
