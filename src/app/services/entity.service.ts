import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LngLatLike } from 'mapbox-gl';
import { Entity, EntityImage } from '../models/marker.model';
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

  public retrieveImageById(entityId: string): string {
    const entityImages: EntityImage[] = this.getById(entityId)?.images;
    if (!entityImages) {
      return environment.placeholderMarkerImage;
    }

    for (const entityImage of entityImages) {
      if (entityImage.url === environment.placeholderMarkerImage) {
        return environment.placeholderMarkerImage;
      }

      // const isValidDocumentatieOrgImage =
      //     markerImage.kaartsoort &&
      //     markerImage.kaartsoort === `${environment.ontologyIRI}kaart_6`;
      // if (isValidDocumentatieOrgImage) {
      //   return environment.proxyUrl + markerImage.url;
      // }
      if (this.utils.isValidUrl(entityImage.url)) {
        return `${environment.imageProxyUrl}?url=${entityImage.url}&height=${environment.markerImageHeight}`;
      } else if (entityImage?.url) {
        return entityImage.url;
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
