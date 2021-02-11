import { jiraTicketNumberHandlerFn } from './jira';

describe(jiraTicketNumberHandlerFn, () => {
  test('should return error if no tokens provided', async () => {
    const response = await jiraTicketNumberHandlerFn([]);
    expect(response.status).toBe(400);
  });

  test('should return error if provided token is not a Jira token', async () => {
    const response = await jiraTicketNumberHandlerFn(['gravy', '1611']);
    expect(response.status).toBe(400);
  });

  test('should redirect if provided token is a Jira ticket number', async () => {
    const response = await jiraTicketNumberHandlerFn(['74656']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://ironcladapp.atlassian.net/browse/IRON-74656"`,
    );
  });

  test('should redirect if provided token is a Jira token', async () => {
    const response = await jiraTicketNumberHandlerFn(['iron-1701']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://ironcladapp.atlassian.net/browse/IRON-1701"`,
    );
  });
});
