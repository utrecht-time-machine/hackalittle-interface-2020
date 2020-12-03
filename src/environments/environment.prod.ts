export const environment = {
  production: true,
  mapbox: {
    accessToken:
      'pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ',
    styleUrl: 'mapbox://styles/simondirks/ckggjvjq90ewx19pbojtgnrel',
    center: [5.1196157, 52.0891439],
    zoomLevel: 13,
  },
  proxyUrl: 'https://proxy-simon.herokuapp.com/',
  corsProxyUrl: 'http://localhost:8080/',
  sparqlEndpoints: {
    uds:
      'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/UDS/services/UDS/sparql',
    histomap:
      'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/Histomap/services/Histomap/sparql',
  },
  placeholderMarkerImage: '/assets/img/map-pin.png',
  documentatieMarkerImage: '/assets/img/documentatie-pin.png',
  sparqlPrefixes: {
    hua: `PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>`,
  },
  documentatieOntologyIRI: 'http://documentatie.org/id/kaartsoort/',
  markerSourceIds: {
    documentatieOrg: 'documentatie.org',
    histomap: 'histomap',
  },
};
