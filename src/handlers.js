import { redirect } from './util';
import { openSearchAutodiscoveryLink } from './opensearch';

const docstrings = {
  d: 'does a DuckDuckGo search',
  fb: 'does a Facebook search',
  g: 'does a Google search',
  gh: 'navigates to GitHub or does a GitHub search',
  ghp: 'navigates to a GitHub user profile',
  ghr: 'navigates to a GitHub repo',
  ip: 'shows your current public IP address',
  list: 'show the list of methods you can use or search that list',
  lyrics: 'does a Genius lyric search',
  nm: 'does an NUSMods search',
  npm: 'does an NPM search',
  npmp: 'navigates to an NPM package',
  rd: 'does a Reddit search',
  rdr: 'navigates to a subreddit',
  rtm: 'navigates to Remember the Milk',
  wk: 'English Wikipedia search',
  yarn: 'does a Yarn package search',
  yarnp: 'navigates to a Yarn package',
  yt: 'does a YouTube search',
  yub: 'run a YubNub command',
};

const baseUrls = {
  d: 'https://duckduckgo.com/?q=',
  fb: 'https://www.facebook.com/search/top/?q=',
  g: 'https://www.google.com/search?q=',
  gh: 'https://github.com/search?q=',
  lyrics: 'https://genius.com/search?q=',
  nm: 'https://nusmods.com/modules?sem[0]=1&sem[1]=2&sem[2]=3&sem[3]=4&q=',
  npm: 'https://www.npmjs.com/search?q=',
  npmp: 'https://www.npmjs.com/package/',
  rd: 'https://www.reddit.com/search?q=',
  wk: 'https://en.wikipedia.org/w/index.php?search=',
  yarn: 'https://yarnpkg.com/en/packages?q=',
  yarnp: 'https://yarnpkg.com/en/package/',
  yt: 'https://www.youtube.com/results?search_query=',
  yub: 'https://yubnub.org/parser/parse?command=',
};

const allBaseUrls = Object.values(baseUrls);

export const handlers = {
  d(tokens) {
    return redirect('https://duckduckgo.com', baseUrls.d, tokens, allBaseUrls);
  },

  fb(tokens) {
    return redirect('https://www.facebook.com', baseUrls.fb, tokens, allBaseUrls);
  },

  g(tokens) {
    return redirect('https://google.com', baseUrls.g, tokens, allBaseUrls);
  },

  gh(tokens) {
    return redirect('https://github.com', baseUrls.gh, tokens, allBaseUrls);
  },

  ghp(tokens) {
    return redirect('https://github.com/taneliang', 'https://github.com/', tokens);
  },

  ghr(tokens) {
    return redirect('https://github.com/taneliang/neh', 'https://github.com/', tokens);
  },

  ip() {
    return redirect('https://icanhazip.com');
  },

  list() {
    const commands = Object.keys(handlers);

    const docrows = commands
      .map((c) => {
        if (c in docstrings) {
          return `<li><strong>${c}</strong>: ${docstrings[c]}</li>`;
        }
        return `<li><strong>${c}</strong>: <i>I also don't know what this does tbh</i></li>`;
      })
      .join('');

    const init = {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    };

    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>neh commands</title>
          ${openSearchAutodiscoveryLink}
        </head>
        <body>
          <h1>neh command list</h1>
          <ul>
            ${docrows}
          </ul>
        </body>
      </html>
    `,
      init,
    );
  },

  lyrics(tokens) {
    return redirect('https://genius.com', baseUrls.lyrics, tokens, allBaseUrls);
  },

  nm(tokens) {
    return redirect('https://nusmods.com', baseUrls.nm, tokens, allBaseUrls);
  },

  npm(tokens) {
    return redirect('https://www.npmjs.com', baseUrls.npm, tokens, allBaseUrls);
  },

  npmp(tokens) {
    return redirect('https://www.npmjs.com', baseUrls.npmp, tokens, allBaseUrls);
  },

  rd(tokens) {
    return redirect('https://www.reddit.com', baseUrls.rd, tokens, allBaseUrls);
  },

  rdr(tokens) {
    return redirect('https://www.reddit.com', 'https://www.reddit.com/r/', tokens);
  },

  rtm() {
    return redirect('https://www.rememberthemilk.com');
  },

  wk(tokens) {
    return redirect('https://en.wikipedia.org', baseUrls.wk, tokens, allBaseUrls);
  },

  yarn(tokens) {
    return redirect('https://www.yarnpkg.com/en/', baseUrls.yarn, tokens, allBaseUrls);
  },

  yarnp(tokens) {
    return redirect('https://www.yarnpkg.com/en/', baseUrls.yarnp, tokens, allBaseUrls);
  },

  yt(tokens) {
    return redirect('https://www.youtube.com', baseUrls.yt, tokens, allBaseUrls);
  },

  yub(tokens) {
    return redirect('https://yubnub.org', baseUrls.yub, tokens, allBaseUrls);
  },
};
