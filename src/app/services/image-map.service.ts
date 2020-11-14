import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { environment } from '../../environments/environment';

export interface ImageMapDict {
  [imageMapId: string]: ImageMapItem[];
}

export interface ImageMapItem {
  coords: string;
  id: string;
  label: string;
  objectNr?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImageMapService {
  imageMaps: ImageMapDict = {}; // Imagemap cache

  constructor(private sparql: SparqlService) {}

  async getImageMapItems(id: string): Promise<ImageMapItem[]> {
    if (this.imageMaps[id]) {
      return this.imageMaps[id];
    }

    const imageMap = await this.retrieveImageMap(id);
    this.imageMaps[id] = imageMap;
    return imageMap;
  }

  private async retrieveImageMap(id): Promise<ImageMapItem[]> {
    const query = `
      SELECT ?coords ?label ?objectNr WHERE {
        <${id}> <http://documentatie.org/def/imageSelection> ?obj .
        ?obj <http://documentatie.org/def/coords> ?coords .
        ?obj <http://www.w3.org/2000/01/rdf-schema#label> ?label .
        
        OPTIONAL { ?obj <http://documentatie.org/def/ObjNr> ?objectNr . }
      } LIMIT 10000`;

    return await this.sparql.query(
      environment.sparqlEndpoints.uds,
      `${environment.sparqlPrefixes.hua} ${query}`
    );
  }
}
