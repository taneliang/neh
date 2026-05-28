import lHandler from './l';

function location(...tokens: string[]): Promise<string | null> {
  return lHandler.handle(tokens).then((response) => {
    expect(response.status).toBe(302);
    return response.headers.get('location');
  });
}

describe('l handler', () => {
  test('replaces the host of a URL with localhost:3000 over http', async () => {
    expect(await location('https://whatever.com/abc')).toBe('http://localhost:3000/abc');
  });

  test('preserves query and hash', async () => {
    expect(await location('https://whatever.com/abc?x=1#frag')).toBe(
      'http://localhost:3000/abc?x=1#frag',
    );
  });

  test('uses https and a custom port with `s` and a number', async () => {
    expect(await location('s', '80')).toBe('https://localhost:80');
  });

  test('uses a custom port with http by default', async () => {
    expect(await location('5243')).toBe('http://localhost:5243');
  });

  test('uses https on the default port with just `s`', async () => {
    expect(await location('s')).toBe('https://localhost:3000');
  });

  test('defaults to http://localhost:3000 with no tokens', async () => {
    expect(await location()).toBe('http://localhost:3000');
  });

  test('combines protocol, port, and a URL path in any order', async () => {
    expect(await location('s', '8080', 'https://whatever.com/abc')).toBe(
      'https://localhost:8080/abc',
    );
  });

  test('handles a bare host with no path', async () => {
    expect(await location('https://whatever.com')).toBe('http://localhost:3000');
  });

  test('handles a bare path with no host', async () => {
    expect(await location('/abc')).toBe('http://localhost:3000/abc');
  });

  describe('real host mode', () => {
    test('rewrites a localhost URL to a host over https, appending .com', async () => {
      expect(await location('eliangtan', 'http://localhost:23423/abc')).toBe(
        'https://eliangtan.com/abc',
      );
    });

    test('appends .com to a subdomain host with no TLD', async () => {
      expect(await location('www.eliangtan', 'https://localhost:22/abc')).toBe(
        'https://www.eliangtan.com/abc',
      );
    });

    test('leaves a host that already has a valid TLD alone', async () => {
      expect(await location('eliang.science', 'https://localhost/abc')).toBe(
        'https://eliang.science/abc',
      );
    });

    test('navigates to a bare host with no path', async () => {
      expect(await location('eliangtan')).toBe('https://eliangtan.com');
    });

    test('ignores `s` and port tokens in real host mode', async () => {
      expect(await location('s', '80', 'eliangtan', '/abc')).toBe('https://eliangtan.com/abc');
    });
  });
});
