import {} from '@cloudflare/workers-types';

import handler from './handlers';
import { extractQueryFromUrl, tokenizeQuery } from './util';
import openSearchDescription from './resources/_opensearch.xml';

/**
 * Fetch and log a request
 */
async function handleRequest(request: Request): Promise<Response> {
  const requestURL = new URL(request.url);
  if (requestURL.pathname === '/_opensearch') {
    return new Response(openSearchDescription, {
      headers: {
        'content-type': 'application/xml',
      },
    });
  }

  const query = extractQueryFromUrl(request.url);
  const tokens = tokenizeQuery(query);
  return await handler.handle(tokens);
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
