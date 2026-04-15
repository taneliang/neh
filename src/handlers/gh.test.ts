import fetchMock from 'jest-fetch-mock';
import handler from './gh';

describe('gh handler', () => {
  describe('default handler', () => {
    test('should convert a Graphite PR URL to a GitHub PR URL', async () => {
      const response = await handler.handle([
        'https://app.graphite.com/github/pr/paraform-xyz/paraform/10437',
      ]);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/paraform-xyz/paraform/pull/10437"`,
      );
    });

    test('should do a GitHub search for non-Graphite tokens', async () => {
      const response = await handler.handle(['react', 'hooks']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toMatchInlineSnapshot(
        `"https://github.com/search?q=react+hooks"`,
      );
    });
  });


  describe('p handler', () => {
    test('should redirect if at least one user is returned', async () => {
      fetchMock.enableMocks();

      const htmlUrl = 'https://github.com/taneliang';
      const expectedJsonResponse = { items: [{ html_url: htmlUrl }] };
      fetchMock.mockOnce(async () => JSON.stringify(expectedJsonResponse));

      const response = await handler.handle(['p', 'some query']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toEqual(htmlUrl);

      fetchMock.disableMocks();
    });

    test('should return error message if GitHub returns empty items array', async () => {
      fetchMock.enableMocks();

      const expectedJsonResponse = { items: [] };
      fetchMock.mockOnce(async () => JSON.stringify(expectedJsonResponse));

      const response = await handler.handle(['p', 'some query']);
      expect(response).toMatchSnapshot();

      fetchMock.disableMocks();
    });

    test('should return error message if GitHub API returns error', async () => {
      fetchMock.enableMocks();

      fetchMock.mockOnce(async () => ({
        init: {
          status: 403,
          statusText: 'Forbidden',
        },
        body: 'Some message',
      }));

      const response = await handler.handle(['p', 'some query']);
      expect(response).toMatchSnapshot();

      fetchMock.disableMocks();
    });
  });

  describe('r handler', () => {
    test('should redirect if at least one repository is returned', async () => {
      fetchMock.enableMocks();

      const htmlUrl = 'https://github.com/taneliang/neh';
      const expectedJsonResponse = { items: [{ html_url: htmlUrl }] };
      fetchMock.mockOnce(async () => JSON.stringify(expectedJsonResponse));

      const response = await handler.handle(['r', 'some query']);
      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toEqual(htmlUrl);

      fetchMock.disableMocks();
    });

    test('should return error message if GitHub returns empty items array', async () => {
      fetchMock.enableMocks();

      const expectedJsonResponse = { items: [] };
      fetchMock.mockOnce(async () => JSON.stringify(expectedJsonResponse));

      const response = await handler.handle(['r', 'some query']);
      expect(response).toMatchSnapshot();

      fetchMock.disableMocks();
    });

    test('should return error message if GitHub API returns error', async () => {
      fetchMock.enableMocks();

      fetchMock.mockOnce(async () => ({
        init: {
          status: 403,
          statusText: 'Forbidden',
        },
        body: 'Some message',
      }));

      const response = await handler.handle(['r', 'some query']);
      expect(response).toMatchSnapshot();

      fetchMock.disableMocks();
    });
  });
});
