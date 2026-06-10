import { LegalTemplate, KnowledgeNode, SectionMapping, CourtFormat, Matter } from './types';

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  // CONSTRAINT nodes
  {
    id: "C-001",
    node_type: "CONSTRAINT",
    title: "Standard Bail Argument Sequence",
    content: "Standard bail argument sequence: cooperation with investigation first, then no flight risk, then no evidence tampering, then parity with co-accused.",
    practice_area: "criminal",
    tags: ["bail", "argument_sequence", "anticipatory_bail"],
    client_id: null,
    matter_id: null
  },
  {
    id: "C-002",
    node_type: "CONSTRAINT",
    title: "Surrender Passport Undertaking",
    content: "For bail applications, always include undertaking to surrender passport if client has foreign travel history.",
    practice_area: "criminal",
    tags: ["bail", "passport", "travel_history"],
    client_id: null,
    matter_id: null
  },
  {
    id: "C-003",
    node_type: "CONSTRAINT",
    title: "Avoid patronizing Delhi HC comments",
    content: "NEVER argue 'Section 482 is not a bar on bail' as primary argument — Delhi HC judges find this patronizing.",
    practice_area: "criminal",
    tags: ["bail", "delhi", "high_court"],
    client_id: null,
    matter_id: null
  },
  {
    id: "C-004",
    node_type: "CONSTRAINT",
    title: "NDA Standard Legally Compelled Disclosure Carve-out",
    content: "All NDAs must include carve-out for legally compelled disclosure per firm policy.",
    practice_area: "corporate",
    tags: ["nda", "contract", "disclosure"],
    client_id: null,
    matter_id: null
  },
  {
    id: "C-005",
    node_type: "CONSTRAINT",
    title: "Divorce Petitions DV Act Verification",
    content: "For divorce petitions, always verify whether client has filed DV Act complaint — impacts maintenance strategy.",
    practice_area: "family",
    tags: ["divorce", "dv_act", "maintenance"],
    client_id: null,
    matter_id: null
  },

  // ANTI_PATTERN nodes
  {
    id: "AP-001",
    node_type: "ANTI_PATTERN",
    title: "A blanket Siddharth v. State of UP Citation Pushback",
    content: "Don't cite Siddharth v. State of UP (2021) 10 SCC 1 without distinguishing the facts — judges have started pushing back on blanket Siddharth citations in economic offence bail.",
    practice_area: "criminal",
    tags: ["bail", "citation", "economic_offence"],
    client_id: null,
    matter_id: null
  },
  {
    id: "AP-002",
    node_type: "ANTI_PATTERN",
    title: "Economic Offence Flight Risk Argumentation Order",
    content: "In economic offence bail, don't lead with 'no flight risk' — lead with 'cooperation with investigation' because courts view flight risk as less relevant when accused has cooperated.",
    practice_area: "criminal",
    tags: ["bail", "economic_offence", "flight_risk"],
    client_id: null,
    matter_id: null
  },
  {
    id: "AP-003",
    node_type: "ANTI_PATTERN",
    title: "Startup Limitless Indemnity in NDA Contract Drafting",
    content: "Don't draft NDA with unlimited indemnity for Indian startups — investors flag this in DD. Cap at 1x contract value.",
    practice_area: "corporate",
    tags: ["nda", "indemnity", "startup"],
    client_id: null,
    matter_id: null
  },
  {
    id: "AP-004",
    node_type: "ANTI_PATTERN",
    title: "Excessive Interest Claim under Property RERA Rules",
    content: "In RERA complaints, don't claim 18% interest — RERA authorities consistently cap at SBI PLR + 2%.",
    practice_area: "property",
    tags: ["rera", "interest", "property_dispute"],
    client_id: null,
    matter_id: null
  },

  // DECISION nodes
  {
    id: "D-001",
    node_type: "DECISION",
    title: "Malhotra Anticipatory Bail Granted precedent (2026)",
    content: "Malhotra anticipatory bail (2026): GRANTED by Justice Mehta, Delhi HC. Winning strategy: led with cooperation argument (3 police notices) + forensic audit showed legitimate expenses. Judge: 'blanket denial in economic offences is not the law.'",
    practice_area: "criminal",
    tags: ["bail", "granted", "delhi", "section_318", "economic_offence"],
    client_id: null,
    matter_id: null
  },
  {
    id: "D-002",
    node_type: "DECISION",
    title: "Gupta Anticipatory Bail Denied precedent (2025)",
    content: "Gupta anticipatory bail (2025): DENIED. Judge noted accused had not appeared for ANY police notices. Lesson: always ensure 2-3 police appearances before filing bail.",
    practice_area: "criminal",
    tags: ["bail", "denied", "lesson", "police_notices"],
    client_id: null,
    matter_id: null
  },
  {
    id: "D-003",
    node_type: "DECISION",
    title: "FSL Delay Bail Precedent Strategy",
    content: "FSL report delay (2025): Bail GRANTED partly because FSL report pending 45 days. Citing investigation delay strengthened argument significantly.",
    practice_area: "criminal",
    tags: ["bail", "granted", "strategy", "fsl_delay"],
    client_id: null,
    matter_id: null
  },
  {
    id: "D-004",
    node_type: "DECISION",
    title: "Sharma Divorce Alimony Capacity Outcome",
    content: "Sharma divorce (2026): Maintenance at 25% of husband's income. Court rejected 40% claim citing working wife's income. Lesson: factor wife's earning capacity.",
    practice_area: "family",
    tags: ["divorce", "maintenance", "earning_capacity"],
    client_id: null,
    matter_id: null
  },
  {
    id: "D-005",
    node_type: "DECISION",
    title: "TechCorp NDA Trade Secret Returns Safeguard",
    content: "TechCorp NDA (2026): Client lost trade secret protection — NDA had no 'return of materials' clause. Now mandatory: every NDA must include return/destruction of materials.",
    practice_area: "corporate",
    tags: ["nda", "lesson", "trade_secret", "return_clause"],
    client_id: null,
    matter_id: null
  },
  {
    id: "D-006",
    node_type: "DECISION",
    title: "RERA Notice Procedural Rejection Rule (2025)",
    content: "RERA Ganesh Heights (2025): Complaint dismissed — buyer hadn't sent legal notice before filing. Now mandatory: legal notice 30 days before RERA complaint.",
    practice_area: "property",
    tags: ["rera", "dismissed", "lesson", "legal_notice"],
    client_id: null,
    matter_id: null
  },
  {
    id: "D-007",
    node_type: "DECISION",
    title: "Ravi Investments Minority Oppression NCLT Petition",
    content: "Ravi Investments NCLT (2025): Petition under Section 241 allowed. Tribunal noted systematic exclusion from board meetings + dividend suppression. Key: 2 years of exclusion emails documented.",
    practice_area: "corporate",
    tags: ["nclt", "oppression", "granted", "exclusion"],
    client_id: null,
    matter_id: null
  },
  {
    id: "D-008",
    node_type: "DECISION",
    title: "Kapoor FIR Quashing 528 Civil Dispute",
    content: "Kapoor FIR quashing (2026): FIR under Section 318 BNS quashed by Delhi HC under Section 528 BNSS. Ground: purely civil dispute dressed as criminal complaint.",
    practice_area: "criminal",
    tags: ["quashing", "granted", "528", "civil_dispute", "section_318"],
    client_id: null,
    matter_id: null
  },

  // CLIENT_FACT nodes
  {
    id: "CF-001",
    node_type: "CLIENT_FACT",
    title: "Client Rajesh Kumar: Clean Background",
    content: "Client Rajesh Kumar: first-time offender, no prior criminal record.",
    practice_area: "criminal",
    tags: ["client_rajesh", "matter_bail_001", "first_offender"],
    client_id: "client_rajesh",
    matter_id: "matter_bail_001"
  },
  {
    id: "CF-002",
    node_type: "CLIENT_FACT",
    title: "Client Rajesh Kumar: Diligent Cooperation",
    content: "Client Rajesh Kumar: cooperated with investigation — appeared for 3 police notices (15 Jan, 22 Jan, 5 Feb 2026).",
    practice_area: "criminal",
    tags: ["client_rajesh", "matter_bail_001", "cooperation", "police_notices"],
    client_id: "client_rajesh",
    matter_id: "matter_bail_001"
  },
  {
    id: "CF-003",
    node_type: "CLIENT_FACT",
    title: "Client Rajesh Kumar: Strong Community Assets",
    content: "Client Rajesh Kumar: owns property worth ₹2 Cr in Delhi — strong community roots.",
    practice_area: "criminal",
    tags: ["client_rajesh", "matter_bail_001", "property_roots"],
    client_id: "client_rajesh",
    matter_id: "matter_bail_001"
  },
  {
    id: "CF-004",
    node_type: "CLIENT_FACT",
    title: "Client TechCorp: Funding & Cloud NDA Context",
    content: "Client TechCorp: Series B startup, $5M raised, 45 employees. NDA for vendor data sharing with US cloud provider.",
    practice_area: "corporate",
    tags: ["client_techcorp", "matter_nda_001", "startup", "context"],
    client_id: "client_techcorp",
    matter_id: "matter_nda_001"
  },
  {
    id: "CF-005",
    node_type: "CLIENT_FACT",
    title: "Client Ravi Investments: Board Exclusion History",
    content: "Client Ravi Investments: 15% minority shareholder, documented emails showing exclusion from board since March 2024.",
    practice_area: "corporate",
    tags: ["client_ravi", "matter_nclt_001", "oppression", "evidence"],
    client_id: "client_ravi",
    matter_id: "matter_nclt_001"
  }
];

