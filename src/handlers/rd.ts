import { CommandHandler, RedirectHandler } from '../Handler';
import {
  SearchEngineHandler,
  makeParamBasedSearchEngine,
  makePathBasedSearchEngine,
} from '../SearchEngineHandler';

const rd = new CommandHandler();
const redditHomeUrl = 'https://www.reddit.com';

rd.setNothingHandler(new RedirectHandler('navigates to Reddit', redditHomeUrl));

rd.setDefaultHandler(
  new SearchEngineHandler(
    'does a Reddit search',
    makeParamBasedSearchEngine(redditHomeUrl, 'https://www.reddit.com/search', 'q'),
  ),
);

rd.addHandler(
  'r',
  new SearchEngineHandler(
    'navigates to a subreddit',
    makePathBasedSearchEngine(redditHomeUrl, 'https://www.reddit.com/r/', [1]),
  ),
);

export default rd;
