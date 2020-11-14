import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LngLatLike, LngLat } from 'mapbox-gl';

export interface Marker {
  lngLat: LngLat;
  label: string;
  id: string;
  image: string;
}

export type MarkerSparqlRes = {
  sub: string;
  lat: string;
  long: string;
  label: string;
  fileURL: string;
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

  retrieveMarkerImageById(markerId: string) {
    return this.markers.getValue().find((marker) => {
      return marker.id === markerId;
    }).image;
  }

  async retrieveMarkers(): Promise<Marker[]> {
    // console.log('Running markers query');
    const queryUrl = `
      SELECT ?sub ?lat ?long ?label ?fileURL WHERE {
        ?sub dct:spatial ?obj .
        ?obj <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat .
        ?obj <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long .
        ?sub <http://purl.org/dc/terms/subject> ?subject .
        ?subject <http://www.w3.org/2000/01/rdf-schema#label> ?label .
        
        OPTIONAL { ?subject <http://documentatie.org/def/hasPage> ?pages .
                   ?pages <http://documentatie.org/def/fileURL> ?fileURL }
        
      } LIMIT 10000`;

    const rawMarkersUrls: MarkerSparqlRes = await this.sparql.query(
      environment.sparqlEndpoints.uds,
      `${environment.sparqlPrefixes.hua} ${queryUrl}`
    );

    const query = `
      SELECT ?sub ?lat ?long ?label ?fileURL WHERE {
        ?sub dct:spatial ?obj .
        ?obj <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat .
        ?obj <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long .
        ?sub <http://purl.org/dc/terms/subject> ?subject .
        ?subject <http://www.w3.org/2000/01/rdf-schema#label> ?label .
      } LIMIT 10000`;

    const rawMarkers: MarkerSparqlRes = await this.sparql.query(
      environment.sparqlEndpoints.uds,
      `${environment.sparqlPrefixes.hua} ${query}`
    );

    // console.log(rawMarkers);

    // Remove duplicate items from rawMarkers

    return rawMarkers.map((rawItem) => {
      const itemWithMyImage = rawMarkersUrls.find((itemUrlCheck) => {
        const url = itemUrlCheck.fileURL;
        return (
          itemUrlCheck.sub === rawItem.sub &&
          (url.endsWith('.jpg') || url.endsWith('.jpeg'))
        );
      });

      const myImage = itemWithMyImage?.fileURL || null;
      // rawItem.fileURL.find(
      //   (url) => url.endsWith('.jpg') || url.endsWith('.jpeg')
      // );

      return {
        id: rawItem.sub,
        lngLat: {
          lng: parseFloat(rawItem.long),
          lat: parseFloat(rawItem.lat),
        },
        label: rawItem.label,
        image: myImage,
      };
    });
  }
}
