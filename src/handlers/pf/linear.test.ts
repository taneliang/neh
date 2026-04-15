import { linearIssueHandler } from './linear';
import linearHandler from './linear';

describe('linearIssueHandler', () => {
  test('should redirect to issue if provided token is a bare number', async () => {
    const response = await linearIssueHandler.handle(['1234']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://linear.app/paraform/issue/ENG-1234"`,
    );
  });

  test('should redirect to issue if provided token is a full ENG- identifier', async () => {
    const response = await linearIssueHandler.handle(['ENG-5678']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://linear.app/paraform/issue/ENG-5678"`,
    );
  });

  test('should uppercase ENG- identifiers', async () => {
    const response = await linearIssueHandler.handle(['eng-42']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(
      `"https://linear.app/paraform/issue/ENG-42"`,
    );
  });

  test('should redirect to Linear home if token is not a number or ENG- identifier', async () => {
    const response = await linearIssueHandler.handle(['somequery']);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(`"https://linear.app/paraform"`);
  });
});

describe('linear handler (nothing handler)', () => {
  test('should redirect to Linear home if no tokens provided', async () => {
    const response = await linearHandler.handle([]);
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toMatchInlineSnapshot(`"https://linear.app/paraform"`);
  });
});
