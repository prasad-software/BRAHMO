export type PracticeArea = 'criminal' | 'corporate' | 'overlap' | 'family' | 'property' | 'general';
export type NodeType = 'CONSTRAINT' | 'ANTI_PATTERN' | 'DECISION' | 'CLIENT_FACT';
export type DocumentType = 'anticipatory_bail' | 'fir_quashing' | 'nda_review' | 'nclt_petition' | 'general';
export type CourtType = 'high_court' | 'sessions_court' | 'tribunal' | 'na';

export interface LegalTemplate {
  id: string;
  template_id: string;
  jurisdiction: string; // "IN"
  practice_area: PracticeArea;
  document_type: DocumentType;
  court_type: CourtType;
  display_name: string;
  system_prompt: string;
  auto_research_query: string;
  quality_checks: string[];
}

export interface KnowledgeNode {
  id: string;
  node_type: NodeType;
  title: string;
  content: string;
  practice_area: string;
  tags: string[];
  client_id: string | null;
  matter_id: string | null;
}

export interface SectionMapping {
  old_section: string;
  new_section: string;
  old_act: string;
  new_act: string;
}

export interface CourtFormat {
  court_code: string;
  court_name: string;
  header_template: string;
  party_format: string;
  closing_format: string;
}

export interface Matter {
  id: string;
  title: string;
  client_name: string;
  practice_area: PracticeArea | 'overlap';
  document_type: DocumentType;
  court_type: CourtType;
  court_name: string;
  charge?: string;
  fir?: string;
  facts: string;
  client_id: string;
  status: string[];
  custom_query?: string;
}

export interface IKCase {
  docid: number;
  title: string;
  headline: string;
  numcites?: number;
  publishdate?: string;
  citation?: string;
  court?: string;
}

export interface QualityScore {
  overall: number; // 0-5
  relevance: number; // 0-5
  accuracy: number; // 0-5
  formatting: number; // 0-5
  explanations: string[];
}

export interface GenerationResult {
  level1: {
    content: string;
    score: QualityScore;
  };
  level2: {
    content: string;
    score: QualityScore;
  };
  level3: {
    content: string;
    score: QualityScore;
    injectedNodes: string[]; // List of KnowledgeNode IDs
    researchCases: IKCase[];
    tokenUsage: {
      used: number;
      budget: number;
    };
  };
  classification: {
    practice_area: string;
    document_type: string;
    court_type: string;
    template_id: string;
  };
  alerts: {
    original: string;
    normalized: string;
    replacements: string[];
  };
}
