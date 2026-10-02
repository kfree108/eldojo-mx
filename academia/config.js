// Server-side progress (optional). Empty = progress lives only on the person's phone (+ the ?r= restore link).
// To turn it on: apply eldojo-whatsapp-agent/supabase/bot_course_progress.sql (Ken's go), then fill these two values.
// The anon key is public by design; the only thing it can reach is public.course_progress_sync, which ignores unknown tokens.
window.ACADEMIA_CONFIG = { supabaseUrl: '', anonKey: '' };
