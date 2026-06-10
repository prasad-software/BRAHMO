import { KnowledgeNode, PracticeArea, IKCase } from '../types';
import { KNOWLEDGE_NODES } from '../data';

export interface InjectedNodesResult {
  constraintsText: string;
  decisionsText: string;
  antiPatternsText: string;
  clientFactsText: string;
  researchText: string;
  injectedIds: string[];
  tokenCount: number;
}

/**
 * Calculates a relevance score (0-100) between the user query and a knowledge node.
 * Based on similarity of query terms and tags overlap.
 */
export function calculateRelevance(node: KnowledgeNode, query: string, matterId?: string): number {
  let score = 0;
  const queryLower = query.toLowerCase();

  // If matterId matches specifically
  if (matterId && node.matter_id === matterId) {
    score += 50;
  }

  // Tag matching
  const matchingTags = node.tags.filter(tag => queryLower.includes(tag.toLowerCase()));
  score += matchingTags.length * 15;

  // Keyword matching in content and title
  const nodeWords = (node.title + " " + node.content).toLowerCase().split(/\W+/);
  const queryWords = queryLower.split(/\W+/).filter(w => w.length > 3);
  
  let keywordMatches = 0;
  for (const qw of queryWords) {
    if (nodeWords.includes(qw)) {
      keywordMatches++;
    }
  }
  score += keywordMatches * 5;

  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Injects knowledge nodes into a template structure following strict budget guidelines.
 * Token budget: 3000 tokens (approx 12,000 characters / 2,250 words).
 * Priority: CONSTRAINT (1) > ANTI_PATTERN (2) > DECISION (3) > CLIENT_FACT (4)
 */
export function injectKnowledge(
  query: string,
  practiceArea: PracticeArea | 'overlap',
  matterId?: string,
  researchCases: IKCase[] = [],
  customKNodes?: KnowledgeNode[]
): InjectedNodesResult {
  const queryLower = query.toLowerCase();
  const kNodesSource = customKNodes || KNOWLEDGE_NODES;

  // 1. Gather nodes from matching practice areas.
  // Overlap area pulls both criminal and corporate.
  let eligibleNodes = kNodesSource.filter(node => {
    if (practiceArea === 'overlap') {
      return node.practice_area === 'criminal' || node.practice_area === 'corporate';
    }
    // Also support general matches or direct match
    return node.practice_area === practiceArea;
  });

  // If no nodes found, or for family/property, expand search to relevant tags or all nodes
  if (eligibleNodes.length === 0) {
    eligibleNodes = kNodesSource.filter(node => 
      node.tags.some(tag => queryLower.includes(tag.toLowerCase())) ||
      node.practice_area === 'criminal' || node.practice_area === 'corporate'
    );
  }

  // 2. Score and sort by relevance and node type priority
  interface ScoredNode {
    node: KnowledgeNode;
    score: number;
    priority: number; // 1: CONSTRAINT, 2: ANTI_PATTERN, 3: DECISION, 4: CLIENT_FACT
  }

  const scored: ScoredNode[] = eligibleNodes.map(node => {
    let priority = 4;
    if (node.node_type === 'CONSTRAINT') priority = 1;
    else if (node.node_type === 'ANTI_PATTERN') priority = 2;
    else if (node.node_type === 'DECISION') priority = 3;

    return {
      node,
      score: calculateRelevance(node, query, matterId),
      priority
    };
  });

  // Re-rank: Higher score takes precedence. If scores tie, prioritize node_type priority
  scored.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority; // lower number (higher priority) first
    }
    return b.score - a.score; // higher relevance first
  });

  // Let's divide them by types, but filter out those with 0 relevance unless we need entries
  const selectedConstraints: KnowledgeNode[] = [];
  const selectedAntiPatterns: KnowledgeNode[] = [];
  const selectedDecisions: KnowledgeNode[] = [];
  const selectedClientFacts: KnowledgeNode[] = [];

  const injectedIds: string[] = [];
  
  // Approximate Token Calculation: 1 token = ~4 characters
  const CHARACTER_BUDGET = 11500; // Leave buffer for research cases
  let currentLength = 0;

  // We add nodes step-by-step maintaining the token budget
  for (const s of scored) {
    // If the score is less than 5 and it's not a specified matter node or direct match, we can skip to keep injection highly relevant
    if (s.score < 5 && !(matterId && s.node.matter_id === matterId)) {
      continue;
    }

    const formattedNode = `[${s.node.id}] ${s.node.node_type}: ${s.node.content}\n`;
    const lengthEstimate = formattedNode.length;

    if (currentLength + lengthEstimate > CHARACTER_BUDGET) {
      // If we are over budget, we skip. Because we sorted by priority, we truncate Client Facts first!
      continue;
    }

    currentLength += lengthEstimate;
    injectedIds.push(s.node.id);

    if (s.node.node_type === 'CONSTRAINT') {
      selectedConstraints.push(s.node);
    } else if (s.node.node_type === 'ANTI_PATTERN') {
      selectedAntiPatterns.push(s.node);
    } else if (s.node.node_type === 'DECISION') {
      selectedDecisions.push(s.node);
    } else if (s.node.node_type === 'CLIENT_FACT') {
      selectedClientFacts.push(s.node);
    }
  }

  // Format research cases text
  let researchText = "";
  if (researchCases && researchCases.length > 0) {
    researchText = "INDIAN KANOON RELEVANT PRECEDENTS INJECTED:\n";
    researchCases.forEach((c, idx) => {
      researchText += `${idx + 1}. case: "${c.title}" | Citation: ${c.citation || "Pending"} | Court: ${c.court || "Supreme Court of India"}\nSummary: ${c.headline}\n\n`;
    });
  }

  // Format text blocks for injection
  const constraintsText = selectedConstraints.map(n => `- CONSTRAINT [${n.id}] ${n.title}: "${n.content}"`).join("\n") || "No standard firm constraints injected.";
  const antiPatternsText = selectedAntiPatterns.map(n => `- WARNING/ANTI_PATTERN [${n.id}] ${n.title}: "${n.content}"`).join("\n") || "No standard firm anti-patterns injected.";
  const decisionsText = selectedDecisions.map(n => `- PAST DECISION/STRATEGY [${n.id}] ${n.title}: "${n.content}"`).join("\n") || "No past firm decision assets injected.";
  const clientFactsText = selectedClientFacts.map(n => `- CLIENT FACT [${n.id}] ${n.title}: "${n.content}"`).join("\n") || "No client-specific fact nodes injected.";

  // Calculate final total token count
  const allInjectedTextLength = constraintsText.length + antiPatternsText.length + decisionsText.length + clientFactsText.length + researchText.length;
  // A standard conversion is ~4 characters per token
  const tokenCount = Math.min(3000, Math.ceil(allInjectedTextLength / 4));

  return {
    constraintsText,
    decisionsText,
    antiPatternsText,
    clientFactsText,
    researchText,
    injectedIds,
    tokenCount
  };
}

/**
 * Replaces injection markers in a template prompt with formatted injected knowledge
 */
export function processTemplate(
  templatePrompt: string,
  injection: InjectedNodesResult,
  clientFactsPlaceholder = ""
): string {
  return templatePrompt
    .replace("{FIRM_CONSTRAINTS}", injection.constraintsText)
    .replace("{FIRM_ANTI_PATTERNS}", injection.antiPatternsText)
    .replace("{FIRM_DECISIONS}", injection.decisionsText)
    .replace("{CLIENT_FACTS_DRAFT}", injection.clientFactsText || clientFactsPlaceholder)
    .replace("{IK_RESEARCH_DUE}", injection.researchText);
}