export const SECTION_MAPPINGS: SectionMapping[] = [
  { old_section: "Section 302 IPC", new_section: "Section 101 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 304 IPC", new_section: "Section 105 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 304A IPC", new_section: "Section 106 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 304B IPC", new_section: "Section 80 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 306 IPC", new_section: "Section 108 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 307 IPC", new_section: "Section 109 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 323 IPC", new_section: "Section 115 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 326 IPC", new_section: "Section 119 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 354 IPC", new_section: "Section 74 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 376 IPC", new_section: "Section 63 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 379 IPC", new_section: "Section 303 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 384 IPC", new_section: "Section 308 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 392 IPC", new_section: "Section 309 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 406 IPC", new_section: "Section 316 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 420 IPC", new_section: "Section 318 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 467 IPC", new_section: "Section 336 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 498A IPC", new_section: "Section 85 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 499 IPC", new_section: "Section 356 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 506 IPC", new_section: "Section 351 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 34 IPC", new_section: "Section 3(5) BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 120B IPC", new_section: "Section 61 BNS", old_act: "IPC", new_act: "BNS" },
  { old_section: "Section 125 CrPC", new_section: "Section 144 BNSS", old_act: "CrPC", new_act: "BNSS" },
  { old_section: "Section 154 CrPC", new_section: "Section 173 BNSS", old_act: "CrPC", new_act: "BNSS" },
  { old_section: "Section 156(3) CrPC", new_section: "Section 175(3) BNSS", old_act: "CrPC", new_act: "BNSS" },
  { old_section: "Section 167 CrPC", new_section: "Section 187 BNSS", old_act: "CrPC", new_act: "BNSS" },
  { old_section: "Section 437 CrPC", new_section: "Section 480 BNSS", old_act: "CrPC", new_act: "BNSS" },
  { old_section: "Section 438 CrPC", new_section: "Section 482 BNSS", old_act: "CrPC", new_act: "BNSS" },
  { old_section: "Section 439 CrPC", new_section: "Section 483 BNSS", old_act: "CrPC", new_act: "BNSS" },
  { old_section: "Section 482 CrPC", new_section: "Section 528 BNSS", old_act: "CrPC", new_act: "BNSS" },
  { old_section: "Section 65B IEA", new_section: "Section 63 BSA", old_act: "IEA", new_act: "BSA" }
];

