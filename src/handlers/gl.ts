import { CommandHandler, RedirectHandler } from '../Handler';
import {
  SearchEngineHandler,
  makeParamBasedSearchEngine,
  makePathBasedSearchEngine,
} from '../SearchEngineHandler';

const gl = new CommandHandler();
const glHomeUrl = 'https://gitlab.com/';

gl.setNothingHandler(new RedirectHandler('navigates to GitLab', glHomeUrl));

gl.setDefaultHandler(
  new SearchEngineHandler(
    'does a GitLab search',
    makeParamBasedSearchEngine(glHomeUrl, 'https://gitlab.com/search', 'search'),
  ),
);

const glPathEngine = makePathBasedSearchEngine(
  glHomeUrl,
  null,
  [0, 1, 2, 3, 4, 5, 6, 7], // GitLab supports nesting, so we'll just have to whack a bunch of indices
);

gl.addHandler('p', new SearchEngineHandler('navigates to a GitLab user profile', glPathEngine));

gl.addHandler('r', new SearchEngineHandler('navigates to a GitLab repo', glPathEngine));

export default gl;
