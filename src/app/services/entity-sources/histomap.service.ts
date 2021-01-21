import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SparqlService } from '../sparql.service';
import { EntitySourceService } from './entity-source.service';
import { UtilsService } from '../utils.service';
import { EntitySparqlRes } from '../../models/marker-sparql-res.model';

@Injectable({
  providedIn: 'root',
})
export class HistomapService extends EntitySourceService {
  protected constructor(
    private sparql: SparqlService,
    protected utils: UtilsService
  ) {
    super(utils);
  }

  protected async retrieveRawEntities(): Promise<EntitySparqlRes> {
    const entitiesQuery = `
        PREFIX dct: <http://purl.org/dc/terms/>
PREFIX schema: <http://schema.org/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX gsp: <http://www.opengis.net/ont/geosparql#>
PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#> 

SELECT DISTINCT ?sub ?lat ?long ?label ?fileURL WHERE {
  ?sub ?pred ?obj ;
            wgs84:lat ?lat ;
            wgs84:long ?long ;
            schema:address ?address ;
            rdfs:label ?label ;
            schema:image/schema:color ?pointColor ;
            schema:image ?fileURL .

  ?article dct:spatial ?sub ;
           schema:text ?text .
}`;

    let rawEntities: EntitySparqlRes = await this.sparql.query(
      environment.sparqlEndpoints.histomap,

      `${environment.sparqlPrefixes.hua} ${entitiesQuery}`
    );

    rawEntities = rawEntities.map((rawEntity) => {
      rawEntity.source = environment.sourceIds.histomap;
      return rawEntity;
    });

    return rawEntities;
  }
}
