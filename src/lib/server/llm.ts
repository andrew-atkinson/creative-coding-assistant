// Thin OpenAI-compatible chat client. Works against LM Studio (local),
// Groq, OpenRouter, or any endpoint that speaks OpenAI's chat/completions
// shape. Configured entirely via env — same code, different LLM_BASE_URL.

import OpenAI from 'openai';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

let cached: OpenAI | null = null;

function client(env: Record<string, string | undefined>): OpenAI {
  if (cached) return cached;
  const baseURL = env.LLM_BASE_URL;
  const apiKey = env.LLM_API_KEY;
  if (!baseURL) throw new Error('LLM_BASE_URL not set');
  cached = new OpenAI({ baseURL, apiKey: apiKey ?? 'unused' });
  return cached;
}

// Non-streaming call. Used by the router for structured JSON output.
export async function complete(
  env: Record<string, string | undefined>,
  messages: ChatMessage[],
  options: { model?: string; temperature?: number; max_tokens?: number } = {}
): Promise<string> {
  const openai = client(env);
  const model = options.model ?? env.LLM_MODEL;
  if (!model) throw new Error('LLM_MODEL not set and no model override');
  const res = await openai.chat.completions.create({
    model,
    messages,
    temperature: options.temperature ?? 0.1,
    max_tokens: options.max_tokens ?? 512
  });
  return res.choices[0]?.message?.content ?? '';
}

// Streaming call. Yields plain text deltas. Used by the chat endpoint.
export async function* stream(
  env: Record<string, string | undefined>,
  messages: ChatMessage[],
  options: { model?: string; temperature?: number; max_tokens?: number } = {}
): AsyncGenerator<string> {
  const openai = client(env);
  const model = options.model ?? env.LLM_MODEL;
  if (!model) throw new Error('LLM_MODEL not set and no model override');
  const s = await openai.chat.completions.create({
    model,
    messages,
    temperature: options.temperature ?? 0.4,
    max_tokens: options.max_tokens ?? 2048,
    stream: true
  });
  for await (const chunk of s) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
