// Static-webhook backend.
//
// Reads: course config from data/course.json, committed to the repo and
//   bundled into the build by Vite. No DB, no runtime lookup.
// Writes: feedback rows sent via one of two destinations, chosen by
//   FEEDBACK_MODE:
//     - "email"   → POST to Resend's transactional email API.
//     - "webhook" (default) → POST Discord-shaped JSON to a webhook URL
//                             (Discord/Slack/any generic HTTPS endpoint).
//   Usage events are dropped — meter with IP rate limits in the chat endpoint.
//
// If the mode's env vars aren't fully configured, feedback is silently
// discarded so the chat response never fails on a missing config.

import courseJson from '../../../../data/course.json';
import type { StorageAdapter, Course, FeedbackRow, UsageRow } from './types';

type CourseJsonShape = {
  course: {
    slug: string;
    title: string;
    theme_color?: string | null;
    status: 'draft' | 'published';
    monthly_request_budget?: number;
  };
};

const config = courseJson as CourseJsonShape;

// Bake a { slug: Course } map at module load. Multi-course support later will
// swap this for a courses.json indexed by slug.
const courses: Record<string, Course> = {
  [config.course.slug]: {
    id: config.course.slug,
    slug: config.course.slug,
    title: config.course.title,
    theme_color: config.course.theme_color ?? null,
    status: config.course.status,
    monthly_request_budget: config.course.monthly_request_budget ?? 10_000
  }
};

export class StaticWebhookAdapter implements StorageAdapter {
  constructor(private env: Record<string, string | undefined>) {}

  async loadCourse(slug: string): Promise<Course | null> {
    return courses[slug] ?? null;
  }

  async saveFeedback(row: FeedbackRow): Promise<void> {
    const mode = (this.env.FEEDBACK_MODE ?? 'webhook').toLowerCase();
    if (mode === 'email') {
      await this.sendEmail(row);
    } else if (mode === 'webhook') {
      await this.sendWebhook(row);
    }
    // Unknown mode → silent drop; never surface to the student.
  }

  private async sendWebhook(row: FeedbackRow): Promise<void> {
    const url = this.env.FEEDBACK_WEBHOOK_URL;
    if (!url) return;
    const content = [
      `**[${row.category}]** on \`${row.course_id}\``,
      `> ${row.question.replace(/\n/g, ' ')}`,
      row.session_id ? `session: \`${row.session_id}\`` : null
    ]
      .filter(Boolean)
      .join('\n');
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content })
      });
    } catch {
      // Never surface a delivery failure to the student.
    }
  }

  private async sendEmail(row: FeedbackRow): Promise<void> {
    const apiKey = this.env.RESEND_API_KEY;
    const to = this.env.FEEDBACK_EMAIL_TO;
    const from = this.env.FEEDBACK_EMAIL_FROM;
    if (!apiKey || !to || !from) return;
    const subject = `[TutorGen] ${row.category} — ${row.course_id}`;
    const bodyLines = [
      `Category: ${row.category}`,
      `Course: ${row.course_id}`,
      row.session_id ? `Session: ${row.session_id}` : null,
      '',
      `Question:`,
      row.question
    ].filter((v): v is string => v !== null);
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text: bodyLines.join('\n')
        })
      });
    } catch {
      // Never surface a delivery failure to the student.
    }
  }

  async saveUsage(_row: UsageRow): Promise<void> {
    // No persistence in this backend. Chat endpoint's IP rate limit is the
    // only safeguard.
  }

  async currentMonthChatCount(_courseId: string): Promise<number> {
    return 0;
  }
}
