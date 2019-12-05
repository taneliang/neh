import {
  makeHashBasedSearchEngine,
  makeParamBasedSearchEngine,
  SearchEngineHandler,
} from './SearchEngineHandler';

const defaultUrl = 'https://fancy.search';
const baseUrl = 'https://fancy.search/search';
const queryTokens = ['query', 'string'];

describe(makeHashBasedSearchEngine, () => {
  describe('defaultUrl', () => {
    test('should passthrough defaultUrl', () => {
      const engine = makeHashBasedSearchEngine(defaultUrl, null);
      expect(engine.defaultUrl).toEqual(defaultUrl);
    });
  });

  describe('generateSearchUrl', () => {
    test('should use baseURL', () => {
      const engine = makeHashBasedSearchEngine(defaultUrl, baseUrl);
      expect(engine.generateSearchUrl(queryTokens)).toEqual(
        'https://fancy.search/search#query%20string',
      );
    });

    test('should use defaultUrl if baseURL is null', () => {
      const engine = makeHashBasedSearchEngine(defaultUrl, null);
      expect(engine.generateSearchUrl(queryTokens)).toEqual('https://fancy.search/#query%20string');
    });
  });

  describe('parseSearchUrl', () => {
    test('should return null if search URL does not belong to this engine', () => {
      const engine = makeHashBasedSearchEngine(defaultUrl, null);
      expect(engine.parseSearchUrl?.('https://despicable.search#query%20string')).toBeNull();
    });

    test('should return null if no hash is present', () => {
      const engine = makeHashBasedSearchEngine(defaultUrl, baseUrl);
      expect(engine.parseSearchUrl?.(baseUrl)).toBeNull();
    });

    test('should return null if hash is empty', () => {
      const engine = makeHashBasedSearchEngine(defaultUrl, baseUrl);
      expect(engine.parseSearchUrl?.('https://fancy.search/search#')).toBeNull();
    });

    test('should extract query if present', () => {
      const engine = makeHashBasedSearchEngine(defaultUrl, null);
      expect(engine.parseSearchUrl?.('https://fancy.search/#query%20string')).toEqual(
        'query string',
      );
    });
  });
});

describe(makeParamBasedSearchEngine, () => {
  describe('defaultUrl', () => {
    test('should passthrough defaultUrl', () => {
      const engine = makeParamBasedSearchEngine(defaultUrl, null, 'q');
      expect(engine.defaultUrl).toEqual(defaultUrl);
    });
  });

  describe('generateSearchUrl', () => {
    test('should use baseURL', () => {
      const engine = makeParamBasedSearchEngine(defaultUrl, baseUrl, 'q');
      expect(engine.generateSearchUrl(queryTokens)).toEqual(
        'https://fancy.search/search?q=query+string',
      );
    });

    test('should use defaultUrl if baseURL is null', () => {
      const engine = makeParamBasedSearchEngine(defaultUrl, null, 'q');
      expect(engine.generateSearchUrl(queryTokens)).toEqual('https://fancy.search/?q=query+string');
    });
  });

  describe('parseSearchUrl', () => {
    test('should return null if search URL does not belong to this engine', () => {
      const engine = makeParamBasedSearchEngine(defaultUrl, null, 'q');
      expect(engine.parseSearchUrl?.('https://despicable.search/?q=query+string')).toBeNull();
    });

    test('should return null if query param is not present', () => {
      const engine = makeParamBasedSearchEngine(defaultUrl, baseUrl, 'q');
      expect(engine.parseSearchUrl?.(baseUrl)).toBeNull();
    });

    test('should return null if query param is empty', () => {
      const engine = makeParamBasedSearchEngine(defaultUrl, baseUrl, 'q');
      expect(engine.parseSearchUrl?.('https://fancy.search/search?q=')).toBeNull();
    });

    test('should extract query if present', () => {
      const engine = makeParamBasedSearchEngine(defaultUrl, null, 'q');
      expect(engine.parseSearchUrl?.('https://fancy.search/?q=query+string')).toEqual(
        'query string',
      );
    });

    test('should only extract query even if other queries are present', () => {
      const engine = makeParamBasedSearchEngine(defaultUrl, null, 'q');
      expect(engine.parseSearchUrl?.('https://fancy.search/?fee=fi&q=query+string&fo=fum')).toEqual(
        'query string',
      );
    });
  });
});
