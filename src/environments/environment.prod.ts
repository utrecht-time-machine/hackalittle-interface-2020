export const environment = {
  production: true,

  sparqlEndpoints: {
    uds:
      'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/UDS/services/UDS/sparql',
  },

  sparqlPrefixes: {
    hua: `PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>`,
  },
};
