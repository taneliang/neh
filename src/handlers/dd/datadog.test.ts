import { DD_BASE, makeDatadogQuerySearchEngine } from './datadog';

describe(makeDatadogQuerySearchEngine, () => {
  const engine = makeDatadogQuerySearchEngine('/logs');

  describe('generateSearchUrl', () => {
    test('builds a query= URL with %20-encoded spaces', () => {
      expect(engine.generateSearchUrl(['status:error', 'service:paraform'])).toBe(
        `${DD_BASE}/logs?query=status%3Aerror%20service%3Aparaform`,
      );
    });
  });

  describe('parseSearchUrl', () => {
    test('extracts and decodes the query from a Datadog URL', () => {
      expect(engine.parseSearchUrl?.(`${DD_BASE}/logs?query=status%3Aerror&cols=host`)).toBe(
        'status:error',
      );
    });

    test('returns null for a non-Datadog URL', () => {
      expect(engine.parseSearchUrl?.('https://example.com/logs?query=foo')).toBeNull();
    });

    test('returns null when there is no query param', () => {
      expect(engine.parseSearchUrl?.(`${DD_BASE}/logs?cols=host`)).toBeNull();
    });

    test('returns null for an empty query param', () => {
      expect(engine.parseSearchUrl?.(`${DD_BASE}/logs?query=&cols=host`)).toBeNull();
    });
  });
});
