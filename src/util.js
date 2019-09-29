const tokensToQuery = (tokens) => tokens.join('%20');

export const redirect = (noSearchUrl, baseUrl, searchTokens, altSearchBaseUrls) => {
  if (searchTokens && searchTokens.length > 0) {
    // Construct URL from alternative search engine URLs if possible
    if (altSearchBaseUrls && altSearchBaseUrls.length > 0) {
      const queryFromAltEngine = searchEngineTransform(searchTokens[0], altSearchBaseUrls, baseUrl);
      if (queryFromAltEngine) {
        return Response.redirect(queryFromAltEngine, 302);
      }
    }

    // Simply construct query string directly from tokens
    return Response.redirect(`${baseUrl}${tokensToQuery(searchTokens)}`, 302);
  }
  return Response.redirect(noSearchUrl, 302);
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
