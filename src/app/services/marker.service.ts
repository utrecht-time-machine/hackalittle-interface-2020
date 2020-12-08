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
  allMarkers: BehaviorSubject<Marker[]> = new BehaviorSubject<Marker[]>([]);
  allMarkerSourceIds: string[];
  enabledMarkerSourceIds: BehaviorSubject<string[]>;

  constructor(
    private documentatieOrg: DocumentatieOrgService,
    private histomap: HistomapService,
    private utils: UtilsService
  ) {
    this.allMarkerSourceIds = [
      environment.markerSourceIds.documentatieOrg,
      environment.markerSourceIds.histomap,
    ];
    this.enabledMarkerSourceIds = new BehaviorSubject<string[]>(
      this.allMarkerSourceIds
    );
    this.loadInitialMarkers();
  }

  public getEnabledMarkers(): Marker[] {
    return this.allMarkers
      .getValue()
      .filter((marker) =>
        this.enabledMarkerSourceIds.getValue().includes(marker.source)
      );
  }

  public toggleMarkerSourceById(markerSourceId: string) {
    let enabledMarkerSourceIds = this.enabledMarkerSourceIds.getValue();

    const markerSourceIsEnabled = enabledMarkerSourceIds.includes(
      markerSourceId
    );
    if (markerSourceIsEnabled) {
      enabledMarkerSourceIds = enabledMarkerSourceIds.filter(
        (enabledSourceId) => enabledSourceId !== markerSourceId
      );
    } else {
      enabledMarkerSourceIds.push(markerSourceId);
    }
    this.enabledMarkerSourceIds.next(enabledMarkerSourceIds);
    console.log(enabledMarkerSourceIds);
  }

  private async loadInitialMarkers() {
    const documentatieMarkers = await this.documentatieOrg.retrieveMarkers();
    const histomapMarkers = await this.histomap.retrieveMarkers();
    const allMarkers = histomapMarkers.concat(documentatieMarkers);
    this.allMarkers.next(allMarkers);
  }

  public retrieveMarkerImageById(markerId: string): string {
    const markerImages: MarkerImage[] = this.allMarkers
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
        if (
          markerImage.url.endsWith('.jpg') ||
          markerImage.url.endsWith('.png') ||
          markerImage.url.endsWith('.jpeg')
        ) {
          return `${environment.imageProxyUrl}?url=${markerImage.url}&height=${environment.markerImageHeight}`;
        }

        return environment.proxyUrl + markerImage.url;
      } else {
        return markerImage.url;
      }
    }

    return environment.placeholderMarkerImage;
  }
}
