import { Handler, CommandHandler, FunctionHandler, RedirectHandler } from './Handler';
import {
  SearchEngine,
  SearchEngineHandler,
  makeHashBasedSearchEngine,
  makeParamBasedSearchEngine,
} from './SearchEngineHandler';
import { redirect } from './util';
import { getClosestModule } from './nus';
import listTemplate from './resources/list.pug';

const neh = new CommandHandler('neh');

neh.addHandler('cf', new RedirectHandler('navigates to Cloudflare', 'https://dash.cloudflare.com'));

neh.addHandler(
  'coursem',
  new FunctionHandler('navigates to Coursemology', (tokens) => {
    if (tokens && tokens.length > 0) {
      const [fuzzyModcode, ...otherTokens] = tokens;
      const module = getClosestModule(fuzzyModcode);
      if (module && module.coursemology) {
        return redirect(
          `https://coursemology.org/courses/${module.coursemology}/${otherTokens.join('/')}`,
        );
      }
    }
    return redirect('https://coursemology.org');
  }),
);

const dHandler = new SearchEngineHandler(
  'does a DuckDuckGo search',
  makeParamBasedSearchEngine('https://duckduckgo.com/', null, 'q'),
);
neh.addHandler('d', dHandler);
neh.setDefaultHandler(dHandler);

neh.addHandler(
  'do',
  new RedirectHandler('navigates to DigitalOcean', 'https://cloud.digitalocean.com'),
);

neh.addHandler(
  'drive',
  new FunctionHandler('navigates to Google Drive', (tokens) => {
    if (tokens && tokens.length > 0) {
      const [accountIndex] = tokens;
      return redirect(`https://drive.google.com/drive/u/${accountIndex}/`);
    }
    return redirect('https://drive.google.com');
  }),
);

neh.addHandler(
  'fb',
  new SearchEngineHandler(
    'does a Facebook search',
    makeParamBasedSearchEngine(
      'https://www.facebook.com/',
      'https://www.facebook.com/search/top/',
      'q',
    ),
  ),
);

neh.addHandler(
  'g',
  new SearchEngineHandler(
    'does a Google search',
    makeParamBasedSearchEngine('https://www.google.com/', 'https://www.google.com/search', 'q'),
  ),
);

// neh.addHandler(
//   'gh',
//   new SearchEngineHandler(
//     'navigates to GitHub or does a GitHub search',
//     makeParamBasedSearchEngine(
//       'https://www.google.com/',
//       'https://www.google.com/search',
//       'q',
//     ),
//   ),
// );

// neh.addHandler(
//   'ghp',
//   new SearchEngineHandler(
//     'navigates to a GitHub user profile',
//     makeParamBasedSearchEngine(
//       'https://www.google.com/',
//       'https://www.google.com/search',
//       'q',
//     ),
//   ),
// );

// neh.addHandler(
//   'ghr',
//   new SearchEngineHandler(
//     'navigates to a GitHub repo',
//     makeParamBasedSearchEngine(
//       'https://www.google.com/',
//       'https://www.google.com/search',
//       'q',
//     ),
//   ),
// );

// neh.addHandler(
//   'gl',
//   new SearchEngineHandler(
//     'navigates to GitLab or does a GitLab search',
//     makeParamBasedSearchEngine(
//       'https://www.google.com/',
//       'https://www.google.com/search',
//       'q',
//     ),
//   ),
// );

// neh.addHandler(
//   'glp',
//   new SearchEngineHandler(
//     'navigates to a GitLab user profile',
//     makeParamBasedSearchEngine(
//       'https://www.google.com/',
//       'https://www.google.com/search',
//       'q',
//     ),
//   ),
// );

// neh.addHandler(
//   'glr',
//   new SearchEngineHandler(
//     'navigates to a GitLab repo',
//     makeParamBasedSearchEngine(
//       'https://www.google.com/',
//       'https://www.google.com/search',
//       'q',
//     ),
//   ),
// );

neh.addHandler(
  'ip',
  new RedirectHandler('shows your current public IP address', 'https://icanhazip.com'),
);

const listHandler = new FunctionHandler(
  'show the list of methods you can use or search that list',
  () => {
    // const commands = Object.keys(handlers);
    const html = listTemplate({ commands: [], docstrings: {} });
    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
  },
);
neh.addHandler('list', listHandler);
neh.setNothingHandler(listHandler);

neh.addHandler(
  'lum',
  new FunctionHandler('navigates to LumiNUS', (tokens) => {
    if (tokens && tokens.length > 0) {
      const [fuzzyModcode, ...otherTokens] = tokens;
      const module = getClosestModule(fuzzyModcode);
      if (module && module.luminus) {
        return redirect(
          `https://luminus.nus.edu.sg/modules/${module.luminus}/${otherTokens.join('/')}`,
        );
      }
    }
    return redirect('https://luminus.nus.edu.sg/dashboard');
  }),
);

neh.addHandler(
  'lyrics',
  new FunctionHandler("navigates to a song's lyrics on Genius", (tokens) =>
    redirect('https://genius.com', `https://duckduckgo.com/q=%5Csite:genius.com%20`, tokens),
  ),
);

