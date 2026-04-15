import { Token } from './Handler';

export function emptyArray<T>(arr: T[]): void {
  // Source: https://stackoverflow.com/a/1232046
  arr.splice(0, arr.length);
}

function getRawPathname(urlStr: string): string {
  // Native URL normalizes double slashes; avoid it for pathname extraction.
  // Cloudflare Workers URL parsing removes // from paths, hence this workaround.
  const withoutOrigin = urlStr.replace(/^[a-z][a-z0-9+\-.]*:\/\/[^/?#]*/i, '');
  const pathEnd = withoutOrigin.search(/[?#]/);
  return pathEnd === -1 ? withoutOrigin : withoutOrigin.slice(0, pathEnd);
}

export function extractQueryFromUrl(urlStr: string, areSpacesEncodedAsPlus: boolean): string {
  if (!urlStr) return '';
  // Browsers encode the query in 2 ways:
  // 1. Query, e.g. "token1+%2B+token2". Firefox does this.
  // 2. Path, e.g. "token1%20+%20token2". Chrome does this.
  const pathname = areSpacesEncodedAsPlus
    ? getRawPathname(urlStr).replace(/\+/g, ' ')
    : getRawPathname(urlStr);

  const url = new URL(urlStr);
  let query = decodeURIComponent(pathname + url.search + url.hash);
  if (query.charAt(0) === '/') {
    query = query.substring(1);
  }
  return query;
}

export function tokenizeQuery(query: string): Token[] {
  return query.split(' ').filter((c) => c);
}

export function redirect(location: string): Response {
  // Don't use Response.redirect due to poor mock support
  return new Response(null, { status: 302, headers: { location } });
}
