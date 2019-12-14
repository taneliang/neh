import { CommandHandler, RedirectHandler } from '../Handler';
import {
  SearchEngineHandler,
  makeParamBasedSearchEngine,
  makePathBasedSearchEngine,
} from '../SearchEngineHandler';

const yarn = new CommandHandler();
const yarnHomeUrl = 'https://www.yarnpkg.com/en/';

yarn.setNothingHandler(new RedirectHandler('navigates to Yarn', yarnHomeUrl));

yarn.setDefaultHandler(
  new SearchEngineHandler(
    'does a Yarn package search',
    makeParamBasedSearchEngine(yarnHomeUrl, 'https://yarnpkg.com/en/packages', 'q'),
  ),
);

yarn.addHandler(
  'p',
  new SearchEngineHandler(
    'navigates to a Yarn package',
    makePathBasedSearchEngine(
      yarnHomeUrl,
      'https://yarnpkg.com/en/package/',
      [2, 3], // Account for @org/pkg-format package names
    ),
  ),
);

export default yarn;
