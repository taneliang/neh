import fetchMock from 'jest-fetch-mock';
import { callModel, DEFAULT_MODEL, LLMError } from './llm';

type GlobalWithKey = { OPENROUTER_API_KEY?: string };

function setApiKey(value: string | undefined): void {
  (globalThis as unknown as GlobalWithKey).OPENROUTER_API_KEY = value;
}

describe('callModel', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
    setApiKey('test-key');
  });

  afterEach(() => {
    fetchMock.disableMocks();
    setApiKey(undefined);
  });

  test('throws LLMError when OPENROUTER_API_KEY is not set', async () => {
    setApiKey(undefined);
    await expect(callModel([{ role: 'user', content: 'hi' }])).rejects.toBeInstanceOf(LLMError);
  });

  test('throws LLMError when OpenRouter returns no content', async () => {
    fetchMock.mockOnce(async () => JSON.stringify({ choices: [] }));
    await expect(callModel([{ role: 'user', content: 'hi' }])).rejects.toThrow(
      'OpenRouter returned no content',
    );
  });

  test('throws LLMError on non-ok HTTP response', async () => {
    fetchMock.mockOnce(async () => ({ init: { status: 500 }, body: 'boom' }));
    await expect(callModel([{ role: 'user', content: 'hi' }])).rejects.toThrow(
      'OpenRouter returned 500',
    );
  });

  test('uses the default model when none is provided', async () => {
    fetchMock.mockOnce(async () => JSON.stringify({ choices: [{ message: { content: 'ok' } }] }));
    await callModel([{ role: 'user', content: 'hi' }]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining(DEFAULT_MODEL),
      }),
    );
  });

  test('sends the explicitly provided model in the request body', async () => {
    fetchMock.mockOnce(async () => JSON.stringify({ choices: [{ message: { content: 'ok' } }] }));
    const result = await callModel([{ role: 'user', content: 'hi' }], 'anthropic/claude-haiku');
    expect(result).toBe('ok');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        body: expect.stringContaining('anthropic/claude-haiku'),
      }),
    );
  });
});
