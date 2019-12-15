import { CommandHandler } from '../Handler';
import {
  SearchEngineHandler,
  makeAppendBasedSearchEngine,
  makeHashBasedSearchEngine,
  makeParamBasedSearchEngine,
} from '../SearchEngineHandler';

const docs = new CommandHandler();

docs.setDefaultHandler(
  new SearchEngineHandler(
    'does a DuckDuckGo search',
    makeParamBasedSearchEngine('https://duckduckgo.com/', null, 'q'),
  ),
);

docs.addHandler(
  'apple',
  new SearchEngineHandler(
    'does a search of Apple Developer documentation',
    makeParamBasedSearchEngine(
      'https://developer.apple.com/documentation',
      'https://developer.apple.com/search/',
      'q',
    ),
  ),
);

docs.addHandler(
  'caniuse',
  new SearchEngineHandler(
    'does a "Can I Use" search',
    makeAppendBasedSearchEngine('https://caniuse.com/', 'https://caniuse.com/#search='),
  ),
);

docs.addHandler(
  'lodash',
  new SearchEngineHandler(
    'navigates to a Lodash method',
    makeHashBasedSearchEngine('https://lodash.com/docs', null),
  ),
);

docs.addHandler(
  'mdn',
  new SearchEngineHandler(
    'does an MDN web docs search',
    makeParamBasedSearchEngine(
      'https://developer.mozilla.org/en-US/docs/Web/API',
      'https://developer.mozilla.org/en-US/search',
      'q',
    ),
  ),
);

docs.addHandler(
  'np',
  new SearchEngineHandler(
    'does a NumPy docs search',
    makeParamBasedSearchEngine(
      'https://docs.scipy.org/doc/numpy',
      'https://docs.scipy.org/doc/numpy/search.html',
      'q',
    ),
  ),
);

docs.addHandler(
  'pytorch',
  new SearchEngineHandler(
    'does a PyTorch docs search',
    makeParamBasedSearchEngine(
      'https://pytorch.org/docs',
      'https://pytorch.org/docs/master/search.html',
      'q',
    ),
  ),
);

docs.addHandler(
  'scipy',
  new SearchEngineHandler(
    'does a SciPy docs search',
    makeParamBasedSearchEngine(
      'https://docs.scipy.org/doc/scipy/reference/',
      'https://docs.scipy.org/doc/scipy/reference/search.html',
      'q',
    ),
  ),
);

docs.addHandler(
  'tf',
  new SearchEngineHandler(
    'does a Tensorflow docs search',
    makeParamBasedSearchEngine(
      'https://www.tensorflow.org/api_docs/python/tf',
      'https://www.tensorflow.org/s/results',
      'q',
    ),
  ),
);

export default docs;
