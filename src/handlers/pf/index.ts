import { CommandHandler, RedirectHandler } from '../../Handler';

import ghHandler from './gh';
import linearHandler, { linearIssueHandler } from './linear';

const pf = new CommandHandler();

pf.addHandler('gh', ghHandler);
pf.addHandler('linear', linearHandler);

pf.setNothingHandler(new RedirectHandler('navigates to Paraform', 'https://www.paraform.com'));
pf.setDefaultHandler(linearIssueHandler);

export default pf;
