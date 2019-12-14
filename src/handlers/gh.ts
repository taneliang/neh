import { CommandHandler, RedirectHandler } from '../Handler';
import {
  SearchEngineHandler,
  makeParamBasedSearchEngine,
  makePathBasedSearchEngine,
} from '../SearchEngineHandler';

const gh = new CommandHandler();
const ghHomeUrl = 'https://github.com/';

gh.setNothingHandler(new RedirectHandler('navigates to GitHub', ghHomeUrl));

gh.setDefaultHandler(
  new SearchEngineHandler(
    'does a GitHub search',
    makeParamBasedSearchEngine(ghHomeUrl, 'https://github.com/search', 'q'),
  ),
);

const ghPathEngine = makePathBasedSearchEngine(
  ghHomeUrl,
  null,
  [0, 1], // username/repo
);

gh.addHandler('p', new SearchEngineHandler('navigates to a GitHub user profile', ghPathEngine));

gh.addHandler('r', new SearchEngineHandler('navigates to a GitHub repo', ghPathEngine));

export default gh;
