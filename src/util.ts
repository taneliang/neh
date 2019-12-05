import parse from 'url-parse';
import { Token } from './Handler';

export function extractQueryFromUrl(urlStr: string): string {
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

const tokensToQuery = (tokens: string[]) => tokens.join('%20');

export const redirect = (noSearchUrl: string) => {
  return Response.redirect(noSearchUrl, 302);
};
