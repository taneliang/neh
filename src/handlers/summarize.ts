import { FunctionHandler, Handler } from '../Handler';
import { fetchAsMarkdown } from '../jina';
import { callModel } from '../llm';
import { renderErrorPage, renderResultPage } from '../resultPage';

function normalizeUrl(input: string): string | null {
  const candidate = input.match(/^[a-z][a-z0-9+\-.]*:\/\//i) ? input : `https://${input}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function makeSummarizer(
  command: string,
  docstring: string,
  label: string,
  systemPrompt: string,
): Handler {
  return new FunctionHandler(docstring, async (tokens) => {
    if (tokens.length === 0) {
      return renderErrorPage(
        command,
        `Provide a URL. Example: ${command} https://en.wikipedia.org/wiki/Sourdough`,
        400,
      );
    }
    const url = normalizeUrl(tokens[0]);
    if (!url) {
      return renderErrorPage(command, `Not a valid URL: ${tokens[0]}`, 400);
    }
    try {
      const markdown = await fetchAsMarkdown(url);
      const summary = await callModel([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: markdown },
      ]);
      return renderResultPage(label, summary, url);
    } catch (err) {
      return renderErrorPage(command, (err as Error).message);
    }
  });
}
