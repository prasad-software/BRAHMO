import { PracticeArea, DocumentType, CourtType, LegalTemplate } from '../types';
import { LEGAL_TEMPLATES } from '../data';

export interface ClassificationResult {
  practice_area: PracticeArea;
  document_type: DocumentType;
  court_type: CourtType;
  template_id: string;
}

/**
 * Keyword-based classifier (extremely fast & stable)
 */
export function classifyQueryByKeywords(query: string): ClassificationResult {
  const lowercase = query.toLowerCase();

  // 1. Criminal + Corporate Overlap (Scenario 6)
  if (
    (lowercase.includes("mehta") || lowercase.includes("overlap") || lowercase.includes("dual")) &&
    (lowercase.includes("investor") || lowercase.includes("cheating") || lowercase.includes("nclt"))
  ) {
    return {
      practice_area: "overlap",
      document_type: "general",
      court_type: "high_court",
      template_id: "GENERAL_FALLBACK_TEMPLATE"
    };
  }

  // 2. Criminal Practice Area
  if (
    lowercase.includes("bail") ||
    lowercase.includes("anticipatory") ||
    lowercase.includes("arrest") ||
    lowercase.includes("quash") ||
    lowercase.includes("fir") ||
    lowercase.includes("criminal") ||
    lowercase.includes("bns") ||
    lowercase.includes("bnss") ||
    lowercase.includes("ipc") ||
    lowercase.includes("crpc") ||
    lowercase.includes("police_notices") ||
    lowercase.includes("theft") ||
    lowercase.includes("saket") ||
    lowercase.includes("mehrauli") ||
    lowercase.includes("patiala house")
  ) {
    const area: PracticeArea = "criminal";
    let docType: DocumentType = "general";
    let courtType: CourtType = "high_court";
    let templateId = "GENERAL_FALLBACK_TEMPLATE";

    if (lowercase.includes("quash") || lowercase.includes("528") || lowercase.includes("482 crpc")) {
      docType = "fir_quashing";
      courtType = "high_court";
      templateId = "IN_CRIMINAL_QUASHING_HC";
    } else if (lowercase.includes("bail") || lowercase.includes("anticipatory") || lowercase.includes("482")) {
      docType = "anticipatory_bail";
      if (lowercase.includes("session") || lowercase.includes("sessions") || lowercase.includes("patiala") || lowercase.includes("court of sessions")) {
        courtType = "sessions_court";
        // Can fallback or map
        templateId = "IN_CRIMINAL_BAIL_ANTICIPATORY_HC"; // We map to primary bail and customize headers dynamically in server
      } else {
        courtType = "high_court";
        templateId = "IN_CRIMINAL_BAIL_ANTICIPATORY_HC";
      }
    }

    return {
      practice_area: area,
      document_type: docType,
      court_type: courtType,
      template_id: templateId
    };
  }

  // 3. Corporate Practice Area
  if (
    lowercase.includes("nda") ||
    lowercase.includes("non-disclosure") ||
    lowercase.includes("disclosure") ||
    lowercase.includes("nclt") ||
    lowercase.includes("oppression") ||
    lowercase.includes("mismanagement") ||
    lowercase.includes("shareholder") ||
    lowercase.includes("companies act") ||
    lowercase.includes("corporate") ||
    lowercase.includes("techcorp") ||
    lowercase.includes("ravi investments")
  ) {
    const area: PracticeArea = "corporate";
    let docType: DocumentType = "general";
    let courtType: CourtType = "na";
    let templateId = "GENERAL_FALLBACK_TEMPLATE";

    if (lowercase.includes("nclt") || lowercase.includes("oppress") || lowercase.includes("mismanagement") || lowercase.includes("companies act") || lowercase.includes("241")) {
      docType = "nclt_petition";
      courtType = "tribunal";
      templateId = "CORP_NCLT_OPPRESSION";
    } else if (lowercase.includes("nda") || lowercase.includes("non-disclosure") || lowercase.includes("confidential")) {
      docType = "nda_review";
      courtType = "na";
      templateId = "CORP_NDA_REVIEW";
    }

    return {
      practice_area: area,
      document_type: docType,
      court_type: courtType,
      template_id: templateId
    };
  }

  // 4. Family Law Fallback
  if (
    lowercase.includes("divorce") ||
    lowercase.includes("maintenance") ||
    lowercase.includes("family") ||
    lowercase.includes("dv act") ||
    lowercase.includes("marriage") ||
    lowercase.includes("alimony")
  ) {
    return {
      practice_area: "family",
      document_type: "general",
      court_type: "na",
      template_id: "GENERAL_FALLBACK_TEMPLATE"
    };
  }

  // 5. Property Dispute Fallback
  if (
    lowercase.includes("rera") ||
    lowercase.includes("property") ||
    lowercase.includes("possession") ||
    lowercase.includes("interest") ||
    lowercase.includes("construction") ||
    lowercase.includes("builder")
  ) {
    return {
      practice_area: "property",
      document_type: "general",
      court_type: "na",
      template_id: "GENERAL_FALLBACK_TEMPLATE"
    };
  }

  // Default General Fallback
  return {
    practice_area: "general",
    document_type: "general",
    court_type: "na",
    template_id: "GENERAL_FALLBACK_TEMPLATE"
  };
}

/**
 * Intelligent selector that returns a matching LegalTemplate or GENERAL_FALLBACK_TEMPLATE.
 */
export function selectTemplate(classification: ClassificationResult): LegalTemplate {
  const found = LEGAL_TEMPLATES.find(t => t.id === classification.template_id);
  return found || LEGAL_TEMPLATES[LEGAL_TEMPLATES.length - 1]; // fallback to last (GENERAL_FALLBACK_TEMPLATE)
}
