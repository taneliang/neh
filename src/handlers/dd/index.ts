import { CommandHandler, RedirectHandler } from '../../Handler';
import { SearchEngineHandler } from '../../SearchEngineHandler';

import { DD_BASE, makeDatadogQuerySearchEngine } from './datadog';
import rewriteHandler from './rewrite';

const dd = new CommandHandler();

const liveTailUrl = `${DD_BASE}/logs/livetail`;

// Logs (heaviest use): bare `dd` lands on Live Tail, `dd <query>` searches logs.
const logsSearchHandler = new SearchEngineHandler(
  'does a Datadog logs search',
  makeDatadogQuerySearchEngine('/logs'),
);

dd.setNothingHandler(new RedirectHandler('navigates to Datadog Live Tail', liveTailUrl));
dd.setDefaultHandler(logsSearchHandler);

dd.addHandler('logs', logsSearchHandler);
dd.addHandler('l', logsSearchHandler);
dd.addHandler('lt', new RedirectHandler('navigates to Datadog Live Tail', liveTailUrl));
dd.addHandler('livetail', new RedirectHandler('navigates to Datadog Live Tail', liveTailUrl));

// APM
const apm = new CommandHandler();
const apmTracesHandler = new SearchEngineHandler(
  'does a Datadog APM trace search',
  makeDatadogQuerySearchEngine('/apm/traces'),
);
apm.setNothingHandler(apmTracesHandler);
apm.setDefaultHandler(apmTracesHandler);
const apmServicesHandler = new RedirectHandler(
  'navigates to Datadog APM services',
  `${DD_BASE}/apm/services`,
);
apm.addHandler('s', apmServicesHandler);
apm.addHandler('services', apmServicesHandler);
dd.addHandler('apm', apm);
dd.addHandler('a', apm);

// DBM (no simple query= search surface; redirects only)
const dbm = new CommandHandler();
dbm.setNothingHandler(
  new RedirectHandler('navigates to Datadog Database Monitoring', `${DD_BASE}/databases`),
);
const dbmQueriesHandler = new RedirectHandler(
  'navigates to Datadog DBM query metrics',
  `${DD_BASE}/databases/query-metrics`,
);
dbm.addHandler('q', dbmQueriesHandler);
dbm.addHandler('queries', dbmQueriesHandler);
dd.addHandler('dbm', dbm);

// RUM
const rumExplorerHandler = new SearchEngineHandler(
  'does a Datadog RUM search',
  makeDatadogQuerySearchEngine('/rum/explorer'),
);
dd.addHandler('rum', rumExplorerHandler);

// URL rewrites
dd.addHandler('rw', rewriteHandler);

export default dd;
