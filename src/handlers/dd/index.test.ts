import dd from '.';

async function location(tokens: string[]): Promise<string> {
  const response = await dd.handle(tokens);
  expect(response.status).toBe(302);
  return response.headers.get('location') ?? '';
}

describe('dd handler', () => {
  test('bare dd goes to Live Tail', async () => {
    expect(await location([])).toBe('https://app.datadoghq.com/logs/livetail');
  });

  test('free text does a logs search', async () => {
    expect(await location(['status:error', 'service:paraform'])).toBe(
      'https://app.datadoghq.com/logs?query=status%3Aerror%20service%3Aparaform',
    );
  });

  test('dd l searches logs', async () => {
    expect(await location(['l', 'error'])).toBe('https://app.datadoghq.com/logs?query=error');
  });

  test('dd lt goes to Live Tail', async () => {
    expect(await location(['lt'])).toBe('https://app.datadoghq.com/logs/livetail');
  });

  test('dd apm searches traces', async () => {
    expect(await location(['apm', 'foo'])).toBe('https://app.datadoghq.com/apm/traces?query=foo');
  });

  test('dd apm services goes to services', async () => {
    expect(await location(['apm', 'services'])).toBe('https://app.datadoghq.com/apm/services');
    expect(await location(['a', 's'])).toBe('https://app.datadoghq.com/apm/services');
  });

  test('dd dbm goes to Database Monitoring', async () => {
    expect(await location(['dbm'])).toBe('https://app.datadoghq.com/databases');
  });

  test('dd dbm q goes to query metrics', async () => {
    expect(await location(['dbm', 'q'])).toBe('https://app.datadoghq.com/databases/query-metrics');
  });

  test('dd rum searches the explorer', async () => {
    expect(await location(['rum', 'bar'])).toBe('https://app.datadoghq.com/rum/explorer?query=bar');
  });

  test('dd rw with no rewrite lists available rewrites', async () => {
    const response = await dd.handle(['rw']);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('api');
  });
});
