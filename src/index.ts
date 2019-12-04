import {} from '@cloudflare/workers-types';

// import { handleQueryString } from './src/neh';
// import { openSearchPath, respondToOpenSearchQuery } from './src/opensearch';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Fetch and log a request
 */
async function handleRequest(request: Request): Promise<Response> {
  const requestURL = new URL(request.url);

  return new Response('fo');

  // if (requestURL.pathname === openSearchPath) {
  //   return respondToOpenSearchQuery();
  // }

  // const queryString = requestURL.searchParams.get('');
  // return await handleQueryString(queryString);
}
