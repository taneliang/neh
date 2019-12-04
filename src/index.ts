import {} from '@cloudflare/workers-types';

import { handleQueryString } from './neh';
import { openSearchPath, respondToOpenSearchQuery } from './opensearch';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Fetch and log a request
 */
async function handleRequest(request: Request): Promise<Response> {
  const requestURL = new URL(request.url);

  if (requestURL.pathname === openSearchPath) {
    return respondToOpenSearchQuery();
  }

  const queryString = requestURL.searchParams.get('');
  return await handleQueryString(queryString);
}
