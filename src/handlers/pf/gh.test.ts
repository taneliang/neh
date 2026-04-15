import ghHandler from './gh';

describe('pf gh handler (paraform repo)', () => {
  test('should redirect to repo if no tokens provided', async () => {
    const response = await ghHandler.handle([]);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://github.com/paraform-xyz/paraform"`,
    );
  });

  test('should redirect to PR if token is a number', async () => {
    const response = await ghHandler.handle(['10437']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://github.com/paraform-xyz/paraform/pull/10437"`,
    );
  });

  test('should redirect to PR search if token is not a number', async () => {
    const response = await ghHandler.handle(['my', 'feature', 'branch']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://github.com/paraform-xyz/paraform/pulls?q=is%3Apr+sort%3Aupdated-desc+my%20feature%20branch"`,
    );
  });

  describe('pr subcommand', () => {
    test('should redirect to open PRs if no tokens provided', async () => {
      const response = await ghHandler.handle(['pr']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/paraform-xyz/paraform/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc"`,
      );
    });

    test('should redirect to specific PR if token is a number', async () => {
      const response = await ghHandler.handle(['pr', '10437']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/paraform-xyz/paraform/pull/10437"`,
      );
    });
  });

  describe('f subcommand', () => {
    test('should do a filename search', async () => {
      const response = await ghHandler.handle(['f', 'index.ts']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/search?type=code&q=repo%3aparaform-xyz/paraform%20filename%3aindex.ts"`,
      );
    });
  });

  describe('s subcommand', () => {
    test('should do a string search', async () => {
      const response = await ghHandler.handle(['s', 'some query']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/paraform-xyz/paraform/search?q=some+query"`,
      );
    });
  });
});

describe('pf gh infra handler (paraform-infra repo)', () => {
  test('should redirect to infra repo if no tokens provided', async () => {
    const response = await ghHandler.handle(['infra']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://github.com/paraform-xyz/paraform-infra"`,
    );
  });

  test('should redirect to infra PR if token is a number', async () => {
    const response = await ghHandler.handle(['infra', '42']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://github.com/paraform-xyz/paraform-infra/pull/42"`,
    );
  });

  test('should redirect to infra PR search if token is not a number', async () => {
    const response = await ghHandler.handle(['infra', 'network']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://github.com/paraform-xyz/paraform-infra/pulls?q=is%3Apr+sort%3Aupdated-desc+network"`,
    );
  });
});
