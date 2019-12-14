import { emptyArray, extractQueryFromUrl, tokenizeQuery } from './util';

describe(emptyArray, () => {
  test('should empty array in place', () => {
    const a = [1, 2, 3];
    emptyArray(a);
    expect(a).toEqual([]);
  });

  test('should do nothing if array is empty', () => {
    const a: string[] = [];
    emptyArray(a);
    expect(a).toEqual([]);
  });
});

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
