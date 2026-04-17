const BRAVE_SEARCH_URL = 'https://api.search.brave.com/res/v1/web/search';

export interface BraveResult {
  url: string;
  title: string;
  description: string;
}

export class BraveSearchError extends Error {}

export async function searchBrave(query: string, count = 5): Promise<BraveResult[]> {
  const apiKey = (globalThis as unknown as { BRAVE_SEARCH_API_KEY?: string }).BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    throw new BraveSearchError('BRAVE_SEARCH_API_KEY is not configured');
  }

  const url = new URL(BRAVE_SEARCH_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('count', String(count));

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': apiKey,
    },
  });

  if (!response.ok) {
    throw new BraveSearchError(`Brave Search returned ${response.status}`);
  }

  const data = (await response.json()) as {
    web?: { results?: { url: string; title: string; description?: string }[] };
  };

  return (data.web?.results ?? []).map((r) => ({
    url: r.url,
    title: r.title,
    description: r.description ?? '',
  }));
}
