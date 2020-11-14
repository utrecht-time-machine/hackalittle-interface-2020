import {Component, ViewEncapsulation} from '@angular/core';
import {animate, state, style, transition, trigger,} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('showingInfoAnimation', [
      // ...
      state('informationShown', style({
        height: '100vh'
      })),
      state('informationHidden', style({
        height: '60vh'
      })),

      state('panoramaHidden', style({
        height: '0vh'
      })),
      state('panoramaShown', style({
        height: '40vh'
      })),

      transition('informationShown => informationHidden', [
        animate('0.25s')
      ]),
      transition('informationHidden => informationShown', [
        animate('0.25s')
      ]),
      transition('panoramaShown => panoramaHidden', [
        animate('0.25s')
      ]),
      transition('panoramaHidden => panoramaShown', [
        animate('0.25s')
      ]),
    ]),]
})
export class HomePage {
  moreInfoShown = false;

  constructor() {}

  showMoreInfo() {
    this.moreInfoShown = !this.moreInfoShown;
  }
}
