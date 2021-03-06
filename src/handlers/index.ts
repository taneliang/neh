import { CommandHandler, FunctionHandler, RedirectHandler } from '../Handler';
import {
  SearchEngineHandler,
  makeAppendBasedSearchEngine,
  makeParamBasedSearchEngine,
  makePathBasedSearchEngine,
} from '../SearchEngineHandler';
import { redirect } from '../util';

import dictHandler from './dict';
import docsHandler from './docs';
import ghHandler from './gh';
import glHandler from './gl';
import ibankHandler from './ibank';
import ironHandler from './iron';
import npmHandler from './npm';
import nusHandler from './nus';
import rdHandler from './rd';
import twHandler from './tw';

import makeListHandler from './list';

const neh = new CommandHandler();

// Handlers with their own files
neh.addHandler('dict', dictHandler);
neh.addHandler('docs', docsHandler);
neh.addHandler('gh', ghHandler);
neh.addHandler('gl', glHandler);
neh.addHandler('ibank', ibankHandler);
neh.addHandler('iron', ironHandler);
neh.addHandler('npm', npmHandler);
neh.addHandler('nus', nusHandler);
neh.addHandler('rd', rdHandler);
neh.addHandler('tw', twHandler);

const listHandler = makeListHandler(neh);
neh.addHandler('list', listHandler);
neh.setNothingHandler(listHandler);

// Remaining handlers

neh.addHandler(
  'bp',
  new SearchEngineHandler(
    'does a Bundlephobia bundle size search',
    makeParamBasedSearchEngine('https://bundlephobia.com/', 'https://bundlephobia.com/result', 'p'),
  ),
);

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
  'ip',
  new RedirectHandler('shows your current public IP address', 'https://icanhazip.com'),
);

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
    makeParamBasedSearchEngine('https://search.nixos.org/options?channel=unstable', null, 'query'),
  ),
);

neh.addHandler(
  'nixp',
  new SearchEngineHandler(
    'does a NixOS package search',
    makeParamBasedSearchEngine('https://search.nixos.org/packages?channel=unstable', null, 'query'),
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
  'pb',
  new RedirectHandler('navigates to Productboard', 'https://app.productboard.com'),
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
  'tld',
  new SearchEngineHandler(
    'navigates to a top-level domain price list on TLD List',
    makePathBasedSearchEngine('https://tld-list.com/', 'https://tld-list.com/tld/', [1]),
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
