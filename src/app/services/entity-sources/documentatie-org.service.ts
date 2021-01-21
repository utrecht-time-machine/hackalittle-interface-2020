import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SparqlService } from '../sparql.service';
import { EntitySourceService } from './entity-source.service';
import { UtilsService } from '../utils.service';
import { EntitySparqlRes } from '../../models/entity-sparql-res';
import { Entity, EntityImage } from '../../models/entity.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentatieOrgService extends EntitySourceService {
  protected constructor(
    private sparql: SparqlService,
    protected utils: UtilsService
  ) {
    super(utils);
  }

  protected async retrieveRawEntities(): Promise<EntitySparqlRes> {
    const entitiesQuery = `
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
    let rawEntities: EntitySparqlRes = await this.sparql.query(
      environment.sparqlEndpoints.uds,

      `${environment.sparqlPrefixes.hua} ${entitiesQuery}`
    );

    rawEntities = rawEntities.map((rawEntity) => {
      rawEntity.source = environment.sourceIds.documentatieOrg;
      return rawEntity;
    });
    return rawEntities;
  }
}
