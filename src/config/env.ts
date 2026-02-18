// ─── Environment Configuration ──────────────────────────────────────────────
// These are the SAME credentials used by the website (best-travel-plan.cloud)
// Both the website and the app share the same Supabase backend and API

export const ENV = {
  // Supabase — shared with website
  SUPABASE_URL: 'https://wpadifvbkmgnbwztcfli.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwYWRpZnZia21nbmJ3enRjZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTQwNTIsImV4cCI6MjA4MjA3MDA1Mn0.J3ndpW1qTX53DgnfSH9cGsTwpNlP8vhOPM27IenSRwM',

  // Website API — same backend the website calls
  API_URL: 'https://www.best-travel-plan.cloud/api',

  // Website URL
  WEBSITE_URL: 'https://www.best-travel-plan.cloud',
};
