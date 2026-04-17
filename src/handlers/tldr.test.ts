import fetchMock from 'jest-fetch-mock';
import tldrHandler from './tldr';

type GlobalWithKey = { OPENROUTER_API_KEY?: string };

function setApiKey(value: string | undefined): void {
  (globalThis as unknown as GlobalWithKey).OPENROUTER_API_KEY = value;
}

describe('tldr handler', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
    setApiKey('test-key');
  });

  afterEach(() => {
    fetchMock.disableMocks();
    setApiKey(undefined);
  });

  test('renders a TL;DR page on success', async () => {
    fetchMock.mockResponses(
      ['# Article\n\nFull text here.', { status: 200 }],
      [
        JSON.stringify({ choices: [{ message: { content: 'Three. Short. Sentences.' } }] }),
        { status: 200 },
      ],
    );

    const response = await tldrHandler.handle(['https://example.com/post']);
    expect(response.status).toBe(200);

    const body = await response.text();
    expect(body).toContain('TL;DR');
    expect(body).toContain('Three. Short. Sentences.');
  });

  test('returns a 400 error page when no URL is given', async () => {
    const response = await tldrHandler.handle([]);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('Provide a URL');
  });
});
