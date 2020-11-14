import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {MapComponent} from "./map.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [MapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapModule {}
