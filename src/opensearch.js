export const openSearchPath = '/_opensearch';

export const openSearchAutodiscoveryLink = `
<link rel="search"
      type="application/opensearchdescription+xml"
      title="Neh"
      href="${openSearchPath}">
`;

const openSearchDescription = `
<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
	<ShortName>Neh</ShortName>
	<Description>A tool that smartly redirects you around the Interwebs</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Url type="text/html" template="https://neh.eltan.net?={searchTerms}"/>
</OpenSearchDescription>
`;

const init = {
  headers: {
    'content-type': 'application/xml',
  },
};

export const respondToOpenSearchQuery = () => new Response(openSearchDescription, init);
