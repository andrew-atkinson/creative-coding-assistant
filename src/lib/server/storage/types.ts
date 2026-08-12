// Storage adapter contract. Two backends today (static-webhook, supabase);
// pluggable so we can add neon.tech / Netlify Blobs / SQLite later without
// touching consumers.

export type Course = {
  id: string;
  slug: string;
  title: string;
  theme_color: string | null;
  status: 'draft' | 'published';
  monthly_request_budget: number;
};

export type FeedbackRow = {
  course_id: string;
  question: string;
  category: 'unknown' | 'flagged';
  session_id?: string | null;
};

export type UsageRow = {
  course_id: string;
  kind: 'chat_request';
  provider: string;
  input_tokens: number | null;
  output_tokens: number | null;
};

export interface StorageAdapter {
  loadCourse(slug: string): Promise<Course | null>;
  saveFeedback(row: FeedbackRow): Promise<void>;
  saveUsage(row: UsageRow): Promise<void>;
  // Used for the per-course monthly budget check. Adapters without
  // persistence (static-webhook) return 0 — the IP rate limit in the
  // chat endpoint still applies.
  currentMonthChatCount(courseId: string): Promise<number>;
}
