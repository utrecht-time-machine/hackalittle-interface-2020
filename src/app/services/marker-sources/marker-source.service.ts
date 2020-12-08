import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SparqlService } from '../sparql.service';
import { UtilsService } from '../utils.service';
import { MarkerSparqlRes } from '../../models/marker-sparql-res.model';
import { Marker } from '../../models/marker.model';

@Injectable({
  providedIn: 'root',
})
export abstract class MarkerSourceService {
  protected constructor(protected utils: UtilsService) {}

  protected abstract retrieveRawMarkers(): Promise<MarkerSparqlRes>;

  public async retrieveMarkers(): Promise<Marker[]> {
    const rawMarkers = await this.retrieveRawMarkers();
    return this.parseRawMarkers(rawMarkers);
  }

  protected parseRawMarkers(rawMarkers: MarkerSparqlRes): Marker[] {
    const markers: { [markerId: string]: Marker } = {};

    for (const rawMarker of rawMarkers) {
      const markerId = rawMarker.sub;
      const isValidMarkerImageUrl = this.utils.isValidImageUrl(
        rawMarker.fileURL
      );
      let markerImageUrl = isValidMarkerImageUrl
        ? rawMarker.fileURL
        : environment.placeholderMarkerImage;

      // const isDocumentatieOrgMarker =
      //   rawMarker.source === environment.markerSourceIds.documentatieOrg;
      // if (isDocumentatieOrgMarker) {
      //   markerImageUrl = environment.documentatieMarkerImage;
      // }

      const markerImage = {
        url: markerImageUrl,
        kaartsoort: rawMarker.kaartsoort,
        source: rawMarker.source,
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
          source: rawMarker.source,
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
