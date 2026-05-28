import { FunctionHandler, Token } from '../Handler';
import { redirect } from '../util';

const DEFAULT_PROTOCOL = 'http';
const DEFAULT_PORT = '3000';

// Extracts the path (plus query and hash) from a URL or URL-like token,
// stripping any scheme and host. Returns '' if there's nothing after the host.
function extractPath(token: Token): string {
  // Remove the scheme, e.g. "https://".
  let rest = token.replace(/^[a-z][a-z0-9+\-.]*:\/\//i, '');
  if (rest.startsWith('/')) {
    return rest;
  }
  // Strip the host, keeping everything from the first /, ? or # onwards.
  const pathStart = rest.search(/[/?#]/);
  return pathStart === -1 ? '' : rest.slice(pathStart);
}

// Redirects to a localhost URL, optionally replacing the host of a given URL.
//
// Tokens may include, in any order:
// - `s` to use https instead of http
// - a number to set the port (defaults to 3000)
// - a URL or path whose path/query/hash is preserved
//
// Examples:
// - `l https://whatever.com/abc` => http://localhost:3000/abc
// - `l s 80`                     => https://localhost:80
// - `l 5243`                     => http://localhost:5243
// - `l s`                        => https://localhost:3000
const lHandler = new FunctionHandler(
  'redirects to localhost, e.g. `l https://whatever.com/abc` => http://localhost:3000/abc; `l s 80` => https://localhost:80; `l 5243` => http://localhost:5243; `l s` => https://localhost:3000',
  (tokens) => {
    let protocol = DEFAULT_PROTOCOL;
    let port = DEFAULT_PORT;
    let path = '';

    for (const token of tokens) {
      if (token.toLowerCase() === 's') {
        protocol = 'https';
      } else if (/^\d+$/.test(token)) {
        port = token;
      } else {
        path = extractPath(token);
      }
    }

    return redirect(`${protocol}://localhost:${port}${path}`);
  },
);

export default lHandler;