export const COURT_FORMATS: CourtFormat[] = [
  {
    court_code: "delhi_hc",
    court_name: "IN THE HIGH COURT OF DELHI AT NEW DELHI",
    header_template: `IN THE HIGH COURT OF DELHI AT NEW DELHI\nCRIMINAL MISCELLANEOUS APPLICATION No. ___ of 2026\n(Under Section 482 of BNSS, 2023)\n\nIN THE MATTER OF:\n{ACCUSED_PARTY}\n...Applicant\n\nVersus\n\nState of NCT of Delhi\n...Respondent\n\nMOST RESPECTFULLY SHOWETH:`,
    party_format: `{accused_name} S/o {father_name}, aged {age} years, R/o {address}`,
    closing_format: `AND FOR THIS ACT OF KINDNESS, THE APPLICANT AS IN DUTY BOUND SHALL EVER PRAY.\n\nFILED BY:\nCOUNSEL FOR THE APPLICANT\nNew Delhi\nDate:`
  },
  {
    court_code: "sessions_court",
    court_name: "IN THE COURT OF SESSIONS JUDGE, PATIALA HOUSE COURTS",
    header_template: `IN THE COURT OF SESSIONS JUDGE\nPATIALA HOUSE COURTS, NEW DELHI\nSESSIONS CASE No. ___ of 2026\n\nIN THE MATTER OF:\n{ACCUSED_PARTY}\n...Applicant / Accused\n\nVersus\n\nState (Govt. of NCT of Delhi)\n...Respondent\n\nAPPLICATION UNDER SECTION 480 BNSS FOR GRANT OF BAIL\n\nTHE APPLICANT MOST HUMBLY SHOWETH:`,
    party_format: `{accused_name} S/o {father_name}, aged {age} years, R/o {address}`,
    closing_format: `PRAYER:\n\nIt is therefore, most respectfully prayed that this Hon'ble Court may be pleased to enlarge the applicant on bail in terms of the interest of justice.\n\nAPPLICANT\n\nThrough:\nCounsel for the Applicant\nDate:`
  },
  {
    court_code: "nclt_delhi",
    court_name: "BEFORE THE NATIONAL COMPANY LAW TRIBUNAL, NEW DELHI",
    header_template: `BEFORE THE NATIONAL COMPANY LAW TRIBUNAL\nNEW DELHI BENCH\nCP No. (IB)-___/ND/2026\n\nIN THE MATTER OF:\n(Under Section 241 and 242 of the Companies Act, 2013)\n\n{FIRST_PARTY}\n...Petitioner\n\nVersus\n\n{SECOND_PARTY}\n...Respondent\n\nPETITION FOR RELIEF AGAINST OPPRESSION AND MISMANAGEMENT`,
    party_format: `{client_name} having registered address at {address}`,
    closing_format: `PRAYER:\n\nIn light of the facts and circumstances narrated above, the Petitioner prays for immediate restoration of board participation rights and stay on capital allocation decisions.\n\nPETITIONER\n\nThrough:\nAdvocates`
  }
];

