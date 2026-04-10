-- Migration: enable RLS on kv_store_b9f46b68
--
-- Security posture:
--   - The edge function (server/index.tsx) accesses this table using the
--     SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS by design.
--   - No SELECT/INSERT/UPDATE/DELETE policy is granted to the anon or
--     authenticated roles. Direct client access is denied.
--   - All reads and writes must go through the edge function.
--
-- Apply via: supabase db push  OR  paste into Supabase SQL editor.

ALTER TABLE public.kv_store_b9f46b68 ENABLE ROW LEVEL SECURITY;

-- Explicitly confirm no anon policies exist (this is a no-op if they
-- don't exist; included for auditability).
DROP POLICY IF EXISTS "anon read"   ON public.kv_store_b9f46b68;
DROP POLICY IF EXISTS "anon insert" ON public.kv_store_b9f46b68;
DROP POLICY IF EXISTS "anon update" ON public.kv_store_b9f46b68;
DROP POLICY IF EXISTS "anon delete" ON public.kv_store_b9f46b68;
