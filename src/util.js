const tokensToQuery = (tokens) => tokens.join('%20');

export const redirect = (noSearchURL, baseURL, searchTokens) => {
  if (searchTokens && searchTokens.length > 0) {
    return Response.redirect(`${baseURL}${tokensToQuery(searchTokens)}`, 302);
  }
  return Response.redirect(noSearchURL, 302);
};
