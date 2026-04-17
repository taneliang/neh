import fetchMock from 'jest-fetch-mock';
import sumHandler from './sum';

type GlobalWithKey = { OPENROUTER_API_KEY?: string };

function setApiKey(value: string | undefined): void {
  (globalThis as unknown as GlobalWithKey).OPENROUTER_API_KEY = value;
}

describe('sum handler', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
    setApiKey('test-key');
  });

  afterEach(() => {
    fetchMock.disableMocks();
    setApiKey(undefined);
  });

  test('returns a 400 error page when no URL is given', async () => {
    const response = await sumHandler.handle([]);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('Provide a URL');
  });

  test('returns a 400 error page for an invalid URL', async () => {
    const response = await sumHandler.handle(['::::']);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('Not a valid URL');
  });

  test('fetches via Jina Reader and summarizes via the LLM', async () => {
    fetchMock.mockResponses(
      ['# Sourdough\n\nSourdough is bread.', { status: 200 }],
      [
        JSON.stringify({ choices: [{ message: { content: 'A summary paragraph.' } }] }),
        { status: 200 },
      ],
    );

    const response = await sumHandler.handle(['https://en.wikipedia.org/wiki/Sourdough']);
    expect(response.status).toBe(200);

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://r.jina.ai/https://en.wikipedia.org/wiki/Sourdough',
      expect.objectContaining({ headers: expect.objectContaining({ Accept: 'text/plain' }) }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({ method: 'POST' }),
    );

    const body = await response.text();
    expect(body).toContain('Summary');
    expect(body).toContain('A summary paragraph.');
    expect(body).toContain('https://en.wikipedia.org/wiki/Sourdough');
  });

  test('prepends https:// to a bare host', async () => {
    fetchMock.mockResponses(
      ['content', { status: 200 }],
      [JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), { status: 200 }],
    );

    await sumHandler.handle(['example.com/post']);

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://r.jina.ai/https://example.com/post',
      expect.anything(),
    );
  });

  test('renders an error page when Jina Reader fails', async () => {
    fetchMock.mockResponseOnce('not found', { status: 404 });

    const response = await sumHandler.handle(['https://example.com/missing']);
    expect(response.status).toBe(500);
    expect(await response.text()).toContain('Jina Reader returned 404');
  });

  test('renders an error page when the LLM call fails', async () => {
    fetchMock.mockResponses(
      ['some content', { status: 200 }],
      ['server exploded', { status: 500 }],
    );

    const response = await sumHandler.handle(['https://example.com/article']);
    expect(response.status).toBe(500);
    expect(await response.text()).toContain('OpenRouter returned 500');
  });
});
