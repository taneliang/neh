import {
  CommandHandler,
  FunctionHandler,
  RedirectHandler,
  DocObject,
  DEFAULT_HANDLER_KEY,
  NOTHING_HANDLER_KEY,
} from '../Handler';
import {
  SearchEngineHandler,
  makeAppendBasedSearchEngine,
  makeHashBasedSearchEngine,
  makeParamBasedSearchEngine,
} from '../SearchEngineHandler';
import { redirect } from '../util';
import listTemplate from '../resources/list.pug';

import ghHandler from './gh';
import glHandler from './gl';
import npmHandler from './npm';
import nusHandler from './nus';
import rdHandler from './rd';
import yarnHandler from './yarn';

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

neh.addHandler('gh', ghHandler);

neh.addHandler('gl', glHandler);

neh.addHandler(
  'ip',
  new RedirectHandler('shows your current public IP address', 'https://icanhazip.com'),
);

const listHandler = new FunctionHandler(
  'show the list of methods you can use or search that list',
  () => {
    type PugFriendlyObj = {
      command: string;
      doc: string | PugFriendlyObj[];
    };
    const mapToPugFriendly = (doc: DocObject): PugFriendlyObj[] => {
      return Object.keys(doc).map((command) => ({
        command,
        doc:
          typeof doc[command] === 'string'
            ? (doc[command] as string)
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
      'https://duckduckgo.com/?q=%5Csite:genius.com%20',
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

neh.addHandler('npm', npmHandler);

neh.addHandler('nus', nusHandler);

neh.addHandler('rd', rdHandler);

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

neh.addHandler('yarn', yarnHandler);

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
