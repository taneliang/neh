import { CommandHandler, RedirectHandler } from '../../Handler';
import { makeParamBasedSearchEngine, SearchEngineHandler } from '../../SearchEngineHandler';

import ghHandler from './gh';
import jiraHandler, { jiraSearchEngineHandler } from './jira';

const iron = new CommandHandler();

iron.addHandler('gh', ghHandler);
iron.addHandler('jira', jiraHandler);

const ironcladHomeUrl = 'https://ironcladapp.com';
iron.setNothingHandler(new RedirectHandler('navigates to Ironclad', ironcladHomeUrl));

iron.setDefaultHandler(jiraSearchEngineHandler);

iron.addHandler(
  'conf',
  new SearchEngineHandler(
    'does a Confluence search',
    makeParamBasedSearchEngine(
      'https://ironcladapp.atlassian.net/wiki/home',
      'https://ironcladapp.atlassian.net/wiki/search',
      'text',
    ),
  ),
);

export default iron;
