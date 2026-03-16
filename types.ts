import React from 'react';

export enum TargetingSource {
  ICP = 'ICP',
  CSV = 'CSV',
  CRM = 'CRM',
  LIST = 'LIST',
  SOCIAL = 'SOCIAL',
  WEBSITE_VISITORS = 'WEBSITE_VISITORS',
  INBOUND_FORM = 'INBOUND_FORM'
}

export enum StepStatus {
  COMPLETED = 'completed',
  CURRENT = 'current',
  UPCOMING = 'upcoming'
}

export enum MatchingMode {
  FOCUS = 'FOCUS',
  SCALE = 'SCALE',
  MAX_SCALE = 'MAX_SCALE'
}

export interface Step {
  id: number;
  label: string;
  status: StepStatus;
  icon?: React.ReactNode;
}

// Data models for the wizard state
export const AVAILABLE_LANGUAGES = [
  'Arabic', 'Chinese (Mandarin)', 'Czech', 'Danish', 'Dutch', 'English', 'Finnish', 'French', 'German', 'Greek', 
  'Hebrew', 'Hindi', 'Hungarian', 'Indonesian', 'Italian', 'Japanese', 'Korean', 'Malay', 'Norwegian', 'Polish', 
  'Portuguese', 'Romanian', 'Russian', 'Spanish', 'Swedish', 'Thai', 'Turkish', 'Ukrainian', 'Vietnamese'
];

export interface CampaignData {
  targeting: {
    source: TargetingSource | null;
    icpDescription: string;
    websiteUrl: string;
    countries: string[];
    languages: string[];
    emailContentLanguage?: string;
    fallbackLanguage?: string;
    matchingMode: MatchingMode;
    prospectLimits: {
      daily: string;
      total: string;
    };
    blacklist: {
      list: boolean;
      time: boolean;
      crm: boolean;
      csv: boolean;
      sheet: boolean;
    }
  };
  pitch: {
    language: string; 
    valueProp: string;
    benchmarkBrands: string[];
    painPoints: string[];
    solutions: string[];
    proofPoints: string[];
    ctas: string[];
    leadMagnets: string[];
  };
  settings: {
    mailbox: string;
    schedule: string[]; // ['M', 'T', ...]
    startTime: string;
    endTime: string;
    autoApproval: boolean;
  }
}