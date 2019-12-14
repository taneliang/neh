import { CommandHandler, RedirectHandler } from '../Handler';
import {
  SearchEngineHandler,
  makeParamBasedSearchEngine,
  makePathBasedSearchEngine,
} from '../SearchEngineHandler';

const npm = new CommandHandler();
const npmHomeUrl = 'https://www.npmjs.com';

npm.setNothingHandler(new RedirectHandler('navigates to NPM', npmHomeUrl));

npm.setDefaultHandler(
  new SearchEngineHandler(
    'does an NPM search',
    makeParamBasedSearchEngine(npmHomeUrl, 'https://www.npmjs.com/search', 'q'),
  ),
);

npm.addHandler(
  'p',
  new SearchEngineHandler(
    'navigates to an NPM package',
    makePathBasedSearchEngine(
      npmHomeUrl,
      'https://www.npmjs.com/package/',
      [1, 2], // Account for @org/pkg-format package names
    ),
  ),
);

export default npm;
