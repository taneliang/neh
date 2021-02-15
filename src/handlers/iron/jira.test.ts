import { jiraSearchEngineHandler } from './jira';

describe('jiraSearchEngineHandler', () => {
  test('should redirect to Jira if no tokens provided', async () => {
    const response = await jiraSearchEngineHandler.handle([]);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://ironcladapp.atlassian.net/jira/your-work"`,
    );
  });

  test('should redirect to Jira search if provided token is not a Jira token', async () => {
    const response = await jiraSearchEngineHandler.handle(['gravy', '1611']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://ironcladapp.atlassian.net/secure/QuickSearch.jspa?searchString=gravy+1611"`,
    );
  });

  test('should redirect to ticket if provided token is a Jira ticket number', async () => {
    const response = await jiraSearchEngineHandler.handle(['74656']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://ironcladapp.atlassian.net/browse/IRON-74656"`,
    );
  });

  test('should redirect to ticket if provided token is a Jira token', async () => {
    const response = await jiraSearchEngineHandler.handle(['iron-1701']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://ironcladapp.atlassian.net/browse/IRON-1701"`,
    );
  });
});
