export type EntitySparqlRes = {
  sub: string;
  lat: string;
  long: string;
  label: string;
  fileURL: string;
  source: string;
  kaartsoort?: string;
  rijksmonumentID?: string;
  udsObjectNr?: string;
  objectsoort?: string;
  bagID?: string;
}[];
