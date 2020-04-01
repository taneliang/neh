import { CommandHandler, FunctionHandler, RedirectHandler, HandlerFn } from '../Handler';
import { SearchEngineHandler, makeParamBasedSearchEngine } from '../SearchEngineHandler';
import { redirect } from '../util';

const gh = new CommandHandler();
const ghHomeUrl = 'https://github.com/';

gh.setNothingHandler(new RedirectHandler('navigates to GitHub', ghHomeUrl));

gh.setDefaultHandler(
  new SearchEngineHandler(
    'does a GitHub search',
    makeParamBasedSearchEngine(ghHomeUrl, 'https://github.com/search', 'q'),
  ),
);

const makeGitHubSearchHandlerFn = (resource: string): HandlerFn => async (
  tokens,
): Promise<Response> => {
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
    return new Response(`GitHub API returned ${response.status} ${response.statusText}. ${body}`, {
      status: 500,
    });
  }

  const { items } = await response.json();
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
