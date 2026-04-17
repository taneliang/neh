import fetchMock from 'jest-fetch-mock';
import aiHandler from './ai';

type GlobalWithKeys = { OPENROUTER_API_KEY?: string; BRAVE_SEARCH_API_KEY?: string };

function setApiKey(value: string | undefined): void {
  (globalThis as unknown as GlobalWithKeys).OPENROUTER_API_KEY = value;
}

function setBraveKey(value: string | undefined): void {
  (globalThis as unknown as GlobalWithKeys).BRAVE_SEARCH_API_KEY = value;
}

function mockOpenRouterReply(content: string): void {
  fetchMock.mockOnce(async () => JSON.stringify({ choices: [{ message: { content } }] }));
}

function mockBraveReply(results: { url: string; title: string; description?: string }[]): void {
  fetchMock.mockOnce(async () => JSON.stringify({ web: { results } }));
}

function mockBraveError(status: number): void {
  fetchMock.mockOnce(async () => ({ init: { status }, body: 'error' }));
}

describe('ai handler', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
    setApiKey('test-key');
    setBraveKey(undefined);
  });

  afterEach(() => {
    fetchMock.disableMocks();
    setApiKey(undefined);
    setBraveKey(undefined);
  });

  test('redirects to DuckDuckGo home when no tokens given', async () => {
    const response = await aiHandler.handle([]);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://duckduckgo.com');
  });

  // --- Brave key absent: falls through to LLM-only (original behavior) ---

  test('redirects to the URL the LLM returns when Brave key is absent', async () => {
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

  // --- Brave key present: search-then-select path ---

  test('selects from Brave results when Brave key is set', async () => {
    setBraveKey('brave-key');
    mockBraveReply([
      {
        url: 'https://react.dev/reference/react/useEffect',
        title: 'useEffect – React',
        description: 'React hook docs',
      },
      { url: 'https://example.com/other', title: 'Other', description: 'Something else' },
    ]);
    mockOpenRouterReply('https://react.dev/reference/react/useEffect');

    const response = await aiHandler.handle(['react', 'useEffect', 'docs']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://react.dev/reference/react/useEffect');
  });

  test('falls back to LLM-only when Brave returns no results', async () => {
    setBraveKey('brave-key');
    mockBraveReply([]);
    mockOpenRouterReply('https://react.dev/reference/react/useEffect');

    const response = await aiHandler.handle(['react', 'useEffect', 'docs']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://react.dev/reference/react/useEffect');
  });

  test('falls back to LLM-only when Brave returns an HTTP error', async () => {
    setBraveKey('brave-key');
    mockBraveError(500);
    mockOpenRouterReply('https://react.dev/reference/react/useEffect');

    const response = await aiHandler.handle(['react', 'useEffect', 'docs']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://react.dev/reference/react/useEffect');
  });

  test('falls back to DuckDuckGo when both Brave and LLM fail', async () => {
    setBraveKey('brave-key');
    mockBraveError(503);
    fetchMock.mockRejectOnce(new Error('LLM down'));

    const response = await aiHandler.handle(['some', 'query']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://duckduckgo.com/?q=some%20query');
  });
});
