import { FunctionHandler, Token } from '../Handler';
import { fetchAsMarkdown } from '../jina';
import { callModel } from '../llm';
import { renderErrorPage, renderResultPage } from '../resultPage';
import { redirect } from '../util';

function splitAtUrl(query: string): { prompt: string; url: string } | null {
  const match = query.match(/(https?:\/\/\S+)/);
  if (!match) return null;
  const urlStart = query.indexOf(match[1]);
  return { prompt: query.slice(0, urlStart).trim(), url: match[1] };
}

const customPromptHandler = new FunctionHandler(
  'applies a custom prompt to a URL, e.g. "the table in markdown https://example.com"',
  async (tokens: Token[]) => {
    const query = tokens.join(' ');
    const parts = splitAtUrl(query);

    if (!parts || !parts.prompt) {
      return redirect(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`);
    }

    const { prompt, url } = parts;

    try {
      new URL(url);
    } catch {
      return renderErrorPage('custom', `Not a valid URL: ${url}`, 400);
    }

    try {
      const markdown = await fetchAsMarkdown(url);
      const result = await callModel([
        { role: 'system', content: prompt },
        { role: 'user', content: markdown },
      ]);
      return renderResultPage(prompt, result, url);
    } catch (err) {
      return renderErrorPage('custom', (err as Error).message);
    }
  },
);

export default customPromptHandler;
