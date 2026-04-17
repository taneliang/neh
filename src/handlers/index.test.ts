import handler from '.';

describe('neh global handler', () => {
  test('should respond to root with list', async () => {
    const homeResponse = await handler.handle([]);
    const listResponse = await handler.handle(['list']);
    expect(homeResponse).toEqual(listResponse);
  });

  test('should default to DuckDuckGo for queries without a URL', async () => {
    const response = await handler.handle(['search', 'query']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('duckduckgo.com');
    expect(response.headers.get('location')).toContain('search');
  });
});
