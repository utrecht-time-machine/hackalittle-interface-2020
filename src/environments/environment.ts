// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapbox: {
    accessToken:
      'pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ',
    styleUrl: 'mapbox://styles/simondirks/ckggjvjq90ewx19pbojtgnrel',
    center: [5.1196157, 52.0891439],
    zoomLevel: 13,
  },
  // proxyUrl: '',
  proxyUrl: 'https://proxy-simon.herokuapp.com/',
  corsProxyUrl: 'http://localhost:8080/',
  sparqlEndpoints: {
    uds:
      'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/UDS/services/UDS/sparql',
  },
  placeholderMarkerImage: 'https://via.placeholder.com/300',
  sparqlPrefixes: {
    hua: `PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>`,
  },
  ontologyIRI: 'http://documentatie.org/id/kaartsoort/',
  maxAmountMarkers: 100,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
