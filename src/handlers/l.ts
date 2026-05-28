import { FunctionHandler, Token } from '../Handler';
import tldSet from '../resources/tlds';
import { redirect } from '../util';

const DEFAULT_PROTOCOL = 'http';
const DEFAULT_PORT = '3000';

// Extracts the path (plus query and hash) from a URL or URL-like token,
// stripping any scheme and host. Returns '' if there's nothing after the host.
function extractPath(token: Token): string {
  // Remove the scheme, e.g. "https://".
  const rest = token.replace(/^[a-z][a-z0-9+\-.]*:\/\//i, '');
  if (rest.startsWith('/')) {
    return rest;
  }
  // Strip the host, keeping everything from the first /, ? or # onwards.
  const pathStart = rest.search(/[/?#]/);
  return pathStart === -1 ? '' : rest.slice(pathStart);
}

// A token is a URL/path (rather than a bare target host) if it contains a path
// or a port. This includes schemeless forms copied from the address bar, where
// the browser hides the scheme, e.g. `localhost:3000/abc` or `localhost:3000`.
// A bare host like `eliangtan.com` has neither a "/" nor a ":port".
function isUrlOrPath(token: Token): boolean {
  return token.includes('/') || /:\d/.test(token);
}

// Ensures a bare host ends in a valid TLD, appending ".com" if it doesn't.
// A single label is always treated as a name (e.g. `fedex` => `fedex.com`),
// even when it happens to be a valid TLD, since a bare TLD isn't a usable host.
function normalizeHost(host: string): string {
  const dotIndex = host.lastIndexOf('.');
  if (dotIndex === -1) {
    return `${host}.com`;
  }
  const lastLabel = host.slice(dotIndex + 1).toLowerCase();
  return tldSet.has(lastLabel) ? host : `${host}.com`;
}

// Rewrites the host of a URL, in either direction.
//
// Tokens may include, in any order:
// - a bare host (no scheme), which switches to "real host" mode: always https,
//   with ".com" appended if no valid TLD is present
// - a URL or path whose path/query/hash is preserved
// - `s` to use https (localhost mode only; defaults to http)
// - a number to set the port (localhost mode only; defaults to 3000)
//
// localhost mode (no bare host given):
// - `l https://whatever.com/abc` => http://localhost:3000/abc
// - `l s 80`                     => https://localhost:80
// - `l 5243`                     => http://localhost:5243
// - `l s`                        => https://localhost:3000
//
// real host mode (a bare host given):
// - `l eliangtan http://localhost:23423/abc`     => https://eliangtan.com/abc
// - `l www.eliangtan https://localhost:22/abc`   => https://www.eliangtan.com/abc
// - `l eliang.science https://localhost/abc`     => https://eliang.science/abc
// - `l eliangtan.com localhost:3000/abc`         => https://eliangtan.com/abc
//   (the source URL may be schemeless, as copied from the address bar)
const lHandler = new FunctionHandler(
  'rewrites a URL host; defaults to localhost (e.g. `l https://whatever.com/abc` => http://localhost:3000/abc, `l s 80` => https://localhost:80, `l 5243` => http://localhost:5243), or to a given host over https with `.com` appended if no TLD is present (e.g. `l eliangtan http://localhost:23423/abc` => https://eliangtan.com/abc)',
  (tokens) => {
    let httpsFlag = false;
    let port = DEFAULT_PORT;
    let path = '';
    let host = '';

    for (const token of tokens) {
      if (isUrlOrPath(token)) {
        path = extractPath(token);
      } else if (token.toLowerCase() === 's') {
        httpsFlag = true;
      } else if (/^\d+$/.test(token)) {
        port = token;
      } else {
        host = token;
      }
    }

    if (host !== '') {
      return redirect(`https://${normalizeHost(host)}${path}`);
    }

    const protocol = httpsFlag ? 'https' : DEFAULT_PROTOCOL;
    return redirect(`${protocol}://localhost:${port}${path}`);
  },
);

export default lHandler;
