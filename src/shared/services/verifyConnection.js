// Supabase Connection Verification Utility
// Run this in browser console to verify your database connection

import { supabase } from './supabaseClient';

export const verifySupabaseConnection = async () => {
  console.log('🔍 Testing Supabase Connection...');
  
  const results = {
    connection: false,
    tables: {},
    errors: []
  };

  // Test 1: Check auth connection
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      results.errors.push(`Auth Error: ${authError.message}`);
      console.log('⚠️ Auth not authenticated (this is OK if you just want to test DB)');
    } else if (user) {
      console.log(`✅ Auth: Connected as ${user.email}`);
      results.connection = true;
    } else {
      console.log('⚠️ No user logged in');
    }
  } catch (e) {
    results.errors.push(`Auth Check Failed: ${e.message}`);
  }

  // Test 2: Check tables exist by querying them
  const tablesToCheck = [
    'personal_tasks',
    'dev_categories',
    'dev_projects', 
    'dev_tasks',
    'dev_notes',
    'dev_doubts',
    'habits',
    'habit_logs',
    'expenses',
    'journal_entries'
  ];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error) {
        results.tables[table] = { exists: false, error: error.message };
        console.log(`❌ Table '${table}': ${error.message}`);
      } else {
        results.tables[table] = { exists: true, error: null };
        console.log(`✅ Table '${table}': Exists`);
      }
    } catch (e) {
      results.tables[table] = { exists: false, error: e.message };
      console.log(`❌ Table '${table}': ${e.message}`);
    }
  }

  // Summary
  const existingTables = Object.values(results.tables).filter(t => t.exists).length;
  console.log('\n📊 Summary:');
  console.log(`   Tables found: ${existingTables}/${tablesToCheck.length}`);
  
  if (existingTables === tablesToCheck.length) {
    console.log('🎉 All tables exist! Database is properly configured.');
  } else {
    console.log('⚠️ Some tables are missing. Please run the SQL schema in your Supabase dashboard.');
  }

  return results;
};

// Export for use in console
if (typeof window !== 'undefined') {
  window.verifySupabaseConnection = verifySupabaseConnection;
}
