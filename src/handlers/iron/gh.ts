import { CommandHandler, RedirectHandler } from '../../Handler';
import {
  SearchEngineHandler,
  makeParamBasedSearchEngine,
  makeAppendBasedSearchEngine,
} from '../../SearchEngineHandler';

const gh = new CommandHandler();
const repoUrl = 'https://github.com/Ironclad/ironclad';

gh.setNothingHandler(new RedirectHandler('navigates to GitHub', repoUrl));

gh.addHandler(
  'f',
  new SearchEngineHandler(
    'does a filename search of the GitHub repo',
    makeAppendBasedSearchEngine(
      repoUrl,
      'https://github.com/search?type=code&q=repo%3aIronclad/ironclad%20filename%3a',
    ),
  ),
);

const prHandler = new SearchEngineHandler(
  'navigates to a pull request',
  makeAppendBasedSearchEngine(
    `${repoUrl}/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc`,
    `${repoUrl}/pull/`,
  ),
);
gh.setDefaultHandler(prHandler);
gh.addHandler('pr', prHandler);

gh.addHandler(
  's',
  new SearchEngineHandler(
    'does a string search of the GitHub repo',
    makeParamBasedSearchEngine(repoUrl, `${repoUrl}/search`, 'q'),
  ),
);

export default gh;
