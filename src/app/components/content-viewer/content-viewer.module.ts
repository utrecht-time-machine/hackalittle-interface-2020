import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ContentViewerComponent } from './content-viewer.component';
import { InformationPanelComponent } from './information-panel/information-panel.component';
import { ClickableImageMapComponent } from './clickable-image-map/clickable-image-map.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [
    ContentViewerComponent,
    InformationPanelComponent,
    ClickableImageMapComponent,
  ],
  exports: [ContentViewerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContentViewerModule {}
