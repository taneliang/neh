export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const DEFAULT_MODEL = 'google/gemini-3.1-flash-lite-preview';

export class LLMError extends Error {}

export async function callModel(
  messages: LLMMessage[],
  model: string = DEFAULT_MODEL,
): Promise<string> {
  const apiKey = (globalThis as unknown as { OPENROUTER_API_KEY?: string }).OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new LLMError('OPENROUTER_API_KEY is not configured');
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://neh.eltan.net',
      'X-Title': 'neh',
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new LLMError(`OpenRouter returned ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new LLMError('OpenRouter returned no content');
  }
  return content;
}
