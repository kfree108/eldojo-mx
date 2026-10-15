// Server-side progress: ON since 2026-10-15 (Ken's go). Jessica's WhatsApp link carries ?u=<token>; the token
// exists only if Jessica created it (bot.intake), so a page without one keeps progress on the phone (+ ?r= link).
// The anon key is public by design; the only thing it can reach is public.course_progress_sync, which ignores unknown tokens.
window.ACADEMIA_CONFIG = { supabaseUrl: 'https://yzlfhvacjukrlhalqwbc.supabase.co', anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGZodmFjanVrcmxoYWxxd2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTgxNDcsImV4cCI6MjEwMjczNDE0N30.mt6BTqLTbktOECFaoNpJiiehK2F64m34gcq18p_EKXg' };
