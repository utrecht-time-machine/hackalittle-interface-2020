import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LngLatLike } from 'mapbox-gl';
import { DocumentatieOrgService } from './marker-sources/documentatie-org.service';
import { HistomapService } from './marker-sources/histomap.service';
import { Marker, MarkerImage } from '../models/marker.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  markers: BehaviorSubject<Marker[]> = new BehaviorSubject<Marker[]>([]);

  constructor(
    private documentatieOrg: DocumentatieOrgService,
    private histomap: HistomapService,
    private utils: UtilsService
  ) {
    this.loadInitialMarkers();
  }

  private async loadInitialMarkers() {
    const documentatieMarkers = await this.documentatieOrg.retrieveMarkers();
    const histomapMarkers = await this.histomap.retrieveMarkers();
    const allMarkers = histomapMarkers.concat(documentatieMarkers);
    this.markers.next(allMarkers);
  }

  retrieveMarkerImageById(markerId: string): string {
    const markerImages: MarkerImage[] = this.markers
      .getValue()
      .find((marker) => {
        return marker.id === markerId;
      })?.images;
    if (!markerImages) {
      return environment.placeholderMarkerImage;
    }

    for (const markerImage of markerImages) {
      if (markerImage.url === environment.placeholderMarkerImage) {
        return environment.placeholderMarkerImage;
      }

      // const isValidDocumentatieOrgImage =
      //     markerImage.kaartsoort &&
      //     markerImage.kaartsoort === `${environment.ontologyIRI}kaart_6`;
      // if (isValidDocumentatieOrgImage) {
      //   return environment.proxyUrl + markerImage.url;
      // }
      if (this.utils.isValidUrl(markerImage.url)) {
        return environment.proxyUrl + markerImage.url;
      } else {
        return markerImage.url;
      }
    }

    return environment.placeholderMarkerImage;
  }
}
