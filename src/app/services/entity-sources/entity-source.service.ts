import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SparqlService } from '../sparql.service';
import { UtilsService } from '../utils.service';
import { EntitySparqlRes } from '../../models/marker-sparql-res.model';
import { Entity } from '../../models/marker.model';

@Injectable({
  providedIn: 'root',
})
export abstract class EntitySourceService {
  protected constructor(protected utils: UtilsService) {}

  protected abstract retrieveRawEntities(): Promise<EntitySparqlRes>;

  public async retrieveEntities(): Promise<Entity[]> {
    const rawMarkers = await this.retrieveRawEntities();
    return this.parseRawEntities(rawMarkers);
  }

  protected parseRawEntities(rawEntities: EntitySparqlRes): Entity[] {
    const entities: { [entityId: string]: Entity } = {};

    for (const rawEntity of rawEntities) {
      const entityId = rawEntity.sub;
      const isValidEntityId = this.utils.isValidImageUrl(rawEntity.fileURL);
      let entityImageUrl = isValidEntityId
        ? rawEntity.fileURL
        : environment.placeholderMarkerImage;

      // const isDocumentatieOrgMarker =
      //   rawMarker.source === environment.markerSourceIds.documentatieOrg;
      // if (isDocumentatieOrgMarker) {
      //   entityImageUrl = environment.documentatieMarkerImage;
      // }

      const entityImage = {
        url: entityImageUrl,
        kaartsoort: rawEntity.kaartsoort,
        source: rawEntity.source,
      };
      const existingEntity = entities[entityId];

      if (!existingEntity) {
        const entity: Entity = {
          lngLat: {
            lng: parseFloat(rawEntity.long),
            lat: parseFloat(rawEntity.lat),
          },
          label: rawEntity.label,
          id: rawEntity.sub,
          source: rawEntity.source,
          images: [entityImage],
        };
        entities[entityId] = entity;
      } else {
        existingEntity.images.push(entityImage);
      }
    }

    return Object.values(entities);
  }
}
