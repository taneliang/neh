import { CloudflareWorkerGlobalScope } from 'types-cloudflare-worker';
declare const self: CloudflareWorkerGlobalScope;

import { makeCloudflareWorkerRequest } from 'cloudflare-worker-mock';

async function getResponse(path: string): Promise<Response> {
  const request = makeCloudflareWorkerRequest(path);
  const responses = await self.trigger('fetch', request);
  return responses[0];
}

describe('neh', () => {
  beforeEach(() => {
    // Import and init the Worker.
    jest.requireActual('.');
  });

  // Ensure that test env has been set up correctly.
  test('should add listeners', async () => {
    expect(self.listeners.get('fetch')).toBeDefined();
  });

  test('should respond to OpenSearch endpoint', async () => {
    const response = await getResponse('/_opensearch');
    expect(response.status).toBe(200);
    const responseBody = await response.text();
    expect(responseBody).toContain('<?xml');
    expect(responseBody).toContain('OpenSearchDescription');
  });

  // Some test input
  const testCases = [
    '1+1',
    'drive 2',
    'drive',
    'gh r taneliang/neh',
    'ip',
    "lyrics here's to never growing up",
    'npm p @babel/core',
    'search query',
    'trzh hong kong',
  ];

  testCases.forEach((inputStr) => {
    test(`should handle "${inputStr}" correctly`, async () => {
      const response = await getResponse(inputStr);
      expect(response).toMatchSnapshot();
    });
  });
});
