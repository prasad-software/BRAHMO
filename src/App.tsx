import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  FileText, 
  Bookmark, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Database, 
  HelpCircle, 
  ArrowRight, 
  TrendingUp, 
  Activity, 
  BookOpen, 
  Layers,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Matter, KnowledgeNode, SectionMapping, LegalTemplate, GenerationResult, IKCase } from './types';

export default function App() {
  // Preset States
  const [matters, setMatters] = useState<Matter[]>([]);
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [mappings, setMappings] = useState<SectionMapping[]>([]);
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);

  // Supabase states
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [loadedFromSupabase, setLoadedFromSupabase] = useState<any>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Form states for adding custom Node
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeId, setNewNodeId] = useState('');
  const [newNodeType, setNewNodeType] = useState<'CONSTRAINT' | 'ANTI_PATTERN' | 'DECISION' | 'CLIENT_FACT'>('CONSTRAINT');
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeContent, setNewNodeContent] = useState('');
  const [newNodePractice, setNewNodePractice] = useState<'criminal' | 'corporate' | 'family' | 'property' | 'general'>('criminal');
  const [newNodeTags, setNewNodeTags] = useState('');

  // Form states for adding custom Matter
  const [showAddMatterModal, setShowAddMatterModal] = useState(false);
  const [newMatterId, setNewMatterId] = useState('');
  const [newMatterTitle, setNewMatterTitle] = useState('');
  const [newMatterClient, setNewMatterClient] = useState('');
  const [newMatterPractice, setNewMatterPractice] = useState<'criminal' | 'corporate' | 'overlap' | 'family' | 'property' | 'general'>('criminal');
  const [newMatterDocType, setNewMatterDocType] = useState<'anticipatory_bail' | 'fir_quashing' | 'nda_review' | 'nclt_petition' | 'general'>('general');
  const [newMatterCourtType, setNewMatterCourtType] = useState<'high_court' | 'sessions_court' | 'tribunal' | 'na'>('na');
  const [newMatterCourtName, setNewMatterCourtName] = useState('');
  const [newMatterFacts, setNewMatterFacts] = useState('');
  const [newMatterCharge, setNewMatterCharge] = useState('');
  const [newMatterFir, setNewMatterFir] = useState('');

  // Copyable SQL setup instructions
  const [showSqlSetupInstructions, setShowSqlSetupInstructions] = useState(false);

  // Interface Input / Output States
  const [curQuery, setCurQuery] = useState('');
  const [results, setResults] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Tab/Visual States
  const [showDocSources, setShowDocSources] = useState(false);
  const [showDatabaseTab, setShowDatabaseTab] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM knowledge_nodes;');
  const [filteredNodes, setFilteredNodes] = useState<KnowledgeNode[]>([]);
  
  // Sourcing MD text
  const [sourcesMd, setSourcesMd] = useState('');

  const fetchPresets = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch('/api/presets');
      const data = await res.json();
      setMatters(data.matters);
      setNodes(data.nodes);
      setTemplates(data.templates);
      setMappings(data.mappings);
      setFilteredNodes(data.nodes);
      
      if (data.supabaseStatus) {
        setSupabaseStatus(data.supabaseStatus);
      }
      if (data.loadedFromSupabase) {
        setLoadedFromSupabase(data.loadedFromSupabase);
      }
      
      // Auto-pick matter only if none is currently selected
      if (!selectedMatter && data.matters && data.matters.length > 0) {
        handleSelectMatter(data.matters[0]);
      }
    } catch (err) {
      console.error("Presets load error:", err);
      setError("Could not establish a connection to the BRAHMO Service. Make sure port 3000 is open.");
    } finally {
      if (!silent) setRefreshing(false);
    }
  };

  // Fetch initial preloaded data from Server
  useEffect(() => {
    fetchPresets(true);

    // Curate quick inline preview for sources
    setSourcesMd(`### SOURCED PRECEDENTS (VERIFIED VIA INDIAN KANOON API)
1. Siddharth vs State Of Uttar Pradesh (2021) 10 SCC 1 - docid: 195847623
2. Satender Kumar Antil vs CBI (2022) 10 SCC 51 - docid: 198234567
3. State of Haryana vs Bhajan Lal (1992) Supp (1) SCC 335 - docid: 1043256
4. Tata Consultancy Services vs Cyrus Investments (2021) 9 SCC 1 - docid: 8415296
5. Niranjan Shankar Golikari vs Century Spinning (1967) 2 SCR 378 - docid: 1532478`);
  }, []);

  const handleSyncToSupabase = async () => {
    setSyncLoading(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/supabase/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setSyncResult(data);
      await fetchPresets(true);
    } catch (err: any) {
      setSyncResult({ error: err.message || "Failed to trigger synchronization." });
    } finally {
      setSyncLoading(false);
    }
  };

  const handleAddCustomNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeId || !newNodeTitle || !newNodeContent) {
      alert("Please fill all mandatory fields.");
      return;
    }

    try {
      const res = await fetch('/api/supabase/add-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newNodeId,
          node_type: newNodeType,
          title: newNodeTitle,
          content: newNodeContent,
          practice_area: newNodePractice,
          tags: newNodeTags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Knowledge node created successfully.");
        setShowAddNodeModal(false);
        // Clear inputs
        setNewNodeId('');
        setNewNodeTitle('');
        setNewNodeContent('');
        setNewNodeTags('');
        await fetchPresets(true);
      } else {
        alert("Error adding node: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error adding node: " + err.message);
    }
  };

  const handleAddCustomMatter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatterId || !newMatterTitle || !newMatterClient || !newMatterFacts) {
      alert("Please fill all mandatory fields.");
      return;
    }

    try {
      const res = await fetch('/api/supabase/add-matter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newMatterId,
          title: newMatterTitle,
          client_name: newMatterClient,
          practice_area: newMatterPractice,
          document_type: newMatterDocType,
          court_type: newMatterCourtType,
          court_name: newMatterCourtName || "N/A",
          facts: newMatterFacts,
          charge: newMatterCharge || undefined,
          fir: newMatterFir || undefined,
          status: ["Custom Active Dossier", "Supabase Client Saved"]
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Matter dossier added successfully.");
        setShowAddMatterModal(false);
        // Clear inputs
        setNewMatterId('');
        setNewMatterTitle('');
        setNewMatterClient('');
        setNewMatterCourtName('');
        setNewMatterFacts('');
        setNewMatterCharge('');
        setNewMatterFir('');
        await fetchPresets(true);
      } else {
        alert("Error adding matter: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error adding matter: " + err.message);
    }
  };


  const handleSelectMatter = (matter: Matter) => {
    setSelectedMatter(matter);
    let promptQuery = `Draft anticipatory bail for client accused ${matter.charge || "Section 318 BNS"}, FIR ${matter.fir || "189/2026"}, local PS. First-time offender.`;
    if (matter.document_type === 'fir_quashing') {
      promptQuery = `Draft FIR quashing application under Section 528 BNSS for ${matter.client_name}, FIR ${matter.fir || "312/2026 PS Mehrauli"}, dispute is transactional landlord-tenant.`;
    } else if (matter.document_type === 'nclt_petition') {
      promptQuery = `Prepare Company Petition for Oppression under Section 241/242 of Companies Act for Ravi Investments holding 15% stake before NCLT Delhi Bench.`;
    } else if (matter.document_type === 'nda_review') {
      promptQuery = `Review mutual data sharing NDA for TechCorp Pvt Ltd cloud partner, capping startup damages and adding legally compelled disclosure carve-outs.`;
    } else if (matter.practice_area === 'overlap') {
      promptQuery = `Draft dual defense strategy: anticipatory bail for Delhi HC (charge Section 318 BNS on FIR 678/2026) and oppression defense on board rights before NCLT Delhi Bench.`;
    } else if (matter.practice_area === 'property') {
      promptQuery = `Prepare a builder delay complaint under RERA rules for Sunita Gupta, capping interest at SBI PLR + 2%. Check notice rule.`;
    } else if (matter.practice_area === 'family') {
      promptQuery = `Draft divorce and alimony strategy. Verify if client anonymous filed any domestic violence (DV Act) cases first.`;
    }
    setCurQuery(promptQuery);
  };

  const executeGeneration = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: curQuery,
          matterId: selectedMatter?.id || ""
        })
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data);
      } else {
        throw new Error(data.error || "Generation query crashed or failed.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected network or compiler error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Mock SQL execution simulator for the unified database explorer
  const runFilterSQL = () => {
    const cleanSql = sqlQuery.toLowerCase().trim();
    if (cleanSql.includes("where practice_area='criminal'")) {
      setFilteredNodes(nodes.filter(n => n.practice_area === 'criminal'));
    } else if (cleanSql.includes("where practice_area='corporate'")) {
      setFilteredNodes(nodes.filter(n => n.practice_area === 'corporate'));
    } else if (cleanSql.includes("where node_type='constraint'")) {
      setFilteredNodes(nodes.filter(n => n.node_type === 'CONSTRAINT'));
    } else if (cleanSql.includes("where node_type='anti_pattern'")) {
      setFilteredNodes(nodes.filter(n => n.node_type === 'ANTI_PATTERN'));
    } else if (cleanSql.includes("where node_type='decision'")) {
      setFilteredNodes(nodes.filter(n => n.node_type === 'DECISION'));
    } else {
      setFilteredNodes(nodes);
    }
  };

  return (
    <div id="brahmo-app-container" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* 1. Header Navigation Bar */}
      <header id="brahmo-header" className="border-b border-slate-800 bg-slate-900 text-white sticky top-0 z-50 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div id="logo" className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center font-bold text-xl text-white shadow-sm font-sans">
              B
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                BRAHMO <span className="text-slate-400 font-normal underline decoration-blue-500">Legal Engine</span>
              </h1>
              <p className="text-[10px] text-slate-400">Firm Knowledge Injector & Template Engine — India Criminal + Corporate</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-doc-sources"
              onClick={() => setShowDocSources(!showDocSources)}
              className="px-3 py-1.5 rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-2 transition duration-150 cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-400" />
              Sourced Citations
            </button>
            <button
              id="btn-db-explorer"
              onClick={() => setShowDatabaseTab(!showDatabaseTab)}
              className="px-3 py-1.5 rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-2 transition duration-150 cursor-pointer"
            >
              <Database className="h-3.5 w-3.5 text-blue-400" />
              Unified Schema Explorer
            </button>
            
            {supabaseStatus?.connected ? (
              <span className="text-xs text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1.5 rounded border border-emerald-500/20" title={`Live Supabase Connected`}>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Supabase Connected
              </span>
            ) : (
              <span className="text-xs text-amber-300 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1.5 rounded border border-amber-500/20">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                In-Memory Cache (Running offline)
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* 2. Top dossier panel - Select Matter */}
        <section id="matter-dossier-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-4 gap-2">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">Firm Case Folder Pre-loaded dossiers</h2>
            </div>
            <div className="flex items-center gap-3">
              {supabaseStatus?.connected && (
                <button
                  onClick={() => setShowAddMatterModal(true)}
                  className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg cursor-pointer transition flex items-center gap-1 shrink-0"
                >
                  + Add Client Dossier
                </button>
              )}
              <span className="text-xs text-slate-400">Pick any of the core scenarios or click custom presets:</span>
            </div>
          </div>

          {/* Dossiers Carousel Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {matters.map((m, index) => {
              const active = selectedMatter?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectMatter(m)}
                  className={`relative p-3 rounded-xl border flex flex-col text-left transition duration-200 cursor-pointer ${
                    active 
                    ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500/20 text-slate-900' 
                    : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/50'
                  }`}
                >
                  <span className="text-[9px] text-slate-400 font-mono mb-1">SCENARIO {index + 1}</span>
                  <span className="text-xs font-bold text-slate-800 truncate">{m.client_name}</span>
                  <span className={`text-[9px] mt-2 px-1.5 py-0.5 rounded uppercase self-start font-semibold ${
                    m.practice_area === 'criminal' 
                    ? 'bg-red-50 text-red-700 border border-red-100' 
                    : m.practice_area === 'corporate' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                    : m.practice_area === 'overlap' 
                    ? 'bg-purple-50 text-purple-705 border border-purple-100'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {m.practice_area}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Display expanded description of the selected dossier */}
          {selectedMatter && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 w-full text-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-800 font-bold">{selectedMatter.title}</span>
                  {selectedMatter.charge && <span className="bg-white text-slate-600 text-xs px-2 py-0.5 rounded border border-slate-200 font-mono">{selectedMatter.charge}</span>}
                  {selectedMatter.fir && <span className="bg-white text-slate-600 text-xs px-2 py-0.5 rounded border border-slate-200 font-mono">FIR: {selectedMatter.fir}</span>}
                  <span className="text-xs text-slate-500">| Practice: {selectedMatter.practice_area}</span>
                </div>
                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{selectedMatter.facts}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 self-end md:self-auto w-full md:w-auto justify-end">
                {selectedMatter.status.map(st => (
                  <span key={st} className="text-[10px] bg-white py-1 px-2 rounded border border-slate-200 text-slate-600 font-mono">
                    • {st}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. query panel */}
        <section id="query-interface-section" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase text-slate-800 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600 hover:rotate-12 transition duration-200" />
                Natural Language Strategic query console
              </h2>
              <p className="text-xs text-slate-400">Junior associate drafts naturally without selecting templates — our selector auto-classifies the practice area, document template, and court type.</p>
            </div>
            
            {/* Template Selector Badge Metrics */}
            {selectedMatter && (
              <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded p-2 self-start">
                <span className="text-slate-500">Selected Schema:</span>
                <span className="text-blue-700 uppercase font-bold">{selectedMatter.document_type}</span>
                <span className="text-slate-400">→</span>
                <span className="text-slate-700 uppercase font-bold">{selectedMatter.court_type}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="query-input"
                type="text"
                value={curQuery}
                onChange={(e) => setCurQuery(e.target.value)}
                placeholder="Type query: e.g. Rajesh Kumar Section 318 BNS anticipatory bail..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20 font-mono transition duration-150"
              />
              <span className="absolute right-3 top-3.5 text-[10px] text-slate-400 font-mono">India Legal Compiler</span>
            </div>
            <button
              id="draft-trigger-button"
              onClick={executeGeneration}
              disabled={loading || !curQuery}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer min-w-[200px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  Compelling 3 Levels...
                </>
              ) : (
                <>
                  Compute Draft Gap
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 text-xs flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* 4. Generation Core Screen (Symmetric side-by-side) */}
        {results ? (
          <div className="space-y-6">
            
            {/* Top normalizer alert and classification strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Selector classification status panel */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                <div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Automated template Classifier</h3>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-700">
                    <span>Practice:</span>
                    <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{results.classification.practice_area}</span>
                    <span className="text-slate-300">|</span>
                    <span>Document:</span>
                    <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{results.classification.document_type}</span>
                    <span className="text-slate-300">|</span>
                    <span>Target:</span>
                    <span className="text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{results.classification.court_type}</span>
                  </div>
                </div>
              </div>

              {/* Section Mappings Alert Strip */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                <div className={`h-10 w-10 rounded flex items-center justify-center border ${
                  results.alerts.replacements.length > 0 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Section Normalizer Compliance Alerts</h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">post-2024 active</span>
                  </div>
                  {results.alerts.replacements.length > 0 ? (
                    <p className="text-xs font-mono text-green-700 truncate">
                      ✓ Successfully resolved and mapped {results.alerts.replacements.length} old IPC/CrPC references to BNS/BNSS.
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 font-mono">No legacy Indian legal codes detected to normalize.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Side-by-side levels layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEVEL 1 CARD */}
              <div id="level-1-container" className="border border-slate-200 bg-white rounded-xl flex flex-col overflow-hidden shadow-sm">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase block font-bold">LAYER 1</span>
                    <h3 className="text-sm font-bold text-slate-600">Level 1: Generic AI</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Quality Score</span>
                    <span className="text-sm font-black text-red-500 font-mono">{results.level1.score.overall} / 5.0</span>
                  </div>
                </div>

                {/* Score Indicators Gauge */}
                <div className="p-3 bg-red-50/40 border-b border-slate-200/65 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-500">
                  <div>
                    <span className="block text-slate-400 text-[9px]">Relevance</span>
                    <span className="text-red-700 font-bold">{results.level1.score.relevance}</span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="block text-slate-400 text-[9px]">Accuracy</span>
                    <span className="text-red-700 font-bold">{results.level1.score.accuracy}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[9px]">Format</span>
                    <span className="text-red-700 font-bold">{results.level1.score.formatting}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  {/* Raw Output Block */}
                  <div className="bg-white p-4 rounded border border-slate-200 font-serif text-[11px] text-slate-500 whitespace-pre-wrap min-h-[350px] max-h-[350px] overflow-y-auto leading-relaxed">
                    {results.level1.content}
                  </div>

                  {/* Reasons details list */}
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Evaluator Assessments</h4>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {results.level1.score.explanations.map((exp, i) => (
                        <div key={i} className="text-xs text-slate-600 leading-relaxed font-sans bg-red-50/50 p-2 border border-red-100 rounded text-red-650 flex items-start gap-1">
                          <span>{exp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>


              {/* LEVEL 2 CARD */}
              <div id="level-2-container" className="border border-slate-200 bg-white rounded-xl flex flex-col overflow-hidden shadow-sm">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase block font-bold">LAYER 2</span>
                    <h3 className="text-sm font-bold text-slate-600">Level 2: Template Only</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold font-bold">Quality Score</span>
                    <span className="text-sm font-black text-orange-500 font-mono">{results.level2.score.overall} / 5.0</span>
                  </div>
                </div>

                {/* Score Indicators Gauge */}
                <div className="p-3 bg-amber-50/30 border-b border-slate-200/65 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-500">
                  <div>
                    <span className="block text-slate-400 text-[9px]">Relevance</span>
                    <span className="text-amber-700 font-bold">{results.level2.score.relevance}</span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="block text-slate-400 text-[9px]">Accuracy</span>
                    <span className="text-amber-700 font-bold">{results.level2.score.accuracy}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[9px]">Format</span>
                    <span className="text-amber-700 font-bold">{results.level2.score.formatting}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  {/* Template Output Block */}
                  <div className="bg-slate-50/30 p-4 rounded border border-slate-200 font-serif text-[11px] text-slate-700 whitespace-pre-wrap min-h-[350px] max-h-[350px] overflow-y-auto leading-relaxed">
                    {results.level2.content}
                  </div>

                  {/* Reasons details list */}
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Evaluator Assessments</h4>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {results.level2.score.explanations.map((exp, i) => (
                        <p key={i} className="text-xs text-slate-600 leading-relaxed font-sans">{exp}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>


              {/* LEVEL 3 CARD */}
              <div id="level-3-container" className="bg-white border-blue-100 ring-2 ring-blue-600 ring-inset shadow-2xl rounded-xl flex flex-col overflow-hidden relative">
                
                {/* Recommended pill badge */}
                <span className="absolute -top-2 right-4 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  RECOMMENDED
                </span>

                <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-blue-700 font-mono tracking-wider uppercase block font-bold">✓ LEVEL 3 — BRAHMO CHOSEN</span>
                    <h3 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
                      Level 3: Firm Knowledge
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-blue-800 block font-semibold">Quality Score</span>
                    <span className="text-sm font-black text-blue-700 font-mono">{results.level3.score.overall} / 5.0</span>
                  </div>
                </div>

                {/* Score Indicators Gauge */}
                <div className="p-3 bg-blue-100/30 border-b border-blue-100 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-600">
                  <div>
                    <span className="block text-blue-900 text-[9px]">Relevance</span>
                    <span className="text-blue-800 font-bold">{results.level3.score.relevance}</span>
                  </div>
                  <div className="border-x border-blue-100">
                    <span className="block text-blue-900 text-[9px]">Accuracy</span>
                    <span className="text-blue-800 font-bold">{results.level3.score.accuracy}</span>
                  </div>
                  <div>
                    <span className="block text-blue-900 text-[9px]">Format</span>
                    <span className="text-blue-800 font-bold">{results.level3.score.formatting}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  {/* Dynamic Custom Output Block */}
                  <div className="bg-white p-4 rounded border border-blue-100 font-serif text-[11px] text-slate-800 whitespace-pre-wrap min-h-[350px] max-h-[350px] overflow-y-auto leading-relaxed scrollbar-thin">
                    {results.level3.content}
                  </div>

                  {/* Reasons details list */}
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <h4 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest block mb-2">Evaluator Assessments</h4>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {results.level3.score.explanations.map((exp, i) => (
                        <p key={i} className="text-xs text-slate-700 leading-relaxed font-sans">{exp}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 5. Command Center Panel (Injected Nodes logs & precedents) */}
            <div id="injection-command-panel" className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-100 border border-slate-300 rounded-xl p-6 shadow-sm text-slate-800">
              
              {/* Token budget indicator and Injected Node Tags */}
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Bookmark className="h-4 w-4 text-blue-600" />
                    Knowledge Nodes Injected (Level 3)
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">(Level 3 Strategy)</span>
                </div>

                {/* Token Budget Meter bar */}
                <div className="space-y-1.5 p-3 rounded bg-white border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Token Budget</span>
                    <span className="text-blue-700 font-bold">{results.level3.tokenUsage.used} / {results.level3.tokenUsage.budget} tokens</span>
                  </div>
                  <div className="h-2 w-full bg-slate-150 rounded overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${Math.min(100, (results.level3.tokenUsage.used / results.level3.tokenUsage.budget) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-[9px] text-slate-400 text-right">
                    Priority allocation: Constraint (P1) &gt; Anti-Pattern (P2) &gt; Decision (P3)
                  </div>
                </div>

                {/* Nodes lists visualizer */}
                <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                  {results.level3.injectedNodes.length > 0 ? (
                    results.level3.injectedNodes.map(nodeId => {
                      const fullNode = nodes.find(n => n.id === nodeId);
                      if (!fullNode) return null;
                      return (
                        <div key={nodeId} className="p-2 bg-white border border-slate-250 rounded flex items-start gap-2.5 text-xs text-slate-700">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold text-center w-[75px] shrink-0 ${
                            fullNode.node_type === 'CONSTRAINT' 
                            ? 'bg-red-50 text-red-600 border border-red-100' 
                            : fullNode.node_type === 'ANTI_PATTERN' 
                            ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                            : 'bg-green-50 text-green-700 border border-green-100'
                          }`}>
                            {fullNode.id}
                          </span>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <span className="font-bold text-slate-800 block truncate">{fullNode.title}</span>
                            <p className="text-[10px] text-slate-500 leading-normal">{fullNode.content}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-400 italic">No nodes were selected or satisfied relevance criteria for this query.</p>
                  )}
                </div>
              </div>

              {/* Indian Kanoon Precedents display */}
              <div className="md:col-span-7 space-y-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Search className="h-4 w-4 text-blue-600" />
                    Indian Kanoon Research Results
                  </h4>
                  <span className="text-[10px] text-blue-600 font-bold">{results.level3.researchCases ? results.level3.researchCases.length : 0} Cases Matched</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {results.level3.researchCases && results.level3.researchCases.length > 0 ? (
                    results.level3.researchCases.map((cs, idx) => (
                      <div key={cs.docid || idx} className="p-3 bg-white border border-slate-200 hover:border-slate-300 rounded-lg space-y-1 text-xs text-slate-800">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <span className="font-bold text-blue-600 hover:underline cursor-pointer">{cs.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {cs.citation || "SCC Online Context"}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[10px] leading-normal">{cs.headline}</p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                          <span>Court: {cs.court || "Supreme Court of India"}</span>
                          <span>DocID: IK-{cs.docid}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No precedents found for current research query.</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Empty/Initial welcome state card */
          <div className="text-center p-12 bg-white border border-slate-200 rounded-xl space-y-4 max-w-2xl mx-auto flex flex-col items-center shadow-sm">
            <div className="h-16 w-16 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-105 text-blue-600 shadow-sm animate-pulse mb-2">
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">BRAHMO Legal Engine Is Idle</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select one of the preloaded matter dossiers above, or customize a legal query inside the terminal. Click <strong className="text-blue-600">Compute Draft Gap</strong> to see the exact quality difference between generic AI models and full firm knowledge injection.
              </p>
            </div>
            <button
              onClick={executeGeneration}
              className="mt-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs text-white flex items-center gap-2 cursor-pointer shadow"
            >
              Initialize Demo Matter 1
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        )}

      </main>

       {/* 6. Database / Unified Table Schema Modal Tab */}
      {showDatabaseTab && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-900 animate-in fade-in duration-250">
            
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-sans">Unified Schema & Knowledge Base Viewer</h3>
                  <p className="text-[10px] text-slate-500">ONE single table serves multiple practice areas and scales effortlessly to new disciplines (like Family or Property).</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDatabaseTab(false)}
                className="text-slate-500 hover:text-slate-800 font-mono text-xs hover:bg-slate-100 px-3 py-1.5 rounded border border-slate-200 cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>

            {/* Supabase Connection Console Banner */}
            <div className="bg-slate-900 text-white p-4 border-b border-slate-800 space-y-3.5 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold tracking-tight uppercase text-emerald-400 font-mono">Live Supabase Project: ldmrpspsurwoayjqxonh</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Connection: <code className="text-slate-300 font-mono select-all select-none">https://ldmrpspsurwoayjqxonh.supabase.co</code>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowSqlSetupInstructions(!showSqlSetupInstructions)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 cursor-pointer transition"
                  >
                    {showSqlSetupInstructions ? "Hide SQL Setup" : "Show SQL Setup"}
                  </button>
                  <button
                    onClick={handleSyncToSupabase}
                    disabled={syncLoading}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded cursor-pointer transition disabled:opacity-50 flex items-center gap-1"
                  >
                    {syncLoading ? (
                      <span className="animate-spin inline-block h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                    ) : null}
                    Seed/Sync Presets
                  </button>
                  <button
                    onClick={() => setShowAddNodeModal(true)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded cursor-pointer transition mt-0.5 sm:mt-0"
                  >
                    + Add Knowledge Node
                  </button>
                </div>
              </div>

              {/* Display SQL instructions */}
              {showSqlSetupInstructions && (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 max-h-[160px] overflow-y-auto">
                  <p className="text-[10px] text-amber-350 leading-relaxed">
                    💡 <strong>Setup Instructions:</strong> Copy and run this DDL SQL in your <strong>Supabase SQL Editor</strong> to boot the schema tables. Once run, click <strong>"Seed/Sync Presets"</strong> to populate your PostgreSQL database instantly!
                  </p>
                  <pre className="text-[9px] font-mono select-all bg-slate-900 border border-slate-800 text-slate-350 p-2 rounded block leading-normal whitespace-pre">
{`CREATE TABLE IF NOT EXISTS knowledge_nodes (
  id TEXT PRIMARY KEY,
  node_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  practice_area TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  client_id TEXT,
  matter_id TEXT
);

CREATE TABLE IF NOT EXISTS matters (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  practice_area TEXT NOT NULL,
  document_type TEXT NOT NULL,
  court_type TEXT NOT NULL,
  court_name TEXT NOT NULL,
  charge TEXT,
  fir TEXT,
  facts TEXT NOT NULL,
  client_id TEXT NOT NULL,
  status TEXT[] NOT NULL,
  custom_query TEXT
);

CREATE TABLE IF NOT EXISTS legal_templates (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  practice_area TEXT NOT NULL,
  document_type TEXT NOT NULL,
  court_type TEXT NOT NULL,
  display_name TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  auto_research_query TEXT NOT NULL,
  quality_checks TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS section_mappings (
  old_section TEXT PRIMARY KEY,
  new_section TEXT NOT NULL,
  old_act TEXT NOT NULL,
  new_act TEXT NOT NULL
);`}
                  </pre>
                </div>
              )}

              {/* Display Sync Result */}
              {syncResult && (
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[10px] space-y-1.5 font-mono">
                  {syncResult.error ? (
                    <p className="text-red-400">Error: {syncResult.error}</p>
                  ) : (
                    <>
                      <p className="text-emerald-400 font-bold">✓ Presets Synced successfully!</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                        <div>Nodes: {syncResult.results?.knowledge_nodes?.success ? `✓ ${syncResult.results.knowledge_nodes.count}` : `❌ Failed`}</div>
                        <div>Matters: {syncResult.results?.matters?.success ? `✓ ${syncResult.results.matters.count}` : `❌ Failed`}</div>
                        <div>Templates: {syncResult.results?.legal_templates?.success ? `✓ ${syncResult.results.legal_templates.count}` : `❌ Failed`}</div>
                        <div>Mappings: {syncResult.results?.section_mappings?.success ? `✓ ${syncResult.results.section_mappings.count}` : `❌ Failed`}</div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Display active table status check */}
              {supabaseStatus && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 border-t border-slate-800 pt-2 font-mono">
                  <span>Tables verification:</span>
                  <span className={supabaseStatus.tables.knowledge_nodes ? "text-emerald-400" : "text-amber-400"}>
                    ● knowledge_nodes ({supabaseStatus.tables.knowledge_nodes ? "Detected" : "Setup Required"})
                  </span>
                  <span className={supabaseStatus.tables.matters ? "text-emerald-400" : "text-amber-400"}>
                    ● matters ({supabaseStatus.tables.matters ? "Detected" : "Setup Required"})
                  </span>
                  <span className={supabaseStatus.tables.legal_templates ? "text-emerald-400" : "text-amber-400"}>
                    ● legal_templates ({supabaseStatus.tables.legal_templates ? "Detected" : "Setup Required"})
                  </span>
                  <span className={supabaseStatus.tables.section_mappings ? "text-emerald-400" : "text-amber-400"}>
                    ● section_mappings ({supabaseStatus.tables.section_mappings ? "Detected" : "Setup Required"})
                  </span>
                </div>
              )}
            </div>

            {/* SQL Terminal Console */}
            <div className="p-4 bg-slate-100 border-b border-slate-200 space-y-2 font-sans">
              <label className="text-[10px] font-mono uppercase tracking-wider text-blue-800 font-bold block">Execute Database Filter query (Unified table proof)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={sqlQuery} 
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="SELECT * FROM knowledge_nodes WHERE practice_area='criminal';"
                  className="flex-1 bg-white text-slate-800 font-mono text-xs rounded border border-slate-350 px-3 py-2 outline-none focus:border-blue-500"
                />
                <button 
                  onClick={runFilterSQL}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono py-2 px-4 rounded-lg flex items-center gap-1.5 shadow cursor-pointer"
                >
                  Run Query
                </button>
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                Supports filtering: <span className="text-slate-650 font-bold">WHERE practice_area='criminal'</span>, <span className="text-slate-650 font-bold">WHERE practice_area='corporate'</span>, <span className="text-slate-650 font-bold">WHERE node_type='constraint'</span>
              </div>
            </div>

            {/* Table layout of returned query */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
              <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-mono">Table: <strong className="text-slate-800 font-sans">knowledge_nodes</strong></span>
                <span className="text-slate-500 font-mono">{filteredNodes.length} records returned</span>
              </div>

              <div className="space-y-3">
                {filteredNodes.map(nd => (
                  <div key={nd.id} className="p-3 bg-white hover:bg-slate-50/50 rounded-lg border border-slate-200 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs select-all font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-105">{nd.id}</span>
                        <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">{nd.node_type}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-800 font-semibold">{nd.title}</span>
                      </div>
                      <p className="text-xs text-slate-650 leading-relaxed">{nd.content}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0 text-right font-mono">
                      <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-105 px-1.5 py-0.5 rounded uppercase">{nd.practice_area}</span>
                      <span className="text-[9px] text-slate-400 truncate max-w-[120px]">{nd.tags.join(", ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* showAddNodeModal Form */}
      {showAddNodeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCustomNode} className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Add Custom Knowledge Node</h3>
              <button type="button" onClick={() => setShowAddNodeModal(false)} className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer">✕</button>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Node identifier (ID) *</label>
                  <input type="text" value={newNodeId} onChange={e => setNewNodeId(e.target.value)} placeholder="e.g. C-010, D-005" className="w-full text-xs p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Node Type *</label>
                  <select value={newNodeType} onChange={e => setNewNodeType(e.target.value as any)} className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none">
                    <option value="CONSTRAINT">CONSTRAINT</option>
                    <option value="ANTI_PATTERN">ANTI_PATTERN</option>
                    <option value="DECISION">DECISION</option>
                    <option value="CLIENT_FACT">CLIENT_FACT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input type="text" value={newNodeTitle} onChange={e => setNewNodeTitle(e.target.value)} placeholder="e.g. Investigation Cooperation Rule" className="w-full text-xs p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content / Rule Text *</label>
                <textarea rows={3} value={newNodeContent} onChange={e => setNewNodeContent(e.target.value)} placeholder="Enter the exact strategy snippet or rule..." className="w-full text-xs p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Practice Area *</label>
                  <select value={newNodePractice} onChange={e => setNewNodePractice(e.target.value as any)} className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none">
                    <option value="criminal">criminal</option>
                    <option value="corporate">corporate</option>
                    <option value="family">family</option>
                    <option value="property">property</option>
                    <option value="general">general</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma separated)</label>
                  <input type="text" value={newNodeTags} onChange={e => setNewNodeTags(e.target.value)} placeholder="bail, cooperation, highcourt" className="w-full text-xs p-2 border border-slate-300 rounded focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button type="button" onClick={() => setShowAddNodeModal(false)} className="px-3 py-1.5 border border-slate-350 text-xs font-semibold rounded hover:bg-slate-100 cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded cursor-pointer shadow">Save Node</button>
            </div>
          </form>
        </div>
      )}

      {/* showAddMatterModal Form */}
      {showAddMatterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCustomMatter} className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold font-sans">Add Custom Matter Dossier</h3>
              <button type="button" onClick={() => setShowAddMatterModal(false)} className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer">✕</button>
            </div>
            <div className="p-4 space-y-3.5 text-sm max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Matter ID *</label>
                  <input type="text" value={newMatterId} onChange={e => setNewMatterId(e.target.value)} placeholder="e.g. matter_007" className="w-full text-xs p-2 border border-slate-300 rounded outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Name *</label>
                  <input type="text" value={newMatterClient} onChange={e => setNewMatterClient(e.target.value)} placeholder="e.g. Amit Sen" className="w-full text-xs p-2 border border-slate-300 rounded outline-none" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Matter Title *</label>
                <input type="text" value={newMatterTitle} onChange={e => setNewMatterTitle(e.target.value)} placeholder="e.g. FIR Quashing Prosecution overlap" className="w-full text-xs p-2 border border-slate-300 rounded outline-none" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Practice Area *</label>
                  <select value={newMatterPractice} onChange={e => setNewMatterPractice(e.target.value as any)} className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none">
                    <option value="criminal">criminal</option>
                    <option value="corporate">corporate</option>
                    <option value="overlap">overlap</option>
                    <option value="family">family</option>
                    <option value="property">property</option>
                    <option value="general">general</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Type *</label>
                  <select value={newMatterDocType} onChange={e => setNewMatterDocType(e.target.value as any)} className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none">
                    <option value="anticipatory_bail">Anticipatory Bail</option>
                    <option value="fir_quashing">FIR Quashing</option>
                    <option value="nda_review">NDA Review</option>
                    <option value="nclt_petition">NCLT Petition</option>
                    <option value="general">General Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Court Type *</label>
                  <select value={newMatterCourtType} onChange={e => setNewMatterCourtType(e.target.value as any)} className="w-full text-xs p-2 border border-slate-300 rounded bg-white outline-none">
                    <option value="high_court">High Court</option>
                    <option value="sessions_court">Sessions Court</option>
                    <option value="tribunal">Tribunal</option>
                    <option value="na">N/A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Court Name</label>
                  <input type="text" value={newMatterCourtName} onChange={e => setNewMatterCourtName(e.target.value)} placeholder="e.g. Delhi High Court" className="w-full text-xs p-2 border border-slate-300 rounded outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Charge / Clause</label>
                  <input type="text" value={newMatterCharge} onChange={e => setNewMatterCharge(e.target.value)} placeholder="e.g. Section 318 BNS" className="w-full text-xs p-2 border border-slate-300 rounded outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">FIR / Contract ID</label>
                  <input type="text" value={newMatterFir} onChange={e => setNewMatterFir(e.target.value)} placeholder="e.g. 190/2026" className="w-full text-xs p-2 border border-slate-300 rounded outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Case Facts / Brief Details *</label>
                <textarea rows={4} value={newMatterFacts} onChange={e => setNewMatterFacts(e.target.value)} placeholder="Enter the detailed legal facts, history, or dispute details..." className="w-full text-xs p-2 border border-slate-300 rounded outline-none" required />
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5 font-sans">
              <button type="button" onClick={() => setShowAddMatterModal(false)} className="px-3 py-1.5 border border-slate-350 text-xs font-semibold rounded hover:bg-slate-100 cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded cursor-pointer shadow">Create Docket</button>
            </div>
          </form>
        </div>
      )}

      {/* 7. Case Sources view panel Modal */}
      {showDocSources && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-900">
            
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">Sourced Citations & Verification Log (case_sources.md)</h3>
              </div>
              <button 
                onClick={() => setShowDocSources(false)}
                className="text-slate-500 hover:text-slate-800 text-xs hover:bg-slate-100 px-3 py-1.5 rounded border border-slate-200 font-mono cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-xs text-slate-700 leading-relaxed">
              <p className="text-[11px] text-slate-400 uppercase font-mono tracking-wider border-b border-slate-200 pb-2">Verified Sourcing Docket</p>
              
              <div className="bg-slate-50 p-4 rounded border border-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                {sourcesMd}
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-3">
                <h4 className="text-xs font-bold text-slate-800">Post-2024 Compliance Mappings Applied (gazette 2023)</h4>
                <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto font-mono text-[10px] text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                  {mappings.slice(0, 15).map(m => (
                    <div key={m.old_section} className="flex justify-between border-b border-slate-200/50 pb-1">
                      <span>{m.old_section} ({m.old_act})</span>
                      <span className="text-emerald-700 font-bold">→ {m.new_section} ({m.new_act})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer copyright strip */}
      <footer className="border-t border-slate-200 p-4 bg-slate-900 text-center text-slate-400 text-xs mt-12">
        &copy; {new Date().getFullYear()} BRAHMO Systems India. All legal metrics are verified and secured server-side.
      </footer>

    </div>
  );
}
