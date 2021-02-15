import ghHandler from './gh';

describe('iron gh', () => {
  describe('default handler', () => {
    test('should redirect to GitHub if no tokens provided', async () => {
      const response = await ghHandler.handle([]);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/Ironclad/ironclad"`,
      );
    });

    test('should redirect to GitHub search if provided token is not a GitHub PR number', async () => {
      const response = await ghHandler.handle(['gravy', '1611']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/Ironclad/ironclad/pulls?q=is%3Apr+sort%3Aupdated-desc+gravy%201611"`,
      );
    });

    test('should redirect to PR if provided token is a GitHub PR number', async () => {
      const response = await ghHandler.handle(['74656']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/Ironclad/ironclad/pull/74656"`,
      );
    });

    test('should redirect to PR if provided token is a GitHub token', async () => {
      const response = await ghHandler.handle(['iron-1701']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/Ironclad/ironclad/pulls?q=is%3Apr+sort%3Aupdated-desc+iron-1701"`,
      );
    });
  });

  describe('pr handler', () => {
    test('should redirect to GitHub PRs if no tokens provided', async () => {
      const response = await ghHandler.handle(['pr']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/Ironclad/ironclad/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc"`,
      );
    });
  });
});
