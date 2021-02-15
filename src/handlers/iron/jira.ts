import { CommandHandler, RedirectHandler } from '../../Handler';
import { makeParamBasedSearchEngine, SearchEngineHandler } from '../../SearchEngineHandler';

const jira = new CommandHandler();

const defaultUrl = 'https://ironcladapp.atlassian.net/jira/your-work';

jira.addHandler(
  'backlog',
  new RedirectHandler(
    'navigates to Jira backlog',
    'https://ironcladapp.atlassian.net/secure/RapidBoard.jspa?rapidView=8&view=planning.nodetail&issueLimit=100',
  ),
);

const baseSearchEngine = makeParamBasedSearchEngine(
  defaultUrl,
  'https://ironcladapp.atlassian.net/secure/QuickSearch.jspa',
  'searchString',
);
export const jiraSearchEngineHandler = new SearchEngineHandler(
  'navigates to a Jira ticket or does a Jira search',
  {
    ...baseSearchEngine,
    generateSearchUrl(tokens): string {
      const ticket = tokens[0];
      const ticketNumber = parseInt(ticket, 10);
      if (!isNaN(ticketNumber)) {
        return `https://ironcladapp.atlassian.net/browse/IRON-${ticketNumber}`;
      }
      if (ticket.toUpperCase().startsWith('IRON-')) {
        return `https://ironcladapp.atlassian.net/browse/${ticket.toUpperCase()}`;
      }
      return baseSearchEngine.generateSearchUrl(tokens);
    },
  },
);

jira.setNothingHandler(new RedirectHandler('navigates to Jira', defaultUrl));
jira.setDefaultHandler(jiraSearchEngineHandler);

export default jira;
