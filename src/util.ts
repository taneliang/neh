import parse from 'url-parse';
import { Token } from './Handler';

export function emptyArray<T>(arr: T[]): void {
  // Source: https://stackoverflow.com/a/1232046
  arr.splice(0, arr.length);
}

export function extractQueryFromUrl(urlStr: string, areSpacesEncodedAsPlus: boolean): string {
  // Use url-parse instead of URL for pathname as double slashes will be
  // removed on Cloudflare by URL.
  const parsedUrl = parse(urlStr, true);

  // Browsers encode the query in 2 ways:
  // 1. Query, e.g. "token1+%2B+token2". Firefox does this.
  // 2. Path, e.g. "token1%20+%20token2". Chrome does this.
  const pathname = areSpacesEncodedAsPlus
    ? parsedUrl.pathname.replace(/\+/g, ' ')
    : parsedUrl.pathname;

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
