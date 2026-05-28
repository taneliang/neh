import { FunctionHandler } from '../../../Handler';
import { redirect } from '../../../util';

/** Removes Datadog search escapes, e.g. `trpc\/company` -> `trpc/company`. */
function unescapeDdValue(value: string): string {
  return value.replace(/\\(.)/g, '$1');
}

/**
 * Rewrites every `#api_no_api:<value>` tag facet in a Datadog query into the
 * `@api:/api/<value>` attribute facet, unescaping the value and prepending the
 * `/api/` prefix that the `api_no_api` tag omits.
 *
 * `<value>` runs to the next whitespace (`\S+`); the `&`-split in the handler
 * already isolates the query from the rest of the URL's params.
 */
function rewriteApiQuery(query: string): string {
  return query.replace(
    /#api_no_api:(\S+)/g,
    (_match, value) => `@api:/api/${unescapeDdValue(value)}`,
  );
}

const apiRewriteHandler = new FunctionHandler(
  'rewrites #api_no_api:<path> to @api:/api/<path> in a Datadog logs URL',
  (tokens) => {
    // neh decodes the whole query and splits on spaces, so a pasted Datadog URL
    // arrives shattered and fully decoded. Rejoin it, then operate on the raw
    // string: `new URL()` can't be used because a literal `#` (from the
    // `#api_no_api` tag) is treated as the URL fragment delimiter.
    const raw = tokens.join(' ').trim();

    const queryStart = raw.indexOf('?');
    if (!raw.startsWith('http') || queryStart === -1) {
      return new Response(
        'dd rw api expects a full Datadog logs URL, e.g. "dd rw api https://app.datadoghq.com/logs?query=...".',
        { status: 400 },
      );
    }

    const base = raw.slice(0, queryStart);
    const paramStr = raw.slice(queryStart + 1);

    const rebuilt = paramStr
      .split('&')
      .map((pair) => {
        const eq = pair.indexOf('=');
        const key = eq === -1 ? pair : pair.slice(0, eq);
        let value = eq === -1 ? '' : pair.slice(eq + 1);
        if (key === 'query') {
          value = rewriteApiQuery(value);
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join('&');

    return redirect(`${base}?${rebuilt}`);
  },
);

export default apiRewriteHandler;
