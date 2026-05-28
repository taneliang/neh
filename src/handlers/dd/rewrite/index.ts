import { CommandHandler, FunctionHandler } from '../../../Handler';

import apiRewriteHandler from './api';

const rw = new CommandHandler();

rw.addHandler('api', apiRewriteHandler);

rw.setNothingHandler(
  new FunctionHandler(
    'lists the available Datadog URL rewrites',
    () =>
      new Response('Available dd rewrites:\n  api  ' + apiRewriteHandler.doc + '\n', {
        headers: { 'content-type': 'text/plain;charset=UTF-8' },
      }),
  ),
);

export default rw;
