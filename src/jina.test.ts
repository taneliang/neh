import fetchMock from 'jest-fetch-mock';
import { JinaError, fetchAsMarkdown } from './jina';

type GlobalWithKey = { JINA_API_KEY?: string };

function setJinaKey(value: string | undefined): void {
  (globalThis as unknown as GlobalWithKey).JINA_API_KEY = value;
}

describe('fetchAsMarkdown', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
    setJinaKey(undefined);
  });

  afterEach(() => {
    fetchMock.disableMocks();
    setJinaKey(undefined);
  });

  test('sends no Authorization header when JINA_API_KEY is not set', async () => {
    fetchMock.mockOnce(async () => '# article');
    await fetchAsMarkdown('https://example.com/post');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://r.jina.ai/https://example.com/post',
      expect.objectContaining({
        headers: expect.not.objectContaining({ Authorization: expect.anything() }),
      }),
    );
  });

  test('sends Bearer token when JINA_API_KEY is set', async () => {
    setJinaKey('jina-secret');
    fetchMock.mockOnce(async () => '# article');
    await fetchAsMarkdown('https://example.com/post');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://r.jina.ai/https://example.com/post',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'text/plain',
          Authorization: 'Bearer jina-secret',
        }),
      }),
    );
  });

  test('throws JinaError on non-ok response', async () => {
    fetchMock.mockOnce(async () => ({ init: { status: 429 }, body: 'rate limited' }));
    await expect(fetchAsMarkdown('https://example.com/post')).rejects.toBeInstanceOf(JinaError);
  });
});
