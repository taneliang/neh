const JINA_BASE = 'https://r.jina.ai/';

export class JinaError extends Error {}

export async function fetchAsMarkdown(targetUrl: string): Promise<string> {
  const apiKey = (globalThis as unknown as { JINA_API_KEY?: string }).JINA_API_KEY;
  const headers: Record<string, string> = { Accept: 'text/plain' };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(`${JINA_BASE}${targetUrl}`, { headers });
  if (!response.ok) {
    throw new JinaError(`Jina Reader returned ${response.status} for ${targetUrl}`);
  }
  return await response.text();
}
