import { SearchEngine } from '../../SearchEngineHandler';

export const DD_BASE = 'https://app.datadoghq.com';

/**
 * Builds a SearchEngine for a Datadog product whose query is carried in a
 * `?query=` param (Logs, APM traces, RUM, etc.).
 *
 * We can't use makeParamBasedSearchEngine here: it encodes spaces as `+`,
 * whereas Datadog's query parser expects `%20` (and `%3A`/`%40`/`%2F` for the
 * facet syntax). So we build the URL ourselves with encodeURIComponent.
 */
export function makeDatadogQuerySearchEngine(path: string): SearchEngine {
  const defaultUrl = `${DD_BASE}${path}`;
  return {
    defaultUrl,

    generateSearchUrl(tokens): string {
      return `${defaultUrl}?query=${encodeURIComponent(tokens.join(' '))}`;
    },

    parseSearchUrl(url): string | null {
      // String-based extraction rather than `new URL()`: a Datadog query can
      // contain a literal `#` (e.g. tag facets like `#api_no_api:`), which the
      // URL parser would treat as the start of the fragment, truncating the
      // query.
      if (!url.startsWith(`${DD_BASE}/`)) {
        return null;
      }
      const match = url.match(/[?&]query=([^&#]*)/);
      if (!match) {
        return null;
      }
      const query = decodeURIComponent(match[1]);
      return query.length > 0 ? query : null;
    },
  };
}
