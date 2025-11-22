// src/types/jurisdiction.ts

export interface JurisdictionForm {
  name: string;
  description: string;
  subJurisdictions: string[];
}

export interface JurisdictionAPIData {
  project_id: string;
  parent_id: string;
  name: string;
  description: string;
  prompt: string;
  scrape_output: Record<string, any>;
}


export interface Jurisdiction {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  changesDetected: boolean;
}