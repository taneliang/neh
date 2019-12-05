import {
  Handler,
  CommandHandler,
  FunctionHandler,
  RedirectHandler,
  DocObject,
  DocType,
  DEFAULT_HANDLER_KEY,
  NOTHING_HANDLER_KEY,
} from './Handler';
import {
  SearchEngine,
  SearchEngineHandler,
  makeAppendBasedSearchEngine,
  makeHashBasedSearchEngine,
  makeParamBasedSearchEngine,
  makePathBasedSearchEngine,
} from './SearchEngineHandler';
import { redirect } from './util';
import { getClosestModule } from './nus';
import listTemplate from './resources/list.pug';

const neh = new CommandHandler();

neh.addHandler('cf', new RedirectHandler('navigates to Cloudflare', 'https://dash.cloudflare.com'));

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
  (() => {
    const ghHandler = new CommandHandler();
    const ghHomeUrl = 'https://github.com/';

    ghHandler.setNothingHandler(new RedirectHandler('navigates to GitHub', ghHomeUrl));

    ghHandler.setDefaultHandler(
      new SearchEngineHandler(
        'does a GitHub search',
        makeParamBasedSearchEngine(ghHomeUrl, 'https://github.com/search', 'q'),
      ),
    );

    const ghPathEngine = makePathBasedSearchEngine(
      ghHomeUrl,
      null,
      [0, 1], // username/repo
    );

    ghHandler.addHandler(
      'p',
      new SearchEngineHandler('navigates to a GitHub user profile', ghPathEngine),
    );

    ghHandler.addHandler('r', new SearchEngineHandler('navigates to a GitHub repo', ghPathEngine));

    return ghHandler;
  })(),
);

neh.addHandler(
  'gl',
  (() => {
    const glHandler = new CommandHandler();
    const glHomeUrl = 'https://gitlab.com/';

    glHandler.setNothingHandler(new RedirectHandler('navigates to GitLab', glHomeUrl));

    glHandler.setDefaultHandler(
      new SearchEngineHandler(
        'does a GitLab search',
        makeParamBasedSearchEngine(glHomeUrl, 'https://github.com/search', 'q'),
      ),
    );

    const glPathEngine = makePathBasedSearchEngine(
      glHomeUrl,
      null,
      [0, 1, 2, 3, 4, 5, 6, 7], // GitLab supports nesting, so we'll just have to whack a bunch of indices
    );

    glHandler.addHandler(
      'p',
      new SearchEngineHandler('navigates to a GitLab user profile', glPathEngine),
    );

    glHandler.addHandler('r', new SearchEngineHandler('navigates to a GitLab repo', glPathEngine));

    return glHandler;
  })(),
);

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
    const html = listTemplate({ doc: displayableDoc, DEFAULT_HANDLER_KEY, NOTHING_HANDLER_KEY });
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
  'lyrics',
  new SearchEngineHandler(
    "navigates to a song's lyrics on Genius",
    makeAppendBasedSearchEngine(
      'https://genius.com',
      'https://duckduckgo.com/q=%5Csite:genius.com%20',
    ),
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
  (() => {
    const npmHandler = new CommandHandler();
    const npmHomeUrl = 'https://www.npmjs.com';

    npmHandler.setNothingHandler(new RedirectHandler('navigates to NPM', npmHomeUrl));

    npmHandler.setDefaultHandler(
      new SearchEngineHandler(
        'does an NPM search',
        makeParamBasedSearchEngine(npmHomeUrl, 'https://www.npmjs.com/search', 'q'),
      ),
    );

    npmHandler.addHandler(
      'p',
      new SearchEngineHandler(
        'navigates to an NPM package',
        makePathBasedSearchEngine(
          npmHomeUrl,
          'https://www.npmjs.com/package/',
          [1, 2], // Account for @org/pkg-format package names
        ),
      ),
    );

    return npmHandler;
  })(),
);

neh.addHandler(
  'nus',
  (() => {
    const nusHandler = new CommandHandler();

    nusHandler.addHandler(
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

    nusHandler.addHandler(
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

    nusHandler.addHandler(
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

    return nusHandler;
  })(),
);

neh.addHandler(
  'rd',
  (() => {
    const redditHandler = new CommandHandler();
    const redditHomeUrl = 'https://www.reddit.com';

    redditHandler.setNothingHandler(new RedirectHandler('navigates to Reddit', redditHomeUrl));

    redditHandler.setDefaultHandler(
      new SearchEngineHandler(
        'does a Reddit search',
        makeParamBasedSearchEngine(redditHomeUrl, 'https://www.reddit.com/search', 'q'),
      ),
    );

    redditHandler.addHandler(
      'r',
      new SearchEngineHandler(
        'navigates to a subreddit',
        makePathBasedSearchEngine(redditHomeUrl, 'https://www.reddit.com/r/', [1]),
      ),
    );

    return redditHandler;
  })(),
);

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
    makeAppendBasedSearchEngine(
      'https://translate.google.com',
      'https://translate.google.com/#view=home&op=translate&sl=auto&tl=en&text=',
    ),
  ),
);

neh.addHandler(
  'trzh',
  new SearchEngineHandler(
    'translate text to/from Chinese using 百度翻译',
    makeAppendBasedSearchEngine('https://fanyi.baidu.com', 'https://fanyi.baidu.com/#en/zh/'),
  ),
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
  (() => {
    const yarnHandler = new CommandHandler();
    const yarnHomeUrl = 'https://www.yarnpkg.com/en/';

    yarnHandler.setNothingHandler(new RedirectHandler('navigates to Yarn', yarnHomeUrl));

    yarnHandler.setDefaultHandler(
      new SearchEngineHandler(
        'does a Yarn package search',
        makeParamBasedSearchEngine(yarnHomeUrl, 'https://yarnpkg.com/en/packages', 'q'),
      ),
    );

    yarnHandler.addHandler(
      'p',
      new SearchEngineHandler(
        'navigates to a Yarn package',
        makePathBasedSearchEngine(
          yarnHomeUrl,
          'https://yarnpkg.com/en/package/',
          [2, 3], // Account for @org/pkg-format package names
        ),
      ),
    );

    return yarnHandler;
  })(),
);

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
