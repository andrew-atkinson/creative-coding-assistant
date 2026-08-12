// Supabase (Postgres) backend. Preserves the pre-adapter behaviour of the
// chat endpoint exactly: same tables, same columns, same queries.

import { getServerSupabase } from '../supabase';
import type { StorageAdapter, Course, FeedbackRow, UsageRow } from './types';

export class SupabaseAdapter implements StorageAdapter {
  constructor(private env: Record<string, string | undefined>) {}

  private client() {
    return getServerSupabase(this.env);
  }

  async loadCourse(slug: string): Promise<Course | null> {
    const { data, error } = await this.client()
      .from('courses')
      .select('id, slug, title, theme_color, status, monthly_request_budget')
      .eq('slug', slug)
      .single();
    if (error || !data) return null;
    return {
      id: data.id as string,
      slug: data.slug as string,
      title: data.title as string,
      theme_color: (data.theme_color as string | null) ?? null,
      status: data.status as 'draft' | 'published',
      monthly_request_budget: data.monthly_request_budget as number
    };
  }

  async saveFeedback(row: FeedbackRow): Promise<void> {
    await this.client()
      .from('feedback')
      .insert({
        course_id: row.course_id,
        question: row.question,
        category: row.category,
        session_id: row.session_id ?? null
      });
  }

  async saveUsage(row: UsageRow): Promise<void> {
    await this.client().from('usage_events').insert({
      course_id: row.course_id,
      kind: row.kind,
      provider: row.provider,
      input_tokens: row.input_tokens,
      output_tokens: row.output_tokens
    });
  }

  async currentMonthChatCount(courseId: string): Promise<number> {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const { count } = await this.client()
      .from('usage_events')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)
      .eq('kind', 'chat_request')
      .gte('occurred_at', monthStart.toISOString());
    return count ?? 0;
  }
}
