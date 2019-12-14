import handler from '.';

describe('neh global handler', () => {
  test('should respond to root with list', async () => {
    const homeResponse = await handler.handle([]);
    const listResponse = await handler.handle(['list']);
    expect(homeResponse).toEqual(listResponse);
  });

  test('should default to DuckDuckGo', async () => {
    const tokens = ['search', 'query'];
    const homeResponse = await handler.handle(tokens);
    const dResponse = await handler.handle(['d', ...tokens]);
    expect(homeResponse).toEqual(dResponse);
  });
});
