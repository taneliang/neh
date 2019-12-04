import {} from '@cloudflare/workers-types';

import { handleQueryString } from './neh';
import openSearchDescription from './resources/_opensearch.xml';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

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

  const queryString = requestURL.searchParams.get('');
  return await handleQueryString(queryString);
}