export const PRESET_MATTERS: Matter[] = [
  {
    id: "matter_bail_001",
    title: "Rajesh Kumar Anticipatory Bail",
    client_name: "Rajesh Kumar",
    practice_area: "criminal",
    document_type: "anticipatory_bail",
    court_type: "high_court",
    court_name: "IN THE HIGH COURT OF DELHI AT NEW DELHI",
    charge: "Section 318 BNS (cheating)",
    fir: "189/2026, PS Saket",
    facts: "Rajesh Kumar, a 45-year-old businessman in Saket, accused of cheating under Section 318 BNS (previously Section 420 IPC) over a business transaction that failed. He is a first-time offender with strong roots. He cooperated fully with the Police, appearing in person for three notices dated 15 Jan, 22 Jan, and 5 Feb 2026. The query requests an anticipatory bail application under Section 482 BNSS.",
    client_id: "client_rajesh",
    status: ["First-time offender", "Cooperated with 3 notices", "Civil transition dispute"]
  },
  {
    id: "matter_quash_001",
    title: "Anil Verma FIR Quashing",
    client_name: "Anil Verma",
    practice_area: "criminal",
    document_type: "fir_quashing",
    court_type: "high_court",
    court_name: "IN THE HIGH COURT OF DELHI AT NEW DELHI",
    charge: "Section 351 BNS (criminal intimidation) + Section 61 BNS (criminal conspiracy)",
    fir: "312/2026, PS Mehrauli",
    facts: "Anil Verma, 52M, seeks FIR quashing of FIR 312/2026 under Sections 351 (criminal intimidation) and 61 (criminal conspiracy) BNS. The dispute is over a commercial landlord-tenant contract, where a minor argument was blown out of proportion and framed as a criminal offense. The dispute is entirely civil in nature dressed as a criminal complaint.",
    client_id: "client_anil",
    status: ["Civil dispute dressed as criminal", "Contract dispute background", "Seeks Section 528 BNSS quashing"]
  },
  {
    id: "matter_theft_001",
    title: "Suresh Patiala House Bail",
    client_name: "Suresh",
    practice_area: "criminal",
    document_type: "anticipatory_bail",
    court_type: "sessions_court",
    court_name: "IN THE COURT OF SESSIONS JUDGE, PATIALA HOUSE COURTS",
    charge: "Section 303 BNS (theft)",
    fir: "445/2026, PS Connaught Place",
    facts: "Suresh, a 28-year-old daily wage laborer, was falsely accused of theft under Section 303 BNS of a phone in Connaught Place, Delhi. No prior record, extremely poor background, requires legal aid provisions, and representation under free legal service guidelines. Needs bail from the Sessions Court, Patiala House.",
    client_id: "client_suresh",
    status: ["Socioeconomic daily wage laborer", "Section 304 BNSS legal aid", "Sessions court format"]
  },
  {
    id: "matter_nda_001",
    title: "TechCorp NDA Review",
    client_name: "TechCorp Pvt Ltd",
    practice_area: "corporate",
    document_type: "nda_review",
    court_type: "na",
    court_name: "N/A (Transactional)",
    facts: "TechCorp Pv Ltd, a Series B startup ($5M raised, 45 employees), requires drafting and review of a vendor data sharing Non-Disclosure Agreement (NDA) with a US cloud provider. Need to safeguard Trade Secrets, mandate return of materials, ensure a cap on indemnities, and insert legally compelled disclosure carve-outs.",
    client_id: "client_techcorp",
    status: ["Series B Startup context", "Must safeguard trade secrets", "Cap indemnity at 1x contract"]
  },
  {
    id: "matter_nclt_001",
    title: "Ravi Investments Minority Oppression",
    client_name: "Ravi Investments",
    practice_area: "corporate",
    document_type: "nclt_petition",
    court_type: "tribunal",
    court_name: "BEFORE THE NATIONAL COMPANY LAW TRIBUNAL, NEW DELHI BENCH",
    facts: "Ravi Investments holds a 15% minority shareholding in an engineering venture. Over the last two years (since March 2024), the majority shareholders have systematically excluded Ravi Investments from board meetings, suppressed dividend distributions, and engaged in asset siphoning. Client wants to file a petition under Section 241 and 242 of the Companies Act 2013 for oppression and mismanagement at NCLT.",
    client_id: "client_ravi",
    status: ["15% minority shareholder", "2 years board exclusion documented", "Companies Act Section 241"]
  },
  {
    id: "matter_overlap_001",
    title: "Vikram Mehta Overlap Proceeding",
    client_name: "Vikram Mehta",
    practice_area: "overlap",
    document_type: "general",
    court_type: "high_court",
    court_name: "IN THE HIGH COURT OF DELHI & NCLT BENCH",
    charge: "Section 318 BNS (cheating FIR 678/2026) + NCLT oppression defence",
    facts: "Vikram Mehta, 48M, is caught in an aggressive investor dispute. The foreign investors have filed a criminal FIR (FIR 678/2026) alleging cheating under Section 318 BNS to push him out of the board, while simultaneously filing an NCLT mismanagement petition. He needs a dual defense strategy — anticipatory bail for the Delhi High Court and an NCLT position defense on board rights. Need to access criminal AND corporate nodes.",
    client_id: "client_vikram",
    status: ["Dual proceedings (HC and NCLT)", "Cheating accusation Section 318 BNS", "Board exclusion dispute"]
  },
  {
    id: "matter_property_001",
    title: "Sunita Gupta Property Dispute",
    client_name: "Sunita Gupta",
    practice_area: "property",
    document_type: "general",
    court_type: "na",
    court_name: "Civil Court Delhi",
    facts: "Sunita Gupta filed a complaint before Delhi RERA over delay in unit delivery by Ganesh Heights builder. The builder is demanding excess charges. Need RERA compliance rules, legal notices, and interest limits.",
    client_id: "client_sunita",
    status: ["RERA units delay", "Interest cap at SBI PLR + 2%", "Legal notice 30 days mandatory"]
  },
  {
    id: "matter_family_001",
    title: "Anonymous Divorce Petition",
    client_name: "Anonymous",
    practice_area: "family",
    document_type: "general",
    court_type: "na",
    court_name: "Family Court Delhi",
    facts: "Client seeks guidance on filing of divorce petition weaved with a maintenance request. Need DV Act check, alimony caps, and strategic counseling rules.",
    client_id: "client_anon",
    status: ["Divorce and alimony", "Wife earning capacity factor", "DV act check needed"]
  }
];

