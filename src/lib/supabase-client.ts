import { createClient } from "@supabase/supabase-js";

// Retrieve URL and Key from process.env, with absolute default parameters to match the user's project
const supabaseUrl = process.env.SUPABASE_URL || "https://ldmrpspsurwoayjqxonh.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_outL_8IKp2zp4slJLZmuEw_asUH8FVb";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

/**
 * Check if the Supabase tables are ready and populated.
 * Returns information about table states and errors.
 */
export async function getSupabaseStatus() {
  const status = {
    connected: false,
    tables: {
      knowledge_nodes: false,
      matters: false,
      legal_templates: false,
      section_mappings: false,
    },
    error: null as string | null,
    projectUrl: supabaseUrl,
  };

  try {
    // Attempt simple queries to see if tables exist and are accessible
    const results = await Promise.allSettled([
      supabase.from("knowledge_nodes").select("id").limit(1),
      supabase.from("matters").select("id").limit(1),
      supabase.from("legal_templates").select("id").limit(1),
      supabase.from("section_mappings").select("old_section").limit(1)
    ]);

    status.connected = true;
    
    // Check knowledge_nodes
    if (results[0].status === "fulfilled" && !results[0].value.error) {
      status.tables.knowledge_nodes = true;
    }
    // Check matters
    if (results[1].status === "fulfilled" && !results[1].value.error) {
      status.tables.matters = true;
    }
    // Check legal_templates
    if (results[2].status === "fulfilled" && !results[2].value.error) {
      status.tables.legal_templates = true;
    }
    // Check section_mappings
    if (results[3].status === "fulfilled" && !results[3].value.error) {
      status.tables.section_mappings = true;
    }
  } catch (err: any) {
    status.error = err.message || "Could not reach Supabase endpoint.";
  }

  return status;
}
