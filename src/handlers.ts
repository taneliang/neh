import {
  Handler,
  CommandHandler,
  FunctionHandler,
  RedirectHandler,
  DocObject,
  DocType,
} from './Handler';
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

neh.addHandler(
  'gh',
  new SearchEngineHandler(
    'navigates to GitHub or does a GitHub search',
    makeParamBasedSearchEngine('https://github.com/', 'https://github.com/search', 'q'),
  ),
);

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

neh.addHandler(
  'gl',
  new SearchEngineHandler(
    'navigates to GitLab or does a GitLab search',
    makeParamBasedSearchEngine('https://gitlab.com/', 'https://gitlab.com/search?utf8=✓', 'search'),
  ),
);

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
    const mapToPugFriendly = (doc: DocObject): any[] => {
      return Object.keys(doc).map((command) => ({
        command,
        doc:
          typeof doc[command] === 'string'
            ? doc[command]
            : mapToPugFriendly(doc[command] as DocObject),
      }));
    };

    const displayableDoc = mapToPugFriendly(neh.doc);
    const html = listTemplate({ doc: displayableDoc });
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

neh.addHandler(
  'nm',
  new SearchEngineHandler(
    'does an NUSMods search',
    makeParamBasedSearchEngine(
      'https://nusmods.com/',
      'https://nusmods.com/modules?sem[0]=1&sem[1]=2&sem[2]=3&sem[3]=4',
      'q',
    ),
  ),
);

neh.addHandler(
  'npm',
  new SearchEngineHandler(
    'does an NPM search',
    makeParamBasedSearchEngine('https://www.npmjs.com', 'https://www.npmjs.com/search', 'q'),
  ),
);

// neh.addHandler(
//   'npmp',
//   new SearchEngineHandler(
//     'navigates to an NPM package',
//     makeParamBasedSearchEngine(
//       'https://www.npmjs.com',
//       'https://www.npmjs.com/package/',
//       'q',
//     ),
//   ),
// );

neh.addHandler(
  'rd',
  new SearchEngineHandler(
    'does a Reddit search',
    makeParamBasedSearchEngine('https://www.reddit.com', 'https://www.reddit.com/search', 'q'),
  ),
);

// neh.addHandler(
//   'rdr',
//   new SearchEngineHandler(
//     'navigates to a subreddit',
//     makeParamBasedSearchEngine(
//       'https://www.reddit.com',
//       'https://www.reddit.com/r/',
//       'q',
//     ),
//   ),
// );

neh.addHandler(
  'rtm',
  new RedirectHandler('navigates to Remember the Milk', 'https://www.rememberthemilk.com'),
);

neh.addHandler(
  'so',
  new SearchEngineHandler(
    'does a StackOverflow search',
    makeParamBasedSearchEngine(
      'https://stackoverflow.com',
      'https://stackoverflow.com/search',
      'q',
    ),
  ),
);

neh.addHandler(
  'speedtest',
  new RedirectHandler(
    "navigates to fast.com; Netflix's Internet speedtest service",
    'https://fast.com/',
  ),
);

neh.addHandler(
  'tren',
  new SearchEngineHandler(
    'translate text to English using Google Translate',
    // NB: This won't be able to translate back correctly, as text is supposed
    // to be a param in the URL's hash.
    makeParamBasedSearchEngine(
      'https://translate.google.com',
      'https://translate.google.com/#view=home&op=translate&sl=auto&tl=en',
      'text',
    ),
  ),
);

// neh.addHandler(
//   'trzh',
//   new SearchEngineHandler(
//     'translate text to/from Chinese using 百度翻译',
//     makeParamBasedSearchEngine(
//       'https://fanyi.baidu.com',
//       'https://fanyi.baidu.com/#en/zh/',
//     ),
//   ),
// );

neh.addHandler(
  'webcast',
  new FunctionHandler('navigates to an NUS module&apos;s Panopto webcasts', (tokens) => {
    if (tokens && tokens.length > 0) {
      const [fuzzyModcode] = tokens;
      const module = getClosestModule(fuzzyModcode);
      if (module && module.panopto) {
        return redirect(
          `https://nuscast.ap.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID="${module.panopto}"`,
        );
      }
    }
    return redirect('https://nuscast.ap.panopto.com/Panopto/Pages/Sessions/List.aspx');
  }),
);

neh.addHandler(
  'wk',
  new SearchEngineHandler(
    'English Wikipedia search',
    makeParamBasedSearchEngine(
      'https://en.wikipedia.org',
      'https://en.wikipedia.org/w/index.php',
      'search',
    ),
  ),
);

neh.addHandler(
  'yarn',
  new SearchEngineHandler(
    'does a Yarn package search',
    makeParamBasedSearchEngine(
      'https://www.yarnpkg.com/en/',
      'https://yarnpkg.com/en/packages',
      'q',
    ),
  ),
);

// neh.addHandler(
//   'yarnp',
//   new SearchEngineHandler(
//     'navigates to a Yarn package',
//     makeParamBasedSearchEngine(
//       'https://www.yarnpkg.com/en/',
//       'https://yarnpkg.com/en/package/',
//     ),
//   ),
// );

neh.addHandler(
  'yt',
  new SearchEngineHandler(
    'does a YouTube search',
    makeParamBasedSearchEngine(
      'https://www.youtube.com',
      'https://www.youtube.com/results',
      'search_query',
    ),
  ),
);

neh.addHandler(
  'yub',
  new SearchEngineHandler(
    'run a YubNub command',
    makeParamBasedSearchEngine('https://yubnub.org', 'https://yubnub.org/parser/parse', 'command'),
  ),
);

export default neh;
