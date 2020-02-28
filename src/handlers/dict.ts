import { CommandHandler } from '../Handler';
import { SearchEngineHandler, makePathBasedSearchEngine } from '../SearchEngineHandler';

const dict = new CommandHandler();

const websterHandler = new SearchEngineHandler(
  'navigates to the Merriam-Webster entry for a provided term',
  makePathBasedSearchEngine(
    'https://www.merriam-webster.com/',
    'https://www.merriam-webster.com/dictionary/',
    [1],
  ),
);

dict.setDefaultHandler(websterHandler);

dict.addHandler('webster', websterHandler);

dict.addHandler(
  'cambridge',
  new SearchEngineHandler(
    'navigates to the Cambridge Dictionary entry for a provided term',
    makePathBasedSearchEngine(
      'https://dictionary.cambridge.org/',
      'https://dictionary.cambridge.org/dictionary/english/',
      [2],
    ),
  ),
);

export default dict;
