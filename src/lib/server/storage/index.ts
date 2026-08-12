// Storage factory. Selects a backend from STORAGE_BACKEND env var.
// Default: static-webhook (course from committed JSON, feedback POSTed to a
// webhook URL, no DB). Set STORAGE_BACKEND=supabase to use the Postgres path.

import type { StorageAdapter } from './types';
import { StaticWebhookAdapter } from './static-webhook';
import { SupabaseAdapter } from './supabase';

let cached: StorageAdapter | null = null;

export function getStorage(env: Record<string, string | undefined>): StorageAdapter {
  if (cached) return cached;
  const backend = env.STORAGE_BACKEND ?? 'static-webhook';
  switch (backend) {
    case 'supabase':
      cached = new SupabaseAdapter(env);
      break;
    case 'static-webhook':
      cached = new StaticWebhookAdapter(env);
      break;
    default:
      throw new Error(
        `Unknown STORAGE_BACKEND "${backend}". Expected "static-webhook" or "supabase".`
      );
  }
  return cached;
}

// Test/dev helper: reset the cached instance so a new env can be picked up.
export function _resetStorageForTesting(): void {
  cached = null;
}

export type { StorageAdapter, Course, FeedbackRow, UsageRow } from './types';
