import {
  makeAppendBasedSearchEngine,
  makeHashBasedSearchEngine,
  makeParamBasedSearchEngine,
  makePathBasedSearchEngine,
  SearchEngineHandler,
} from './SearchEngineHandler';

const defaultUrl = 'https://fancy.search/';
const baseUrl = 'https://fancy.search/search/';
const queryTokens = ['query', 'string'];

describe(makeAppendBasedSearchEngine, () => {
  const complexBaseUrl = 'https://fancy.search/s?q=a#b=c&d=';

  describe('defaultUrl', () => {
    test('should passthrough defaultUrl', () => {
      const engine = makeAppendBasedSearchEngine(defaultUrl, null);
      expect(engine.defaultUrl).toEqual(defaultUrl);
    });
  });

  describe('generateSearchUrl', () => {
    test('should use baseURL', () => {
      const engine = makeAppendBasedSearchEngine(defaultUrl, baseUrl);
      expect(engine.generateSearchUrl(queryTokens)).toEqual(
        'https://fancy.search/search/query%20string',
      );
    });

    test('should use defaultUrl if baseURL is null', () => {
      const engine = makeAppendBasedSearchEngine(complexBaseUrl, null);
      expect(engine.generateSearchUrl(queryTokens)).toEqual(
        'https://fancy.search/s?q=a#b=c&d=query%20string',
      );
    });
  });

  describe('parseSearchUrl', () => {
    test('should return null if search URL is not prefixed with base URL', () => {
      const engine = makeAppendBasedSearchEngine(complexBaseUrl, null);
      expect(engine.parseSearchUrl?.('https://fancy.search/s?q=a#d=query%20string')).toBeNull();
    });

    test('should extract query if present', () => {
      const engine = makeAppendBasedSearchEngine(complexBaseUrl, null);
      expect(engine.parseSearchUrl?.('https://fancy.search/s?q=a#b=c&d=query%20string')).toEqual(
        'query string',
      );
    });
  });
});

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
        'https://fancy.search/search/#query%20string',
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
      expect(engine.parseSearchUrl?.('https://despicable.search/#query%20string')).toBeNull();
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
        'https://fancy.search/search/?q=query+string',
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

describe(makePathBasedSearchEngine, () => {
  describe('defaultUrl', () => {
    test('should passthrough defaultUrl', () => {
      const engine = makePathBasedSearchEngine(defaultUrl, null, []);
      expect(engine.defaultUrl).toEqual(defaultUrl);
    });
  });

  describe('generateSearchUrl', () => {
    test('should use baseURL', () => {
      const engine = makePathBasedSearchEngine(defaultUrl, baseUrl, []);
      expect(engine.generateSearchUrl(queryTokens)).toEqual(
        'https://fancy.search/search/query/string',
      );
    });

    test('should use defaultUrl if baseURL is null', () => {
      const engine = makePathBasedSearchEngine(defaultUrl, null, []);
      expect(engine.generateSearchUrl(queryTokens)).toEqual('https://fancy.search/query/string');
    });
  });

  describe('parseSearchUrl', () => {
    test('should return null if search URL does not belong to this engine', () => {
      const engine = makePathBasedSearchEngine(defaultUrl, null, [0]);
      expect(engine.parseSearchUrl?.('https://despicable.search/query/string')).toBeNull();
    });

    test('should return null if no path is present', () => {
      const engine = makePathBasedSearchEngine('https://fancy.search/', null, [0]);
      expect(engine.parseSearchUrl?.('https://fancy.search/')).toBeNull();
    });

    test('should return null if no interesting path segment is present', () => {
      const engine = makePathBasedSearchEngine(defaultUrl, baseUrl, [1]);
      expect(engine.parseSearchUrl?.('https://fancy.search/search/')).toBeNull();
    });

    test('should extract null if no interested path segments', () => {
      const engine = makePathBasedSearchEngine(defaultUrl, null, []);
      expect(engine.parseSearchUrl?.('https://fancy.search/search/query/string')).toBeNull();
    });

    test('should extract only specified path segments', () => {
      const engine = makePathBasedSearchEngine(defaultUrl, null, [1]);
      expect(engine.parseSearchUrl?.('https://fancy.search/search/query/string')).toEqual('query');
    });

    test('should extract >1 path segments if present', () => {
      const engine = makePathBasedSearchEngine(defaultUrl, null, [1, 2]);
      expect(engine.parseSearchUrl?.('https://fancy.search/search/query/string')).toEqual(
        'query/string',
      );
    });

    test('should extract >1 path segments in order of indices', () => {
      const engine = makePathBasedSearchEngine(defaultUrl, null, [2, 1]);
      expect(engine.parseSearchUrl?.('https://fancy.search/search/query/string')).toEqual(
        'string/query',
      );
    });

    test('should extract path segments even if some are not present', () => {
      const engine = makePathBasedSearchEngine(defaultUrl, null, [1, 9000]);
      expect(engine.parseSearchUrl?.('https://fancy.search/search/query/string')).toEqual('query');
    });
  });
});
