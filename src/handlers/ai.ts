import { FunctionHandler } from '../Handler';
import { callModel } from '../llm';
import { AI_SEARCH_SYSTEM, AI_SYSTEM } from '../prompts';
import { redirect } from '../util';
import { BraveSearchError, searchBrave } from '../brave';

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

async function selectFromSearch(query: string): Promise<string | null> {
  const results = await searchBrave(query, 5);
  if (results.length === 0) return null;

  const list = results
    .map((r, i) => `${i + 1}. [${r.title}](${r.url})\n   ${r.description}`)
    .join('\n');

  const response = await callModel([
    { role: 'system', content: AI_SEARCH_SYSTEM },
    { role: 'user', content: `Query: ${query}\n\nSearch results:\n${list}` },
  ]);
  return extractUrl(response);
}

const aiHandler = new FunctionHandler(
  'asks an LLM for the best destination URL for your query',
  async (tokens) => {
    if (tokens.length === 0) {
      return redirect('https://duckduckgo.com');
    }
    const query = tokens.join(' ');

    // Grounded path: real URLs from Brave → LLM selects best
    try {
      const url = await selectFromSearch(query);
      if (url) return redirect(url);
    } catch (e) {
      if (!(e instanceof BraveSearchError)) throw e;
      // Brave unavailable → fall through to LLM-only
    }

    // Fallback: LLM generates URL from memory (original behavior)
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
