import { handleQueryString } from './src/neh';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  const requestURL = new URL(request.url);
  const queryString = requestURL.searchParams.get('');
  return await handleQueryString(queryString);
}
