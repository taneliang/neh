import {
  SearchEngine,
  SearchEngineHandler,
  makeAppendBasedSearchEngine,
  makeHashBasedSearchEngine,
  makeParamBasedSearchEngine,
  makePathBasedSearchEngine,
  searchEngines,
} from './SearchEngineHandler';
import { emptyArray } from './util';

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

    test('should return null if search URL has no query', () => {
      const engine = makeAppendBasedSearchEngine(complexBaseUrl, null);
      expect(engine.parseSearchUrl?.(complexBaseUrl)).toBeNull();
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

describe(SearchEngineHandler, () => {
  beforeEach(() => {
    emptyArray(searchEngines);
  });

  describe('constructor', () => {
    const simpleEngine: SearchEngine = {
      defaultUrl,
      generateSearchUrl: () => '',
    };

    test('should passthrough docstring', () => {
      const docstring = "Don't be evil";
      const handler = new SearchEngineHandler(docstring, simpleEngine);
      expect(handler.doc).toEqual(docstring);
    });

    test('should register search engine', () => {
      expect(searchEngines).toEqual([]);
      new SearchEngineHandler('', simpleEngine);
      expect(searchEngines).toEqual([simpleEngine]);
    });
  });

  describe(SearchEngineHandler.prototype.handle, () => {
    type MockSearchEngine = SearchEngine & {
      generateSearchUrl: jest.Mock;
      parseSearchUrl?: jest.Mock;
    };

    let noParseEngine: MockSearchEngine;
    let parsableEngine1: MockSearchEngine;
    let parsableEngine2: MockSearchEngine;

    beforeEach(() => {
      noParseEngine = {
        defaultUrl,
        generateSearchUrl: jest.fn(),
      };
      parsableEngine1 = {
        defaultUrl,
        generateSearchUrl: jest.fn(),
        parseSearchUrl: jest.fn(),
      };
      parsableEngine2 = {
        defaultUrl,
        generateSearchUrl: jest.fn(),
        parseSearchUrl: jest.fn(),
      };
    });

    test('should redirect to defaultUrl if no tokens', async () => {
      const handler = new SearchEngineHandler('', noParseEngine);
      const response = await handler.handle([]);
      expect(response.status).toEqual(302);
      expect(response.headers.get('location')).toBe(defaultUrl);
    });

    test('should call generateSearchUrl with all search tokens if not transformable', async () => {
      // Register other engines
      new SearchEngineHandler('', noParseEngine);
      new SearchEngineHandler('', parsableEngine1);

      const handler = new SearchEngineHandler('', parsableEngine2);
      const response = await handler.handle(queryTokens);
      expect(response.status).toEqual(302);
      expect(parsableEngine1.parseSearchUrl).toBeCalledWith('query string');
      expect(parsableEngine2.parseSearchUrl).toBeCalledWith('query string');
      expect(parsableEngine2.generateSearchUrl).toBeCalledWith(queryTokens);
    });

    test('should call generateSearchUrl with all transformed query if transformable', async () => {
      // Register other engines
      new SearchEngineHandler('', noParseEngine);
      new SearchEngineHandler('', parsableEngine1);

      const transformedQuery = 'transformed query';
      parsableEngine1.parseSearchUrl?.mockReturnValue(transformedQuery);

      const handler = new SearchEngineHandler('', parsableEngine2);
      const response = await handler.handle(queryTokens);
      expect(response.status).toEqual(302);
      expect(parsableEngine2.generateSearchUrl).toBeCalledWith([transformedQuery]);
    });
  });
});
