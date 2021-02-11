import { CommandHandler, FunctionHandler, HandlerFn, RedirectHandler } from '../../Handler';
import { redirect } from '../../util';

const jira = new CommandHandler();

jira.setNothingHandler(
  new RedirectHandler('navigates to Jira', 'https://ironcladapp.atlassian.net/jira/your-work'),
);

jira.addHandler(
  'backlog',
  new RedirectHandler(
    'navigates to Jira backlog',
    'https://ironcladapp.atlassian.net/secure/RapidBoard.jspa?rapidView=8&view=planning.nodetail&issueLimit=100',
  ),
);

export const jiraTicketNumberHandlerFn: HandlerFn = (tokens) => {
  if (tokens.length === 0) {
    return new Response('No Jira ticket provided', { status: 400 });
  }
  const [ticket] = tokens;
  const ticketNumber = parseInt(ticket, 10);
  if (!isNaN(ticketNumber)) {
    return redirect(`https://ironcladapp.atlassian.net/browse/IRON-${ticketNumber}`);
  }
  if (ticket.toUpperCase().startsWith('IRON-')) {
    return redirect(`https://ironcladapp.atlassian.net/browse/${ticket.toUpperCase()}`);
  }
  return new Response(`No valid Jira ticket found`, { status: 400 });
};

jira.setDefaultHandler(
  new FunctionHandler('navigates to a Jira ticket', jiraTicketNumberHandlerFn),
);

export default jira;
