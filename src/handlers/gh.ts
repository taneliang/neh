import { CommandHandler, FunctionHandler, RedirectHandler, HandlerFn } from '../Handler';
import {
  SearchEngineHandler,
  makeParamBasedSearchEngine,
  SearchEngine,
} from '../SearchEngineHandler';
import { redirect } from '../util';

const gh = new CommandHandler();
const ghHomeUrl = 'https://github.com/';

gh.setNothingHandler(new RedirectHandler('navigates to GitHub', ghHomeUrl));

const githubSearchEngine = makeParamBasedSearchEngine(ghHomeUrl, 'https://github.com/search', 'q');

const ghDefaultSearchEngine: SearchEngine = {
  ...githubSearchEngine,
  generateSearchUrl(tokens): string {
    // https://app.graphite.com/github/pr/{owner}/{repo}/{number}
    const graphiteMatch = tokens[0].match(
      /^https:\/\/app\.graphite\.com\/github\/pr\/([^/]+)\/([^/]+)\/(\d+)/,
    );
    if (graphiteMatch) {
      const [, owner, repo, prNumber] = graphiteMatch;
      return `https://github.com/${owner}/${repo}/pull/${prNumber}`;
    }
    return githubSearchEngine.generateSearchUrl(tokens);
  },
};

gh.setDefaultHandler(
  new SearchEngineHandler(
    'does a GitHub search, or converts a Graphite PR URL to a GitHub PR URL',
    ghDefaultSearchEngine,
  ),
);

const makeGitHubSearchHandlerFn =
  (resource: string): HandlerFn =>
  async (tokens): Promise<Response> => {
    const query = tokens.join('+');
    const url = new URL(`https://api.github.com/search/${resource}`);
    url.searchParams.set('q', query);
    url.searchParams.set('per_page', '1');
    const searchUrl = url.toString();

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'neh.eltan.net',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      return new Response(
        `GitHub API returned ${response.status} ${response.statusText}. ${body}`,
        {
          status: 500,
        },
      );
    }

    const { items } = (await response.json()) as { items: { html_url: string }[] };
    if (items.length === 0) {
      return new Response(`No ${resource} found for query ${query}.`, { status: 500 });
    }

    return redirect(items[0].html_url);
  };

gh.addHandler(
  'p',
  new FunctionHandler(
    'navigates to a GitHub user/organization profile',
    makeGitHubSearchHandlerFn('users'),
  ),
);

gh.addHandler(
  'r',
  new FunctionHandler(
    'navigates to a GitHub repository',
    makeGitHubSearchHandlerFn('repositories'),
  ),
);

export default gh;
