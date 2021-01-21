import { Injectable } from '@angular/core';
import { UtilsService } from '../utils.service';
import { EntitySparqlRes } from '../../models/entity-sparql-res';
import { Entity } from '../../models/entity.model';

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
      let entityImageUrl = isValidEntityId ? rawEntity.fileURL : undefined;

      const entityImage = {
        url: entityImageUrl,
        kaartsoort: rawEntity.kaartsoort,
        source: rawEntity.source,
      };
      const existingEntity = entities[entityId];

      if (!existingEntity) {
        entities[entityId] = {
          lngLat: {
            lng: parseFloat(rawEntity.long),
            lat: parseFloat(rawEntity.lat),
          },
          label: rawEntity.label,
          id: rawEntity.sub,
          source: rawEntity.source,
          images: [],
        };
      }

      if (entityImage?.url) {
        entities[entityId].images.push(entityImage);
      }
    }

    return Object.values(entities);
  }
}
