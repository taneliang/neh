import fetchMock from 'jest-fetch-mock';
import handler from './gh';

describe('gh handler', () => {
  describe('p handler', () => {
    test('should redirect if at least one user is returned', async () => {
      fetchMock.enableMocks();

      const htmlUrl = 'https://github.com/taneliang';
      // eslint-disable-next-line @typescript-eslint/camelcase
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
      // eslint-disable-next-line @typescript-eslint/camelcase
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
