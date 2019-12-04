import { searchEngineTransform } from './util';

describe(searchEngineTransform, () => {
  const altEngines = ['https://alt1.com/r/', 'alt2', 'alt3', 'com'];
  const intendedBase = 'https://intended.com/?q=';

  it('should return new URL if original URL is prefixed with an alt engine base URL', () => {
    const originalUrl = 'https://alt1.com/r/derp';
    const expectedUrl = 'https://intended.com/?q=derp';
    expect(searchEngineTransform(originalUrl, altEngines, intendedBase)).toBe(expectedUrl);
  });

  it('should return null if original URL is not an alt engine query', () => {
    const originalUrl = 'https://alt2.com/r/derp';
    const expectedUrl = null;
    expect(searchEngineTransform(originalUrl, altEngines, intendedBase)).toBe(expectedUrl);
  });
});
