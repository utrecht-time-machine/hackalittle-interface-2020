import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LngLatLike } from 'mapbox-gl';

export interface Marker {
  lngLat: LngLatLike;
  label: string;
  id: string;
}

export type MarkerSparqlRes = {
  sub: string;
  lat: string;
  long: string;
  label: string;
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
    console.log(markers);
  }

  async retrieveMarkers(): Promise<Marker[]> {
    const query = `
      SELECT ?sub ?lat ?long ?label WHERE {
        ?sub dct:spatial ?obj .
        ?obj <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat .
        ?obj <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long .
        ?sub <http://purl.org/dc/terms/subject> ?subject .
        ?subject <http://www.w3.org/2000/01/rdf-schema#label> ?label.
      } LIMIT 10000`;

    const rawMarkers: MarkerSparqlRes = await this.sparql.query(
      environment.sparqlEndpoints.uds,
      `${environment.sparqlPrefixes.hua} ${query}`
    );

    console.log(rawMarkers);

    return rawMarkers.map((rawItem) => {
      return {
        id: rawItem.sub,
        lngLat: {
          lng: parseFloat(rawItem.long),
          lat: parseFloat(rawItem.lat),
        },
        label: rawItem.label,
      };
    });
  }
}
