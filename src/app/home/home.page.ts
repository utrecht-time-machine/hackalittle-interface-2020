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
      state('showingInfo', style({
        height: '100vh'
      })),
      state('notShowingInfo', style({
        height: '60vh'
      })),

      state('panoramaShowingInfo', style({
        height: '0vh'
      })),
      state('panoramaNotShowingInfo', style({
        height: '40vh'
      })),

      transition('showingInfo => notShowingInfo', [
        animate('0.25s')
      ]),
      transition('notShowingInfo => showingInfo', [
        animate('0.25s')
      ]),
      transition('panoramaShowingInfo => panoramaNotShowingInfo', [
        animate('0.25s')
      ]),
      transition('panoramaNotShowingInfo => panoramaShowingInfo', [
        animate('0.25s')
      ]),
    ]),]
})
export class HomePage {
  showingMoreInfo = false;

  constructor() {}

  showMoreInfo() {
    this.showingMoreInfo = !this.showingMoreInfo;
  }
}
