import {
  Handler,
  CommandHandler,
  FunctionHandler,
  DocObject,
  DEFAULT_HANDLER_KEY,
  NOTHING_HANDLER_KEY,
} from '../../Handler';
import listTemplate from './template.pug';

export default (neh: CommandHandler): Handler => {
  return new FunctionHandler('show the list of methods you can use or search that list', () => {
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
  });
};
