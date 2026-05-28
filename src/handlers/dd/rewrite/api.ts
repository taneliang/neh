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
 * Operates on a DECODED query string; `<value>` runs to the next whitespace
 * (`\S+`).
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
    // A pasted Datadog URL survives neh's browser-encode -> decode round trip in
    // its original form: the whole URL arrives as a single token whose `query=`
    // param is still percent-encoded (e.g. `%23api_no_api%3A...`). So we split on
    // the raw `&`/`=` boundaries, then decode just the query value before
    // rewriting and re-encode it exactly once. Other params are left
    // byte-identical so we never double-encode them.
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
        if (eq === -1 || pair.slice(0, eq) !== 'query') {
          // Leave every non-query param exactly as received.
          return pair;
        }
        const rawValue = pair.slice(eq + 1);
        let decoded: string;
        try {
          decoded = decodeURIComponent(rawValue);
        } catch {
          decoded = rawValue;
        }
        return `query=${encodeURIComponent(rewriteApiQuery(decoded))}`;
      })
      .join('&');

    return redirect(`${base}?${rebuilt}`);
  },
);

export default apiRewriteHandler;
