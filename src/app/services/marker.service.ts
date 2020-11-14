import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LngLatLike } from 'mapbox-gl';

export interface Marker {
  lngLat: LngLatLike;
  label: string;
  id: string;
  images: MarkerImage[];
}

export interface MarkerImage {
  url: string;
  kaartsoort: string;
}

export type MarkerSparqlRes = {
  sub: string;
  lat: string;
  long: string;
  label: string;
  fileURL: string;
  kaartsoort: string;
}[];

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  markers: BehaviorSubject<Marker[]> = new BehaviorSubject<Marker[]>([]);

  constructor(private sparql: SparqlService) {
    this.initMarkers();
  }

  async initMarkers() {
    const markers = await this.retrieveMarkers();
    this.markers.next(markers);
  }

  retrieveMarkerImageById(markerId: string): string {
    const markerImages: MarkerImage[] = this.markers
      .getValue()
      .find((marker) => {
        return marker.id === markerId;
      }).images;
    for (const markerImage of markerImages) {
      if (markerImage.kaartsoort === `${environment.ontologyIRI}kaart_6`) {
        return markerImage.url;
      }
    }

    return environment.placeholderMarkerImage;
  }

  async retrieveMarkers(): Promise<Marker[]> {
    const markersQuery = `
        SELECT ?sub ?lat ?long ?label ?fileURL ?kaartsoort WHERE {
        ?sub dct:spatial ?obj .
        ?obj <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat .
        ?obj <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long .
        ?sub <http://purl.org/dc/terms/subject> ?subject .
        ?subject <http://www.w3.org/2000/01/rdf-schema#label> ?label .

        OPTIONAL {?subject <http://documentatie.org/def/hasPage> ?pages .
        ?pages <http://documentatie.org/def/fileURL> ?fileURL .
        ?pages <http://documentatie.org/def/kaartsoort> ?kaartsoort }
        } LIMIT 10000`;
    const rawMarkers: MarkerSparqlRes = await this.sparql.query(
      environment.sparqlEndpoints.uds,

      `${environment.sparqlPrefixes.hua} ${markersQuery}`
    );

    const markers: { [markerId: string]: Marker } = {};
    for (const rawMarker of rawMarkers) {
      const markerId = rawMarker.sub;
      const isValidMarkerImageUrl =
        rawMarker.fileURL.endsWith('.jpg') ||
        rawMarker.fileURL.endsWith('.png') ||
        rawMarker.fileURL.endsWith('.jpeg');
      const markerImageUrl = isValidMarkerImageUrl
        ? rawMarker.fileURL
        : environment.placeholderMarkerImage;
      const markerImage = {
        url: markerImageUrl,
        kaartsoort: rawMarker.kaartsoort,
      };
      const existingMarker = markers[markerId];

      if (!existingMarker) {
        const marker: Marker = {
          lngLat: {
            lng: parseFloat(rawMarker.long),
            lat: parseFloat(rawMarker.lat),
          },
          label: rawMarker.label,
          id: rawMarker.sub,
          images: [markerImage],
        };
        markers[markerId] = marker;
      } else {
        existingMarker.images.push(markerImage);
      }
    }

    return Object.values(markers);
  }
}
