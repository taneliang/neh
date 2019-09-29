import { handleQueryString } from './src/neh';
import { openSearchPath, respondToOpenSearchQuery } from './src/opensearch';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  const requestURL = new URL(request.url);

  if (requestURL.pathname === openSearchPath) {
    return respondToOpenSearchQuery();
  }

  const queryString = requestURL.searchParams.get('');
  return await handleQueryString(queryString);
}
