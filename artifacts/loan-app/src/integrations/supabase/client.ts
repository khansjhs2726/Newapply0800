import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iqnkxmipbrpqfnwqcvgg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxbmt4bWlwYnJwcWZud3FjdmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTc2NjQsImV4cCI6MjA5NDU5MzY2NH0.qMbfgnKxks8iNZIDCEzgpkHN1Y6L5FBAjxyohJIc7A0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
