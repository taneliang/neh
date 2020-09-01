import { CommandHandler, RedirectHandler } from '../Handler';
import {
  SearchEngineHandler,
  makeParamBasedSearchEngine,
  makePathBasedSearchEngine,
} from '../SearchEngineHandler';

const tw = new CommandHandler();
const twHomeUrl = 'https://twitter.com/';

tw.setNothingHandler(new RedirectHandler('navigates to Twitter', twHomeUrl));

tw.setDefaultHandler(
  new SearchEngineHandler(
    'does a Twitter search',
    makeParamBasedSearchEngine(twHomeUrl, 'https://twitter.com/search', 'q'),
  ),
);

tw.addHandler(
  'p',
  new SearchEngineHandler(
    'navigates to a Twitter user profile',
    makePathBasedSearchEngine('https://twitter.com/taneliang', twHomeUrl, [0]),
  ),
);

export default tw;
