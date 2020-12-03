import { LngLatLike } from 'mapbox-gl';

export interface Marker {
  lngLat: LngLatLike;
  label: string;
  id: string;
  images: MarkerImage[];
  source: string;
}

export interface MarkerImage {
  url: string;
  source: string;
  kaartsoort: string;
}
