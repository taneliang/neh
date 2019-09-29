const tokensToQuery = (tokens) => tokens.join('%20');

export const redirect = (noSearchURL, baseURL, searchTokens) => {
  if (searchTokens && searchTokens.length > 0) {
    return Response.redirect(`${baseURL}${tokensToQuery(searchTokens)}`, 302);
  }
  return Response.redirect(noSearchURL, 302);
};

export const searchEngineTransform = (
  originalUrl,
  altEngineQueryBaseUrls,
  intendedQueryBaseUrl,
) => {
  const altBaseUrl = altEngineQueryBaseUrls.find((u) => originalUrl.startsWith(u));
  if (!altBaseUrl) {
    return null;
  }
  return originalUrl.replace(altBaseUrl, intendedQueryBaseUrl);
};
