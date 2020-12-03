import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SparqlService } from '../sparql.service';
import { MarkerSourceService } from './marker-source.service';
import { UtilsService } from '../utils.service';
import { MarkerSparqlRes } from '../../models/marker-sparql-res.model';

@Injectable({
  providedIn: 'root',
})
export class HistomapService extends MarkerSourceService {
  protected constructor(
    private sparql: SparqlService,
    protected utils: UtilsService
  ) {
    super(utils);
  }

  protected async retrieveRawMarkers(): Promise<MarkerSparqlRes> {
    const markersQuery = `
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

    let rawMarkers: MarkerSparqlRes = await this.sparql.query(
      environment.sparqlEndpoints.histomap,

      `${environment.sparqlPrefixes.hua} ${markersQuery}`
    );

    rawMarkers = rawMarkers.map((rawMarker) => {
      const rawMarkerWithSource = rawMarker;
      rawMarkerWithSource.source = environment.markerSourceIds.histomap;
      return rawMarkerWithSource;
    });

    return rawMarkers;
  }
}
