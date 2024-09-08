import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpoxdegyaqolyqoqnact.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb3hkZWd5YXFvbHlxb3FuYWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxODA4NjAsImV4cCI6MjAzOTc1Njg2MH0.H6n0kFNBZMoG0GxoO_gaYy3MJf58JAgxewOcmPSFxA0'


export const supabase = createClient(supabaseUrl, supabaseKey)
