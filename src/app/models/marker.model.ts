import { LngLatLike } from 'mapbox-gl';

export interface Entity {
  lngLat: LngLatLike;
  label: string;
  id: string;
  images: EntityImage[];
  source: string;
}

export interface EntityImage {
  url: string;
  source: string;
  kaartsoort: string;
}
