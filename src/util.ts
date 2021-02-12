import parse from 'url-parse';
import { Token } from './Handler';

export function emptyArray<T>(arr: T[]): void {
  // Source: https://stackoverflow.com/a/1232046
  arr.splice(0, arr.length);
}

export function extractQueryFromUrl(urlStr: string, convertPlusToSpace?: boolean): string {
  // Firefox sends search queries for 'token1 token2' as '/token1+token2',
  // while Chrome sends '/token1%20token2'. The `convertPlusToSpace` normalizes
  // this behaviour.
  if (convertPlusToSpace) {
    urlStr = urlStr.replace(/\+/g, '%20');
  }

  // Use url-parse instead of URL for pathname as double slashes will be
  // removed on Cloudflare by URL.
  const parsedUrl = parse(urlStr, true);
  const url = new URL(urlStr);
  let query = decodeURIComponent(parsedUrl.pathname + url.search + url.hash);
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
