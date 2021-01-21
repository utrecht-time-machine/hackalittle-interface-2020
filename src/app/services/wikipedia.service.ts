import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WikipediaService {
  constructor(private http: HttpClient) {}

  private async getTitleByWikidataId(wikidataId: string): Promise<string> {
    // ?action=wbgetentities&ids=Q42&sitefilter=enwiki&props=sitelinks

    wikidataId = wikidataId.replace(environment.wikidataIRI, '');

    const params = new HttpParams()
      .set('action', 'wbgetentities')
      .set('ids', wikidataId)
      .set('format', 'json')
      .set('origin', '*');

    const rawResult = await this.http
      .get<any>(`https://www.wikidata.org/w/api.php`, { params })
      .toPromise();

    const sitelinks = rawResult?.entities[wikidataId]?.sitelinks;
    if (!sitelinks) {
      return undefined;
    }

    // TODO: Use English titles (disabled for testing purposes)
    const englishTitle = sitelinks?.enwiki?.title;
    const dutchTitle = sitelinks?.nlwiki?.title;
    // if (englishTitle) {
    //   return englishTitle;
    // } else
    if (dutchTitle) {
      return dutchTitle;
    }
    return undefined;
  }

  public async getExtractByWikidataId(wikidataId: string) {
    const title = await this.getTitleByWikidataId(wikidataId);
    return await this.getExtractByTitle(
      title,
      environment.amtSentencesWikipediaExtract
    );
  }

  public async getExtractByTitle(wikipediaTitle: string, amtSentences: number) {
    // https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=Pet_door&explaintext=1&formatversion=2

    // See https://www.mediawiki.org/wiki/Extension:TextExtracts#API
    const params = new HttpParams()
      .set('action', 'query')
      .set('prop', 'extracts')
      .set('exsentences', amtSentences.toString())
      .set('exlimit', '1') // Max amount of extracts to return
      .set('explaintext', '1') // Plain text instead of HTML
      .set('exsectionformat', 'plain')
      .set('exintro', '1')
      .set('titles', wikipediaTitle)
      .set('formatversion', '2')
      .set('format', 'json')
      .set('origin', '*');

    // TODO: Retrieve English texts (disabled for testing purposes)
    const rawResult = await this.http
      .get<any>(`https://nl.wikipedia.org/w/api.php`, { params })
      .toPromise();

    const pages = rawResult?.query?.pages;
    if (!pages) {
      return undefined;
    }
    const text = pages[0]?.extract;
    console.log('Wikipedia text', text);
    return text;
  }
}
