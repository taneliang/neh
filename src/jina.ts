const JINA_BASE = 'https://r.jina.ai/';

export class JinaError extends Error {}

export async function fetchAsMarkdown(targetUrl: string): Promise<string> {
  const response = await fetch(`${JINA_BASE}${targetUrl}`, {
    headers: { Accept: 'text/plain' },
  });
  if (!response.ok) {
    throw new JinaError(`Jina Reader returned ${response.status} for ${targetUrl}`);
  }
  return await response.text();
}
