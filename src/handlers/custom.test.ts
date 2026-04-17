import fetchMock from 'jest-fetch-mock';
import customPromptHandler from './custom';

type GlobalWithKey = { OPENROUTER_API_KEY?: string };

function setApiKey(value: string | undefined): void {
  (globalThis as unknown as GlobalWithKey).OPENROUTER_API_KEY = value;
}

describe('custom prompt handler', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
    setApiKey('test-key');
  });

  afterEach(() => {
    fetchMock.disableMocks();
    setApiKey(undefined);
  });

  test('redirects to DuckDuckGo when no URL is present', async () => {
    const response = await customPromptHandler.handle(['just', 'a', 'search']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('duckduckgo.com');
    expect(response.headers.get('location')).toContain('just%20a%20search');
  });

  test('redirects to DuckDuckGo when URL is present but no prompt', async () => {
    const response = await customPromptHandler.handle(['https://example.com']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('duckduckgo.com');
  });

  test('applies prompt as system message and page content as user message', async () => {
    fetchMock.mockResponses(
      ['# Pricing\n\n| Plan | Price |\n| --- | --- |\n| Free | $0 |', { status: 200 }],
      [
        JSON.stringify({ choices: [{ message: { content: '| Plan | Price |\n| --- | --- |' } }] }),
        { status: 200 },
      ],
    );

    const response = await customPromptHandler.handle([
      'the',
      'table',
      'in',
      'markdown',
      'https://example.com/pricing',
    ]);
    expect(response.status).toBe(200);

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('"role":"system","content":"the table in markdown"'),
      }),
    );
  });

  test('uses the prompt as the result page label', async () => {
    fetchMock.mockResponses(
      ['content', { status: 200 }],
      [JSON.stringify({ choices: [{ message: { content: 'result' } }] }), { status: 200 }],
    );

    const response = await customPromptHandler.handle([
      'extract',
      'URLs',
      'https://example.com',
    ]);
    const body = await response.text();
    expect(body).toContain('extract URLs');
  });

  test('works with no space between prompt and URL', async () => {
    fetchMock.mockResponses(
      ['content', { status: 200 }],
      [JSON.stringify({ choices: [{ message: { content: 'result' } }] }), { status: 200 }],
    );

    const response = await customPromptHandler.handle([
      'the',
      'table',
      'in',
      'markdownhttps://example.com/pricing',
    ]);
    expect(response.status).toBe(200);

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://r.jina.ai/https://example.com/pricing',
      expect.anything(),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('"role":"system","content":"the table in markdown"'),
      }),
    );
  });

  test('renders an error page when Jina Reader fails', async () => {
    fetchMock.mockResponseOnce('not found', { status: 404 });

    const response = await customPromptHandler.handle([
      'summarize',
      'https://example.com/missing',
    ]);
    expect(response.status).toBe(500);
    expect(await response.text()).toContain('Jina Reader returned 404');
  });

  test('renders an error page when the this exact phrase, but honest call fails', async () => {
    fetchMock.mockResponses(
      ['some content', { status: 200 }],
      ['server exploded', { status: 500 }],
    );

    const response = await customPromptHandler.handle([
      'summarize',
      'https://example.com/article',
    ]);
    expect(response.status).toBe(500);
    expect(await response.text()).toContain('OpenRouter returned 500');
  });
});
