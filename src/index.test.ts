import { makeCloudflareWorkerRequest } from 'cloudflare-worker-mock';
import '.'; // register the fetch event listener

async function getResponse(requestInfo: RequestInfo): Promise<Response> {
  const request = makeCloudflareWorkerRequest(requestInfo);
  return await (
    self as unknown as { trigger: (event: string, req: Request) => Promise<Response> }
  ).trigger('fetch', request);
}

describe('neh', () => {
  // Ensure that test env has been set up correctly.
  test('should add listeners', async () => {
    expect(
      (self as unknown as { listeners: Map<string, unknown> }).listeners.get('fetch'),
    ).toBeDefined();
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
    '1 + 1',
    'drive 2',
    'drive',
    'ip',
    "lyrics here's to never growing up",
    'npm p @babel/core',
    'search query',
    'trzh hong kong',
  ];

  testCases
    .map((inputStr) => inputStr.replace(/ /g, '%20'))
    .forEach((inputStr) => {
      test(`should handle "${inputStr}" "%20"-spaced query correctly`, async () => {
        const response = await getResponse(inputStr);
        expect(response).toMatchSnapshot();
      });
    });

  testCases
    .map((inputStr) => inputStr.replace(/\+/g, '%2B').replace(/ /g, '+'))
    .forEach((inputStr) => {
      test(`should handle "${inputStr}" "+"-spaced query correctly`, async () => {
        const response = await getResponse(
          new Request(inputStr, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:85.0) Gecko/20100101 Firefox/85.0',
            },
          }),
        );
        expect(response).toMatchSnapshot();
      });
    });
});
