import { redirect } from './util';

const docstrings = {
  d: 'does a DuckDuckGo search',
  fb: 'does a Facebook search',
  g: 'does a Google search',
  gh: 'navigates to GitHub or does a GitHub search',
  ghr: 'navigates to a GitHub repo',
  ghp: 'navigates to a GitHub user profile',
  list: 'show the list of methods you can use or search that list',
  lyrics: 'does a Genius lyric search',
  nm: 'does an NUSMods search',
  wk: 'English Wikipedia search',
  yt: 'does a YouTube search',
  yub: 'run a YubNub command',
};

export const handlers = {
  d(tokens) {
    return redirect('https://duckduckgo.com', 'https://duckduckgo.com/?q=', tokens);
  },

  fb(tokens) {
    return redirect('https://www.facebook.com', 'https://www.facebook.com/search/top/?q=', tokens);
  },

  g(tokens) {
    return redirect('https://google.com', 'https://google.com/search?q=', tokens);
  },

  gh(tokens) {
    return redirect('https://github.com', 'https://github.com/search?q=', tokens);
  },

  ghr(tokens) {
    return redirect('https://github.com/taneliang/neh', 'https://github.com/', tokens);
  },

  ghp(tokens) {
    return redirect('https://github.com/taneliang', 'https://github.com/', tokens);
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
    return redirect('https://genius.com', 'https://genius.com/search?q=', tokens);
  },

  nm(tokens) {
    return redirect(
      'https://nusmods.com',
      'https://nusmods.com/modules?sem[0]=1&sem[1]=2&sem[2]=3&sem[3]=4&q=',
      tokens,
    );
  },

  wk(tokens) {
    return redirect(
      'https://en.wikipedia.org',
      'https://en.wikipedia.org/w/index.php?search=',
      tokens,
    );
  },

  yt(tokens) {
    return redirect(
      'https://www.youtube.com',
      'https://www.youtube.com/results?search_query=',
      tokens,
    );
  },

  yub(tokens) {
    return redirect('https://yubnub.org', 'https://yubnub.org/parser/parse?command=', tokens);
  },
};
