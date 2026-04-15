import { CommandHandler, RedirectHandler } from '../../Handler';
import {
  SearchEngineHandler,
  makeParamBasedSearchEngine,
  makeAppendBasedSearchEngine,
} from '../../SearchEngineHandler';

function makeRepoHandler(repoUrl: string): CommandHandler {
  const repoPath = repoUrl.replace('https://github.com/', '');
  const gh = new CommandHandler();

  gh.setNothingHandler(new RedirectHandler('navigates to the GitHub repo', repoUrl));

  gh.addHandler(
    'f',
    new SearchEngineHandler(
      'does a filename search of the GitHub repo',
      makeAppendBasedSearchEngine(
        repoUrl,
        `https://github.com/search?type=code&q=repo%3a${repoPath}%20filename%3a`,
      ),
    ),
  );

  const baseSearchEngine = makeAppendBasedSearchEngine(
    `${repoUrl}/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc`,
    `${repoUrl}/pulls?q=is%3Apr+sort%3Aupdated-desc+`,
  );
  const prHandler = new SearchEngineHandler('navigates to a specific PR or does a PR search', {
    ...baseSearchEngine,
    generateSearchUrl(tokens): string {
      const prNumberString = tokens[0];
      const prNumber = parseInt(prNumberString, 10);
      if (!isNaN(prNumber)) {
        return `${repoUrl}/pull/${prNumber}`;
      }
      return baseSearchEngine.generateSearchUrl(tokens);
    },
  });
  gh.setDefaultHandler(prHandler);
  gh.addHandler('pr', prHandler);

  gh.addHandler(
    's',
    new SearchEngineHandler(
      'does a string search of the GitHub repo',
      makeParamBasedSearchEngine(repoUrl, `${repoUrl}/search`, 'q'),
    ),
  );

  return gh;
}

const mainRepoUrl = 'https://github.com/paraform-xyz/paraform';
const infraRepoUrl = 'https://github.com/paraform-xyz/paraform-infra';

const gh = makeRepoHandler(mainRepoUrl);
gh.addHandler('infra', makeRepoHandler(infraRepoUrl));

export default gh;
