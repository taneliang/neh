import { CommandHandler, FunctionHandler, HandlerFn, Token } from '../Handler';
import { redirect } from '../util';
import { getClosestModule, NUSMod } from '../nus';

const nus = new CommandHandler();

const makeModRedirector = (
  defaultUrl: string,
  modFieldName: keyof NUSMod,
  modUrlTransformer: (fieldValue: string, otherTokens: Token[]) => string,
): HandlerFn => (tokens): Response => {
  if (tokens && tokens.length > 0) {
    const [fuzzyModcode, ...otherTokens] = tokens;
    const module = getClosestModule(fuzzyModcode);
    if (module && module[modFieldName]) {
      const fieldValue = module[modFieldName];
      if (fieldValue) {
        return redirect(modUrlTransformer(fieldValue, otherTokens));
      }
    }
  }
  return redirect(defaultUrl);
};

nus.addHandler(
  'coursem',
  new FunctionHandler(
    'navigates to Coursemology',
    makeModRedirector(
      'https://coursemology.org',
      'coursemology',
      (fieldValue, otherTokens) =>
        `https://coursemology.org/courses/${fieldValue}/${otherTokens.join('/')}`,
    ),
  ),
);

nus.addHandler(
  'lum',
  new FunctionHandler(
    'navigates to LumiNUS',
    makeModRedirector(
      'https://luminus.nus.edu.sg/dashboard',
      'luminus',
      (fieldValue, otherTokens) =>
        `https://luminus.nus.edu.sg/modules/${fieldValue}/${otherTokens.join('/')}`,
    ),
  ),
);

nus.addHandler(
  'webcast',
  new FunctionHandler(
    "navigates to an NUS module's Panopto webcasts",
    makeModRedirector(
      'https://nuscast.ap.panopto.com/Panopto/Pages/Sessions/List.aspx',
      'panopto',
      (fieldValue) =>
        `https://nuscast.ap.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID="${fieldValue}"`,
    ),
  ),
);

export default nus;
