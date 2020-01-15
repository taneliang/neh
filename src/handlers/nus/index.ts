import { CommandHandler, FunctionHandler, HandlerFn, RedirectHandler, Token } from '../../Handler';
import { redirect } from '../../util';
import { getClosestModule, modules, NUSModBookmarks, NUSModOnlyStringValues } from './nus';

const nus = new CommandHandler();

const makeModRedirector = (
  defaultUrl: string,
  modFieldName: keyof NUSModOnlyStringValues,
  modUrlTransformer: (fieldValue: string, otherTokens: Token[]) => string,
): HandlerFn => (tokens): Response => {
  if (tokens.length > 0) {
    const [fuzzyModcode, ...otherTokens] = tokens;
    const fieldValue = getClosestModule(fuzzyModcode)?.[modFieldName];
    if (fieldValue) {
      return redirect(modUrlTransformer(fieldValue, otherTokens));
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

// Bookmarks
function makeModBookmarkHandler(modcode: string, bookmarks: NUSModBookmarks): CommandHandler {
  const bookmarksHandler = new CommandHandler();
  Object.entries(bookmarks).forEach(([name, url]) => {
    bookmarksHandler.addHandler(
      name,
      new RedirectHandler(`navigates to ${modcode}'s ${name}`, url),
    );
  });
  return bookmarksHandler;
}

Object.entries(modules).forEach(
  ([modcode, module]) =>
    module.bookmarks &&
    nus.addHandler(modcode.toLowerCase(), makeModBookmarkHandler(modcode, module.bookmarks)),
);

export default nus;
