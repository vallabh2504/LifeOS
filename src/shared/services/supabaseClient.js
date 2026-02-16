import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wsephuevueqrpxhditjp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzZXBodWV2dWVxcnB4aGRpdGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0ODM1MzEsImV4cCI6MjA4MzA1OTUzMX0.rvX_ZXx-cRC4lAwLaWPoPxbYlDSZnU1Idxt8Fn9zmkY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
