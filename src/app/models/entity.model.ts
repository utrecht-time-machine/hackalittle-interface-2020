import { LngLatLike } from 'mapbox-gl';

// TODO: Use enum for source
export interface Entity {
  lngLat: LngLatLike;
  label: string;
  id: string;
  images: EntityImage[];
  source: string;
  refersToIds: {
    rijksmonumentID?: string;
    udsObjectNr?: string;
    bagID?: string;
    wikidataID?: string;
  };
  objectsoort?: string;
  inception?: Date;
  description?: { text: string; source: string };
}

export interface EntityImage {
  url: string;
  source: string;
  kaartsoort?: string;
}
