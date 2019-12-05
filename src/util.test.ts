import { extractQueryFromUrl, tokenizeQuery } from './util';

describe(extractQueryFromUrl, () => {
  test('should return empty string if no query', () => {
    expect(extractQueryFromUrl('https://example.com')).toEqual('');
    expect(extractQueryFromUrl('https://example.com/')).toEqual('');
  });

  test('should return query from path if present', () => {
    expect(extractQueryFromUrl('https://example.com/cmd%20token')).toEqual('cmd token');

    expect(extractQueryFromUrl('https://example.com/cmd%20https://derp.com')).toEqual(
      'cmd https://derp.com',
    );

    expect(
      extractQueryFromUrl('https://example.com/cmd%20https://derp.com/search?q=query'),
    ).toEqual('cmd https://derp.com/search?q=query');

    expect(extractQueryFromUrl('https://example.com/cmd%20https://derp.com/search#query')).toEqual(
      'cmd https://derp.com/search#query',
    );
  });
});

describe(tokenizeQuery, () => {
  test('should return query tokens', () => {
    expect(tokenizeQuery('t1 / https://url/?q=a+b')).toEqual(['t1', '/', 'https://url/?q=a+b']);
  });

  test('should return empty array for empty query', () => {
    expect(tokenizeQuery('')).toEqual([]);
  });
});
