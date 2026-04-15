import gpHandler from './gp';

describe('gp handler', () => {
  test('should redirect to Graphite home if no tokens provided', async () => {
    const response = await gpHandler.handle([]);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(`"https://app.graphite.com/"`);
  });

  test('should convert a GitHub PR URL to a Graphite PR URL', async () => {
    const response = await gpHandler.handle([
      'https://github.com/paraform-xyz/paraform/pull/10437',
    ]);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://app.graphite.com/github/pr/paraform-xyz/paraform/10437"`,
    );
  });

  test('should redirect to Graphite home if token is not a GitHub PR URL', async () => {
    const response = await gpHandler.handle(['some random text']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(`"https://app.graphite.com/"`);
  });
});
