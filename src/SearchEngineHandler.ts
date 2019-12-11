import parse from 'url-parse';
import { FunctionHandler } from './Handler';
import { redirect } from './util';

type SearchUrlGenerator = (tokens: string[]) => string;
type SearchUrlParser = (url: string) => string | null;

// Move this to a search engine file
export type SearchEngine = {
  defaultUrl: string;
  generateSearchUrl: SearchUrlGenerator;
  parseSearchUrl?: SearchUrlParser;
};

export function makeAppendBasedSearchEngine(
  defaultUrl: string,
  baseUrl: string | null,
): SearchEngine {
  const nonNullBaseUrl = baseUrl ?? defaultUrl;
  return {
    defaultUrl,

    generateSearchUrl(tokens): string {
      return nonNullBaseUrl + tokens.join('%20');
    },

    parseSearchUrl(url): string | null {
      if (!url.startsWith(nonNullBaseUrl)) {
        return null;
      }
      const query = url.substring(nonNullBaseUrl.length);
      if (query.length === 0) {
        return null;
      }
      return decodeURIComponent(query);
    },
  };
}

export function makeHashBasedSearchEngine(
  defaultUrl: string,
  baseUrl: string | null,
): SearchEngine {
  const nonNullBaseUrl = baseUrl ?? defaultUrl;
  return {
    defaultUrl,

    generateSearchUrl(tokens): string {
      const url = new URL(nonNullBaseUrl);
      url.hash = tokens.join(' ');
      return url.toString();
    },

    parseSearchUrl(url): string | null {
      if (!url.startsWith(nonNullBaseUrl)) {
        return null;
      }
      try {
        const searchUrl = new URL(url);
        const query = searchUrl.hash;
        if (searchUrl.hash.length > 0) {
          return decodeURIComponent(query.substring(1, query.length));
        }
      } catch {}
      return null;
    },
  };
}

export function makeParamBasedSearchEngine(
  defaultUrl: string,
  baseUrl: string | null,
  queryParamName: string,
): SearchEngine {
  const nonNullBaseUrl = baseUrl ?? defaultUrl;
  return {
    defaultUrl,

    generateSearchUrl(tokens): string {
      const url = new URL(nonNullBaseUrl);
      url.searchParams.set(queryParamName, tokens.join(' '));
      return url.toString();
    },

    parseSearchUrl(url): string | null {
      if (!url.startsWith(nonNullBaseUrl)) {
        return null;
      }
      try {
        const searchUrl = new URL(url);
        const query = searchUrl.searchParams.get(queryParamName);
        if (query && query.length > 0) {
          return query;
        }
      } catch {}
      return null;
    },
  };
}

export function makePathBasedSearchEngine(
  defaultUrl: string,
  baseUrl: string | null,
  pathIndicesToParse: number[],
): SearchEngine {
  const nonNullBaseUrl = baseUrl ?? defaultUrl;
  return {
    defaultUrl,

    generateSearchUrl(tokens): string {
      return nonNullBaseUrl + tokens.join('/');
    },

    parseSearchUrl(url): string | null {
      if (!url.startsWith(nonNullBaseUrl)) {
        return null;
      }

      const searchUrl = parse(url, true);
      let query = searchUrl.pathname;
      if (query.charAt(0) === '/') {
        query = query.substring(1);
      }
      if (query.length === 0) {
        return null;
      }

      const querySegments = query.split('/').map((s) => s.trim());
      const interestingSegments = pathIndicesToParse
        .map((i) => querySegments[i])
        .filter((s) => typeof s !== 'undefined' && s.length > 0);

      if (interestingSegments.length === 0) {
        return null;
      }
      return interestingSegments.join('/');
    },
  };
}

// TODO: Make this more testable
const searchEngines: SearchEngine[] = [];

function parseSearchQuery(searchUrl: string): string | null {
  for (const engine of searchEngines) {
    const query = engine.parseSearchUrl?.(searchUrl);
    if (query) {
      return query;
    }
  }
  return null;
}

export class SearchEngineHandler extends FunctionHandler {
  constructor(docstring: string, searchEngine: SearchEngine) {
    searchEngines.push(searchEngine);
    super(docstring, (tokens) => {
      if (tokens.length === 0) {
        return redirect(searchEngine.defaultUrl);
      }

      // Transform existing search if possible
      const query = parseSearchQuery(tokens.join(' '));
      let queryTokens = tokens;
      if (query !== null) {
        queryTokens = [query];
      }
      return redirect(searchEngine.generateSearchUrl(queryTokens));
    });
  }
}
