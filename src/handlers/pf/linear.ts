import { CommandHandler, FunctionHandler, RedirectHandler } from '../../Handler';
import { redirect } from '../../util';

const linear = new CommandHandler();

const linearHomeUrl = 'https://linear.app/paraform';

linear.setNothingHandler(new RedirectHandler('navigates to Paraform Linear', linearHomeUrl));

export const linearIssueHandler = new FunctionHandler('navigates to a Linear issue', (tokens) => {
  const ticket = tokens[0];
  const ticketNumber = parseInt(ticket, 10);
  if (!isNaN(ticketNumber)) {
    return redirect(`${linearHomeUrl}/issue/ENG-${ticketNumber}`);
  }
  if (ticket.toUpperCase().startsWith('ENG-')) {
    return redirect(`${linearHomeUrl}/issue/${ticket.toUpperCase()}`);
  }
  return redirect(linearHomeUrl);
});

linear.setDefaultHandler(linearIssueHandler);

export default linear;
