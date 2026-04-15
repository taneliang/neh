import { FunctionHandler } from '../Handler';
import { redirect } from '../util';

const graphiteHomeUrl = 'https://app.graphite.com/';

const gp = new FunctionHandler(
  'navigates to Graphite, or converts a GitHub PR URL to a Graphite PR URL',
  (tokens) => {
    if (tokens && tokens.length > 0) {
      const firstToken = tokens[0];
      // https://github.com/{owner}/{repo}/pull/{number}
      const ghPrMatch = firstToken.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
      if (ghPrMatch) {
        const [, owner, repo, prNumber] = ghPrMatch;
        return redirect(`https://app.graphite.com/github/pr/${owner}/${repo}/${prNumber}`);
      }
    }
    return redirect(graphiteHomeUrl);
  },
);

export default gp;
