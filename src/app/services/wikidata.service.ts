import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { environment } from '../../environments/environment';
import { Entity, EntityImage } from '../models/entity.model';

@Injectable({
  providedIn: 'root',
})
export class WikidataService {
  constructor(private sparql: SparqlService) {}

  public async enrichEntityUsingWikidata(entity: Entity, wikidataId: string) {
    if (!wikidataId) {
      return;
    }
    console.log('Enriching entity using Wikidata...');

    const rawResult = await this.sparql.query(
      environment.sparqlEndpoints.wikidata,
      `SELECT ?wikidataId ?label ?inception ?image
WHERE 
{
  <${wikidataId}> rdfs:label ?label . 
  filter(langMatches(lang(?label),"EN")) .
  OPTIONAL { <${wikidataId}> wdt:P571 ?inception . }
  OPTIONAL { <${wikidataId}> wdt:P18 ?image . }
}
LIMIT 10000`
    );

    // TODO: Support multiple values (e.g., multiple images).
    const rawInceptionDate = rawResult?.results?.bindings[0]?.inception?.value;
    if (rawInceptionDate) {
      entity.inception = new Date(rawInceptionDate);
    }

    const rawImageUri = rawResult?.results?.bindings[0]?.image?.value;
    if (rawImageUri) {
      const image: EntityImage = {
        url: rawImageUri,
        source: environment.sourceIds.wikidata,
      };
      entity.images.unshift(image);
    }

    const rawLabel = rawResult?.results?.bindings[0]?.label?.value;
    if (rawLabel) {
      // TODO: *Merge* more cleverly with existing value? Currently Wikidata always overrides any previous label.
      entity.label = rawLabel;
    }

    console.log('Enriched entity:', entity);
  }

  public async getWikidataIdFromRijksmonumentId(
    rijksmonumentId: string
  ): Promise<string> {
    rijksmonumentId = rijksmonumentId.replace(environment.rijksmonumentURI, '');
    console.log(
      'Trying to find Wikidata ID for Rijksmonument ID...',
      rijksmonumentId
    );
    const rawResult = await this.sparql.query(
      environment.sparqlEndpoints.wikidata,
      `SELECT ?wikidataId
WHERE 
{
  ?wikidataId wdt:P359 "${rijksmonumentId}" .
}
LIMIT 1`
    );

    const wikidataId = rawResult?.results?.bindings[0]?.wikidataId?.value;
    if (!wikidataId) {
      console.log('No Wikidata ID for Rijksmonument ID:', rijksmonumentId);
    } else {
      console.log(
        `Wikidata ID belonging to Rijksmonument ID (${rijksmonumentId}): ${wikidataId}`
      );
    }
    return wikidataId;
  }
}
