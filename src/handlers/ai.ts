import { FunctionHandler } from '../Handler';
import { callModel } from '../llm';
import { AI_SYSTEM } from '../prompts';
import { redirect } from '../util';

function ddgFor(query: string): string {
  return `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
}

function extractUrl(raw: string): string | null {
  const trimmed = raw.trim().replace(/^[`"'<]|[`"'>]$/g, '');
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

const aiHandler = new FunctionHandler(
  'asks an LLM for the best destination URL for your query',
  async (tokens) => {
    if (tokens.length === 0) {
      return redirect('https://duckduckgo.com');
    }
    const query = tokens.join(' ');
    try {
      const response = await callModel([
        { role: 'system', content: AI_SYSTEM },
        { role: 'user', content: query },
      ]);
      const destination = extractUrl(response);
      return redirect(destination ?? ddgFor(query));
    } catch {
      return redirect(ddgFor(query));
    }
  },
);

export default aiHandler;
