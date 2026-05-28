import apiRewriteHandler from './api';

// neh decodes the incoming query and splits it on spaces before a handler sees
// it, so a pasted Datadog URL arrives as space-split, fully-decoded tokens.
function tokensFor(decodedUrl: string): string[] {
  return decodedUrl.split(' ');
}

function locationQuery(response: Response): string {
  const location = response.headers.get('location') ?? '';
  return new URL(location).searchParams.get('query') ?? '';
}

describe('dd rw api handler', () => {
  test('rewrites #api_no_api to @api:/api/ for the documented example', async () => {
    const url =
      'https://app.datadoghq.com/logs?query=service:paraform @api:* status:error AND #api_no_api:trpc\\/company.getCompanySlackIds&calculated_fields=&cols=host,service&fromUser=true&index=&messageDisplay=inline&from_ts=1780001531800&to_ts=1780005131800&live=false';

    const response = await apiRewriteHandler.handle(tokensFor(url));

    expect(response.status).toBe(302);
    expect(locationQuery(response)).toBe(
      'service:paraform @api:* status:error AND @api:/api/trpc/company.getCompanySlackIds',
    );
  });

  test('preserves other params', async () => {
    const url =
      'https://app.datadoghq.com/logs?query=#api_no_api:trpc\\/x&cols=host,service&from_ts=1&to_ts=2';

    const location = (await apiRewriteHandler.handle(tokensFor(url))).headers.get('location') ?? '';

    expect(location).toContain('cols=host%2Cservice');
    expect(location).toContain('from_ts=1');
    expect(location).toContain('to_ts=2');
  });

  test('rewrites multiple #api_no_api occurrences', async () => {
    const url = 'https://app.datadoghq.com/logs?query=#api_no_api:trpc\\/a OR #api_no_api:trpc\\/b';

    const response = await apiRewriteHandler.handle(tokensFor(url));

    expect(locationQuery(response)).toBe('@api:/api/trpc/a OR @api:/api/trpc/b');
  });

  test('leaves a query without #api_no_api unchanged', async () => {
    const url = 'https://app.datadoghq.com/logs?query=service:paraform status:error';

    const response = await apiRewriteHandler.handle(tokensFor(url));

    expect(locationQuery(response)).toBe('service:paraform status:error');
  });

  test('returns an error for non-URL input', async () => {
    const response = await apiRewriteHandler.handle(['not', 'a', 'url']);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('expects a full Datadog logs URL');
  });
});
