import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MapComponent } from './map.component';
import { SourceSelectionComponent } from './source-selection/source-selection.component';
import { SourceSelectionModule } from './source-selection/source-selection.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SourceSelectionModule],
  declarations: [MapComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapModule {}
