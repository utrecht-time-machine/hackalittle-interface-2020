import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LngLatLike } from 'mapbox-gl';
import { Entity, EntityImage } from '../models/entity.model';
import { UtilsService } from './utils.service';
import { DocumentatieOrgService } from './entity-sources/documentatie-org.service';
import { HistomapService } from './entity-sources/histomap.service';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  public all: BehaviorSubject<Entity[]> = new BehaviorSubject<Entity[]>([]);
  private readonly sourceIds: string[];

  constructor(
    private documentatieOrg: DocumentatieOrgService,
    private histomap: HistomapService,
    private utils: UtilsService
  ) {
    this.sourceIds = [
      environment.sourceIds.documentatieOrg,
      environment.sourceIds.histomap,
    ];
    this.loadInitial();
  }

  public getSourceIds(): string[] {
    return this.sourceIds;
  }

  public getAll(): Entity[] {
    return this.all.getValue();
  }

  public getById(entityId: string) {
    return this.getAll().find((entity) => {
      return entity.id === entityId;
    });
  }

  public getMostRelevantImages(entity: Entity): EntityImage[] {
    // TODO: Fine-tune this rule? Are *ALL* images of kaartsoort 6 good images?
    return this.getImagesByKaartsoort(entity, 'kaart_6');
  }

  public getImagesByKaartsoort(
    entity: Entity,
    kaartsoort: string
  ): EntityImage[] {
    if (!entity.images || entity.images.length === 0) {
      return [];
    }

    const entityImages = [];
    for (const entityImage of entity.images) {
      if (
        entityImage.kaartsoort &&
        entityImage.kaartsoort !==
          environment.documentatieOntologyIRI + kaartsoort
      ) {
        continue;
      }
      entityImages.push(entityImage);
    }

    return entityImages;
  }

  public retrieveMarkerImageById(entityId: string): string {
    const entity = this.getById(entityId);
    const entityImages: EntityImage[] = this.getMostRelevantImages(entity);
    if (!entityImages || entityImages.length === 0) {
      return environment.placeholderMarkerImage;
    }

    for (const entityImage of entityImages) {
      if (entityImage.url === environment.placeholderMarkerImage) {
        return environment.placeholderMarkerImage;
      }

      if (this.utils.isValidUrl(entityImage.url)) {
        return `${environment.imageProxyUrl}?url=${entityImage.url}&height=${environment.markerImageHeight}`;
      }
    }

    return environment.placeholderMarkerImage;
  }

  private async loadInitial() {
    const documentatieEntities = await this.documentatieOrg.retrieveEntities();
    const histomapEntities = await this.histomap.retrieveEntities();
    const allEntities = histomapEntities.concat(documentatieEntities);
    this.all.next(allEntities);
  }
}