neh.addHandler(
  'nixo',
  new SearchEngineHandler(
    'does a NixOS option search',
    makeHashBasedSearchEngine('https://nixos.org/nixos/options.html', null),
  ),
);

neh.addHandler(
  'nixp',
  new SearchEngineHandler(
    'does a NixOS package search',
    makeParamBasedSearchEngine(
      'https://nixos.org/nixos/packages.html?channel=nixos-unstable',
      null,
      'query',
    ),
  ),
);

export default neh;

// const docstrings: { [command: string]: string } = {
//   nm: 'does an NUSMods search',
//   npm: 'does an NPM search',
//   npmp: 'navigates to an NPM package',
//   rd: 'does a Reddit search',
//   rdr: 'navigates to a subreddit',
//   rtm: 'navigates to Remember the Milk',
//   so: 'does a StackOverflow search',
//   speedtest: "navigates to fast.com; Netflix's Internet speedtest service",
//   tren: 'translate text to English using Google Translate',
//   trzh: 'translate text to/from Chinese using 百度翻译',
//   webcast: 'navigates to an NUS module&apos;s Panopto webcasts',
//   wk: 'English Wikipedia search',
//   yarn: 'does a Yarn package search',
//   yarnp: 'navigates to a Yarn package',
//   yt: 'does a YouTube search',
//   yub: 'run a YubNub command',
// };

// const baseUrls: { [command: string]: string } = {
//   nm: 'https://nusmods.com/modules?sem[0]=1&sem[1]=2&sem[2]=3&sem[3]=4&q=',
//   npm: 'https://www.npmjs.com/search?q=',
//   npmp: 'https://www.npmjs.com/package/',
//   rd: 'https://www.reddit.com/search?q=',
//   so: 'https://stackoverflow.com/search?q=',
//   wk: 'https://en.wikipedia.org/w/index.php?search=',
//   yarn: 'https://yarnpkg.com/en/packages?q=',
//   yarnp: 'https://yarnpkg.com/en/package/',
//   yt: 'https://www.youtube.com/results?search_query=',
//   yub: 'https://yubnub.org/parser/parse?command=',
// };

//   lyrics(tokens) {
//     return redirect(
//       'https://genius.com',
//       `${baseUrls.d}%5Csite:genius.com%20`,
//       tokens,
//       allBaseUrls,
//     );
//   },

//   nm(tokens) {
//     return redirect('https://nusmods.com', baseUrls.nm, tokens, allBaseUrls);
//   },

//   npm(tokens) {
//     return redirect('https://www.npmjs.com', baseUrls.npm, tokens, allBaseUrls);
//   },

//   npmp(tokens) {
//     return redirect('https://www.npmjs.com', baseUrls.npmp, tokens, allBaseUrls);
//   },

//   rd(tokens) {
//     return redirect('https://www.reddit.com', baseUrls.rd, tokens, allBaseUrls);
//   },

//   rdr(tokens) {
//     return redirect('https://www.reddit.com', 'https://www.reddit.com/r/', tokens);
//   },

//   rtm() {
//     return redirect('https://www.rememberthemilk.com');
//   },

//   so(tokens) {
//     return redirect('https://stackoverflow.com', baseUrls.so, tokens, allBaseUrls);
//   },

//   speedtest() {
//     return redirect('https://fast.com/');
//   },

//   tren(tokens) {
//     return redirect(
//       'https://translate.google.com',
//       'https://translate.google.com/#view=home&op=translate&sl=auto&tl=en&text=',
//       tokens,
//       allBaseUrls,
//     );
//   },

//   trzh(tokens) {
//     return redirect(
//       'https://fanyi.baidu.com',
//       'https://fanyi.baidu.com/#en/zh/',
//       tokens,
//       allBaseUrls,
//     );
//   },

//   webcast(tokens) {
//     if (tokens && tokens.length > 0) {
//       const [fuzzyModcode] = tokens;
//       const module = getClosestModule(fuzzyModcode);
//       if (module && module.panopto) {
//         return redirect(
//           `https://nuscast.ap.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID="${module.panopto}"`,
//         );
//       }
//     }
//     return redirect('https://nuscast.ap.panopto.com/Panopto/Pages/Sessions/List.aspx');
//   },

//   wk(tokens) {
//     return redirect('https://en.wikipedia.org', baseUrls.wk, tokens, allBaseUrls);
//   },

//   yarn(tokens) {
//     return redirect('https://www.yarnpkg.com/en/', baseUrls.yarn, tokens, allBaseUrls);
//   },

//   yarnp(tokens) {
//     return redirect('https://www.yarnpkg.com/en/', baseUrls.yarnp, tokens, allBaseUrls);
//   },

//   yt(tokens) {
//     return redirect('https://www.youtube.com', baseUrls.yt, tokens, allBaseUrls);
//   },

//   yub(tokens) {
//     return redirect('https://yubnub.org', baseUrls.yub, tokens, allBaseUrls);
//   },
// };
