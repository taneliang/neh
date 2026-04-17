import fetchMock from 'jest-fetch-mock';
import aiHandler from './ai';

type GlobalWithKey = { OPENROUTER_API_KEY?: string };

function setApiKey(value: string | undefined): void {
  (globalThis as unknown as GlobalWithKey).OPENROUTER_API_KEY = value;
}

function mockOpenRouterReply(content: string): void {
  fetchMock.mockOnce(async () => JSON.stringify({ choices: [{ message: { content } }] }));
}

describe('ai handler', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
    setApiKey('test-key');
  });

  afterEach(() => {
    fetchMock.disableMocks();
    setApiKey(undefined);
  });

  test('redirects to DuckDuckGo home when no tokens given', async () => {
    const response = await aiHandler.handle([]);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://duckduckgo.com');
  });

  test('redirects to the URL the LLM returns', async () => {
    mockOpenRouterReply('https://react.dev/reference/react/useEffect');

    const response = await aiHandler.handle(['react', 'useEffect', 'docs']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://react.dev/reference/react/useEffect');
  });

  test('strips surrounding quotes / backticks from LLM output', async () => {
    mockOpenRouterReply('`https://example.com/foo`');

    const response = await aiHandler.handle(['example']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://example.com/foo');
  });

  test('falls back to DuckDuckGo search when LLM output is not a URL', async () => {
    mockOpenRouterReply('I am not a URL');

    const response = await aiHandler.handle(['some', 'query']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://duckduckgo.com/?q=some%20query');
  });

  test('falls back to DuckDuckGo search when LLM returns a non-http scheme', async () => {
    mockOpenRouterReply('javascript:alert(1)');

    const response = await aiHandler.handle(['xss']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://duckduckgo.com/?q=xss');
  });

  test('falls back to DuckDuckGo search when the LLM call fails', async () => {
    fetchMock.mockRejectOnce(new Error('network down'));

    const response = await aiHandler.handle(['offline', 'test']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://duckduckgo.com/?q=offline%20test');
  });

  test('falls back to DuckDuckGo search when OPENROUTER_API_KEY is missing', async () => {
    setApiKey(undefined);

    const response = await aiHandler.handle(['no', 'key']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://duckduckgo.com/?q=no%20key');
  });
});
