import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { UserInterfaceService } from '../../services/user-interface.service';

@Component({
  selector: 'app-content-viewer',
  templateUrl: 'content-viewer.component.html',
  styleUrls: ['content-viewer.component.scss'],
  animations: [
    trigger('showingInfoAnimation', [
      // ...
      state(
        'informationShown',
        style({
          height: '100vh',
        })
      ),
      state(
        'informationHidden',
        style({
          height: '60vh',
        })
      ),

      state(
        'panoramaHidden',
        style({
          height: '0vh',
        })
      ),
      state(
        'panoramaShown',
        style({
          height: '40vh',
        })
      ),

      transition('informationShown => informationHidden', [animate('0.25s')]),
      transition('informationHidden => informationShown', [animate('0.25s')]),
      transition('panoramaShown => panoramaHidden', [animate('0.25s')]),
      transition('panoramaHidden => panoramaShown', [animate('0.25s')]),
    ]),
  ],
})
export class ContentViewer {
  constructor(public ui: UserInterfaceService) {}
}
