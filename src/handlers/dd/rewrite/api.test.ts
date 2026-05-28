import apiRewriteHandler from './api';

// A pasted Datadog URL reaches the handler as a single token whose `query=`
// param is still percent-encoded (it survives neh's browser-encode -> decode
// round trip in its original form).
function locationOf(response: Response): string {
  return response.headers.get('location') ?? '';
}

function locationQuery(response: Response): string {
  return new URL(locationOf(response)).searchParams.get('query') ?? '';
}

describe('dd rw api handler', () => {
  test('rewrites #api_no_api (with escaped slashes) to @api:/api/', async () => {
    const url =
      'https://app.datadoghq.com/logs?query=service%3Aparaform%20%40api%3A%2A%20status%3Aerror%20AND%20%23api_no_api%3Atrpc%5C%2Fcompany.getCompanySlackIds&cols=host%2Cservice&from_ts=1&to_ts=2';

    const response = await apiRewriteHandler.handle([url]);

    expect(response.status).toBe(302);
    expect(locationQuery(response)).toBe(
      'service:paraform @api:* status:error AND @api:/api/trpc/company.getCompanySlackIds',
    );
  });

  test('rewrites #api_no_api (with plain slashes) to @api:/api/', async () => {
    const url =
      'https://app.datadoghq.com/logs?query=service%3Aparaform%20AND%20%23api_no_api%3Acron%2Femails%2Fdetect_bounce_emails&agg_m=count';

    const response = await apiRewriteHandler.handle([url]);

    expect(locationQuery(response)).toBe(
      'service:paraform AND @api:/api/cron/emails/detect_bounce_emails',
    );
  });

  test('preserves other params byte-identically and does not double-encode', async () => {
    const url =
      'https://app.datadoghq.com/logs?query=%23api_no_api%3Atrpc%5C%2Fx&cols=host%2Cservice&from_ts=1&to_ts=2';

    const location = locationOf(await apiRewriteHandler.handle([url]));

    expect(location).toContain('cols=host%2Cservice');
    expect(location).toContain('from_ts=1');
    expect(location).toContain('to_ts=2');
    expect(location).not.toContain('%25'); // no double-encoding
  });

  test('rewrites multiple #api_no_api occurrences', async () => {
    const url =
      'https://app.datadoghq.com/logs?query=%23api_no_api%3Atrpc%2Fa%20OR%20%23api_no_api%3Atrpc%2Fb';

    const response = await apiRewriteHandler.handle([url]);

    expect(locationQuery(response)).toBe('@api:/api/trpc/a OR @api:/api/trpc/b');
  });

  test('leaves a query without #api_no_api unchanged', async () => {
    const url = 'https://app.datadoghq.com/logs?query=service%3Aparaform%20status%3Aerror';

    const response = await apiRewriteHandler.handle([url]);

    expect(locationQuery(response)).toBe('service:paraform status:error');
  });

  test('falls back to the raw value when the query is not valid percent-encoding', async () => {
    const url = 'https://app.datadoghq.com/logs?query=foo%';

    const response = await apiRewriteHandler.handle([url]);

    expect(response.status).toBe(302);
    expect(locationQuery(response)).toBe('foo%');
  });

  test('returns an error for non-URL input', async () => {
    const response = await apiRewriteHandler.handle(['not', 'a', 'url']);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('expects a full Datadog logs URL');
  });

  test('returns an error for a URL without a query string', async () => {
    const response = await apiRewriteHandler.handle(['https://app.datadoghq.com/logs']);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('expects a full Datadog logs URL');
  });
});