export const LEGAL_TEMPLATES: LegalTemplate[] = [
  {
    id: "IN_CRIMINAL_BAIL_ANTICIPATORY_HC",
    template_id: "IN_CRIMINAL_BAIL_ANTICIPATORY_HC",
    jurisdiction: "IN",
    practice_area: "criminal",
    document_type: "anticipatory_bail",
    court_type: "high_court",
    display_name: "Delhi High Court Anticipatory Bail Application Template",
    auto_research_query: "anticipatory bail Section 482 BNSS Delhi High Court",
    quality_checks: [
      "Header is strictly: 'IN THE HIGH COURT OF DELHI AT NEW DELHI'",
      "Cites Section 482 BNSS (instead of Section 438 CrPC)",
      "Applies Section 318 BNS (instead of Section 420 IPC)",
      "Closes with: 'AND FOR THIS ACT OF KINDNESS, THE APPLICANT AS IN DUTY BOUND SHALL EVER PRAY.'"
    ],
    system_prompt: `You are a high-caliber senior legal partner specialized in criminal practice before the Hon'ble Delhi High Court.
Your objective is to produce a flawless, petition-ready Anticipatory Bail Application under Section 482 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023.

DIRECTIONS:
1. Always frame the petition using the strict formal Indian Court format. Use numbered paragraphs and explicit labels.
2. Incorporate the following court format header:
IN THE HIGH COURT OF DELHI AT NEW DELHI
CRIMINAL MISCELLANEOUS APPLICATION No. ___ of 2026
(Under Section 482 of BNSS, 2023)

IN THE MATTER OF:
{ACCUSED_PARTY_HEADER}
...Applicant

Versus

State of NCT of Delhi
...Respondent

MOST RESPECTFULLY SHOWETH:

3. Argue legal strategy strictly guided by the Indian precedents and firm rules provided below:
{FIRM_CONSTRAINTS}

{FIRM_DECISIONS}

{FIRM_ANTI_PATTERNS}

{CLIENT_FACTS_DRAFT}

{IK_RESEARCH_DUE}

4. In level 3 generation, ensure you weave in client-specific facts beautifully (e.g. if the client appeared for notices, name those dates: 15 Jan, 22 Jan, 5 Feb 2026). Ensure the Siddharth citation is contextualized rather than printed blindly. Use Section 318 BNS for cheating!

5. The final sentence must be exactly:
"AND FOR THIS ACT OF KINDNESS, THE APPLICANT AS IN DUTY BOUND SHALL EVER PRAY."`
  },
  {
    id: "CORP_NCLT_OPPRESSION",
    template_id: "CORP_NCLT_OPPRESSION",
    jurisdiction: "IN",
    practice_area: "corporate",
    document_type: "nclt_petition",
    court_type: "tribunal",
    display_name: "NCLT Oppression & Mismanagement Section 241 Board Petition",
    auto_research_query: "Section 241 Companies Act minority oppression mismanagement NCLT Delhi",
    quality_checks: [
      "Header is strictly: 'BEFORE THE NATIONAL COMPANY LAW TRIBUNAL, NEW DELHI BENCH'",
      "Cites Section 241 and 242 of the Companies Act, 2013",
      "Details board exclusion and dividend suppression as grounds",
      "Avoids any mention of criminal BNS/IPC sections unless fraud overlaps"
    ],
    system_prompt: `You are an elite corporate lawyer representing minority shareholders before the National Company Law Tribunal (NCLT).
Your task is to draft a Company Petition for Oppression and Mismanagement under Sections 241 and 242 of the Companies Act, 2013.

DIRECTIONS:
1. Utilize the Tribunal Format:
BEFORE THE NATIONAL COMPANY LAW TRIBUNAL
NEW DELHI BENCH
CP No. (IB)-___/ND/2026

IN THE MATTER OF:
Sections 241 and 242 of the Companies Act, 2013

AND IN THE MATTER OF:
{FIRST_PARTY_HEADER}
...Petitioner

Versus

{SECOND_PARTY_HEADER}
...Respondents

PETITION FOR RELIEF AGAINST OPPRESSION AND MISMANAGEMENT

2. Ground your application in the corporate strategy:
{FIRM_CONSTRAINTS}

{FIRM_DECISIONS}

{FIRM_ANTI_PATTERNS}

{CLIENT_FACTS_DRAFT}

{IK_RESEARCH_DUE}

3. Argue grounds systematically: siphoning, dividend suppression, and total exclusion of board rights with explicit reference to our past successful matters.`
  },
  {
    id: "CORP_NDA_REVIEW",
    template_id: "CORP_NDA_REVIEW",
    jurisdiction: "IN",
    practice_area: "corporate",
    document_type: "nda_review",
    court_type: "na",
    display_name: "Strategic Corporate Non-Disclosure Agreement Review Template",
    auto_research_query: "trade secret injunction NDA confidentiality India Contract Act Section 27",
    quality_checks: [
      "Mandates 'Return or Destruction of Materials' clause",
      "Explicitly caps Indemnity at 1x contract value",
      "Includes carve-out for 'Legally Compelled Disclosure'",
      "Analyzes restraint of trade under Section 27 of ICA"
    ],
    system_prompt: `You are a corporate transactional partner specialized in cross-border software agreements and IP.
Your goal is to conduct a strategic, partner-level review of a proposed Non-Disclosure Agreement (NDA), highlighting critical gaps and providing redlines.

DIRECTIONS:
1. Review the NDA through the lens of Indian contract law (specifically restraint of trade under Section 27 of the Indian Contract Act, 1872) and data security under Section 43A of the IT Act.
2. Formulate your redline advisory inserting the following firm-specific nodes:
{FIRM_CONSTRAINTS}

{FIRM_DECISIONS}

{FIRM_ANTI_PATTERNS}

{CLIENT_FACTS_DRAFT}

{IK_RESEARCH_DUE}

3. Present the output in modular sections:
- Critical Operational Vulnerabilities
- Strict Redlines to enforce (with rationale)
- Redrafted Clauses (specifically compelled disclosure carve-outs, 1x liability cap, and return of materials)`
  },
  {
    id: "IN_CRIMINAL_QUASHING_HC",
    template_id: "IN_CRIMINAL_QUASHING_HC",
    jurisdiction: "IN",
    practice_area: "criminal",
    document_type: "fir_quashing",
    court_type: "high_court",
    display_name: "Delhi High Court FIR Quashing (Section 528 BNSS) Template",
    auto_research_query: "FIR quashing Section 528 BNSS High Court civil dispute dressed as criminal",
    quality_checks: [
      "Header is: 'IN THE HIGH COURT OF DELHI AT NEW DELHI'",
      "Cites Section 528 BNSS (instead of Section 482 CrPC)",
      "Highlights dispute is civil in nature dressed as criminal"
    ],
    system_prompt: `You are a high-court advocate specializing in Criminal Writs and Inherent Powers petitions.
Draft a robust Criminal Petition to quash an FIR under Section 528 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023.

DIRECTIONS:
1. Use the Header:
IN THE HIGH COURT OF DELHI AT NEW DELHI
CRIMINAL WRIT/PETITION No. ___ of 2026

IN THE MATTER OF:
{ACCUSED_PARTY_HEADER}
...Petitioner

Versus

State (Govt of NCT of Delhi)
...Respondent

2. Grounds must make it glaringly clear that the dispute stems from a commercial contract and is 'civil dispute dressed as criminal'. Include:
{FIRM_CONSTRAINTS}
{FIRM_DECISIONS}
{FIRM_ANTI_PATTERNS}
{CLIENT_FACTS_DRAFT}
{IK_RESEARCH_DUE}`
  },
  {
    id: "GENERAL_FALLBACK_TEMPLATE",
    template_id: "GENERAL_FALLBACK_TEMPLATE",
    jurisdiction: "IN",
    practice_area: "general",
    document_type: "general",
    court_type: "na",
    display_name: "BRAHMO General Case Strategy and Advice Engine Template",
    auto_research_query: "Indian courts recent judgments practice instructions",
    quality_checks: [
      "Identifies the practice area correctly",
      "Injects the correct contextual nodes from the firm's database",
      "Converts old criminal sections to BNS sections"
    ],
    system_prompt: `You are a veteran senior counsel at a multi-practice Indian law firm.
Your task is to review the query, draft or analyze the legal concern, and prepare a highly polished tactical strategy memorandum.

DIRECTIONS:
1. Classify the user query and align formatting.
2. Read and apply the injected firm instructions:
{FIRM_CONSTRAINTS}

{FIRM_DECISIONS}

{FIRM_ANTI_PATTERNS}

{CLIENT_FACTS_DRAFT}

{IK_RESEARCH_DUE}

3. Synthesize your legal advisory. Keep it rigorous, structured, and compliant with modern BNS, 2023, and Companies Act, 2013 standards.`
  }
];
