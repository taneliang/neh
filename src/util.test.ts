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
    expect(extractQueryFromUrl('https://example.com', false)).toEqual('');
    expect(extractQueryFromUrl('https://example.com/', false)).toEqual('');
  });

  test('should return query-encoded query from path if present', () => {
    expect(extractQueryFromUrl('https://example.com/cmd+token', true)).toEqual('cmd token');

    expect(extractQueryFromUrl('https://example.com/d+1%2B2', true)).toEqual('d 1+2');

    expect(extractQueryFromUrl('https://example.com/cmd+https://derp.com', true)).toEqual(
      'cmd https://derp.com',
    );

    expect(
      extractQueryFromUrl('https://example.com/cmd+https://derp.com/search?q=query', true),
    ).toEqual('cmd https://derp.com/search?q=query');

    expect(
      extractQueryFromUrl('https://example.com/cmd+https://derp.com/search#query', true),
    ).toEqual('cmd https://derp.com/search#query');
  });

  test('should return path-encoded query from path if present', () => {
    expect(extractQueryFromUrl('https://example.com/cmd%20token', false)).toEqual('cmd token');

    expect(extractQueryFromUrl('https://example.com/d%201+2', false)).toEqual('d 1+2');

    expect(extractQueryFromUrl('https://example.com/cmd%20https://derp.com', false)).toEqual(
      'cmd https://derp.com',
    );

    expect(
      extractQueryFromUrl('https://example.com/cmd%20https://derp.com/search?q=query', false),
    ).toEqual('cmd https://derp.com/search?q=query');

    expect(
      extractQueryFromUrl('https://example.com/cmd%20https://derp.com/search#query', false),
    ).toEqual('cmd https://derp.com/search#query');
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
