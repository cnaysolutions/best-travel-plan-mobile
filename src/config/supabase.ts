import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wpadifvbkmgnbwztcfli.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwYWRpZnZia21nbmJ3enRjZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMDA3NzYsImV4cCI6MjA1MDU3Njc3Nn0.o3DZuEPJlq98kqDj-oPEyWpfMJJZ5BNMFTgzKdYnAGQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
