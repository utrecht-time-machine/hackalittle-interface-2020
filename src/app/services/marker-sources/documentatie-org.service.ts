import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SparqlService } from '../sparql.service';
import { MarkerSourceService } from './marker-source.service';
import { UtilsService } from '../utils.service';
import { MarkerSparqlRes } from '../../models/marker-sparql-res.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentatieOrgService extends MarkerSourceService {
  protected constructor(
    private sparql: SparqlService,
    protected utils: UtilsService
  ) {
    super(utils);
  }

  protected async retrieveRawMarkers(): Promise<MarkerSparqlRes> {
    const markersQuery = `
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
    let rawMarkers: MarkerSparqlRes = await this.sparql.query(
      environment.sparqlEndpoints.uds,

      `${environment.sparqlPrefixes.hua} ${markersQuery}`
    );

    rawMarkers = rawMarkers.map((rawMarker) => {
      const rawMarkerWithSource = rawMarker;
      rawMarkerWithSource.source = environment.markerSourceIds.documentatieOrg;
      return rawMarkerWithSource;
    });
    return rawMarkers;
  }
}
