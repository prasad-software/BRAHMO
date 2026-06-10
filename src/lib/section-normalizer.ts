import { SectionMapping } from '../types';
import { SECTION_MAPPINGS } from '../data';

export interface NormalizerResult {
  normalizedText: string;
  replacements: string[];
}

/**
 * Normalizes old IPC / CrPC / IEA sections to new BNS / BNSS / BSA sections.
 * Scans text and performs replacements using precise patterns.
 */
export function normalizeSections(text: string): NormalizerResult {
  let normalizedText = text;
  const replacements: string[] = [];

  // Sort mappings by descending length of the search target to make sure we replace longer specific patterns first
  const sortedMappings = [...SECTION_MAPPINGS].sort((a, b) => b.old_section.length - a.old_section.length);

  for (const mapping of sortedMappings) {
    const oldSec = mapping.old_section; // e.g., "Section 420 IPC"
    const newSec = mapping.new_section; // e.g., "Section 318 BNS"

    // Extract raw numbers, e.g., "420" and acts "IPC"
    const numMatch = oldSec.match(/\d+(\([^\)]+\))?/);
    const num = numMatch ? numMatch[0] : "";
    const act = mapping.old_act; // "IPC", "CrPC", etc.
    const newAct = mapping.new_act; // "BNS", "BNSS", etc.

    // Define multiple regex patterns to catch various natural language representations:
    // 1. "Section 420 of the IPC"
    // 2. "Section 420 of IPC"
    // 3. "Section 420, IPC"
    // 4. "under section 420 of the indian penal code"
    // 5. "Section 420 of Indian Penal Code"
    // 6. "Section 420, Indian Penal Code"
    // 7. "Section 420 IPC"
    // 8. "420 IPC"

    let fullOldActName = "";
    if (act === "IPC") fullOldActName = "Indian Penal Code";
    else if (act === "CrPC") fullOldActName = "Code of Criminal Procedure";
    else if (act === "IEA") fullOldActName = "Indian Evidence Act";

    let fullNewActName = "";
    if (newAct === "BNS") fullNewActName = "Bharatiya Nyaya Sanhita, 2023";
    else if (newAct === "BNSS") fullNewActName = "Bharatiya Nagarik Suraksha Sanhita, 2023";
    else if (newAct === "BSA") fullNewActName = "Bharatiya Sakshya Adhiniyam, 2023";

    const patterns = [
      // Section XXX of the Indian Penal Code
      new RegExp(`Section\\s+${num}\\s+of\\s+the\\s+${fullOldActName}`, 'gi'),
      // Section XXX of Indian Penal Code
      new RegExp(`Section\\s+${num}\\s+of\\s+${fullOldActName}`, 'gi'),
      // Section XXX, Indian Penal Code
      new RegExp(`Section\\s+${num},\\s+${fullOldActName}`, 'gi'),
      // Section XXX Indian Penal Code
      new RegExp(`Section\\s+${num}\\s+${fullOldActName}`, 'gi'),
      // Section XXX of the IPC
      new RegExp(`Section\\s+${num}\\s+of\\s+the\\s+${act}`, 'gi'),
      // Section XXX of IPC
      new RegExp(`Section\\s+${num}\\s+of\\s+${act}`, 'gi'),
      // Section XXX, IPC
      new RegExp(`Section\\s+${num},\\s+${act}`, 'gi'),
      // Section XXX IPC
      new RegExp(`Section\\s+${num}\\s+${act}`, 'gi'),
      // XXX IPC
      new RegExp(`\\b${num}\\s+${act}\\b`, 'gi'),

      // Special case: just "Section XXX" if we can infer it, but let's stick to explicit acts to avoid false positives.
    ];

    let foundReplacement = false;

    for (const pattern of patterns) {
      if (pattern.test(normalizedText)) {
        normalizedText = normalizedText.replace(pattern, (match) => {
          foundReplacement = true;
          // Maintain capitalization style if possible, or use standard format
          return `Section ${num} of the ${fullNewActName} (${newSec})`;
        });
      }
    }

    if (foundReplacement) {
      replacements.push(`Converted legacy citation [${oldSec}] to compliance citation [${newSec}]`);
    }
  }

  // General catch-all for leftover standard acts names
  const regexIPC = /\bIndian Penal Code\b/g;
  const regexCrPC = /\bCode of Criminal Procedure\b/g;
  const regexIEA = /\bIndian Evidence Act\b/g;

  if (regexIPC.test(normalizedText)) {
    normalizedText = normalizedText.replace(regexIPC, "Bharatiya Nyaya Sanhita, 2023 (BNS)");
    replacements.push("Replaced broad reference to Indian Penal Code (IPC) with Bharatiya Nyaya Sanhita, 2023 (BNS)");
  }
  if (regexCrPC.test(normalizedText)) {
    normalizedText = normalizedText.replace(regexCrPC, "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)");
    replacements.push("Replaced broad reference to Code of Criminal Procedure (CrPC) with Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)");
  }
  if (regexIEA.test(normalizedText)) {
    normalizedText = normalizedText.replace(regexIEA, "Bharatiya Sakshya Adhiniyam, 2023 (BSA)");
    replacements.push("Replaced broad reference to Indian Evidence Act (IEA) with Bharatiya Sakshya Adhiniyam, 2023 (BSA)");
  }

  return {
    normalizedText,
    replacements
  };
}
