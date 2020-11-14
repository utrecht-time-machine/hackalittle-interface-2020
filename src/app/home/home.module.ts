import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {HomePage} from './home.page';

import {HomePageRoutingModule} from './home-routing.module';
import {ImageMapComponent} from '../components/image-map/image-map.component';
import {InformationPanelComponent} from "../components/information-panel/information-panel.component";
import {EmbeddedComponent} from "../components/embedded/embedded.component";

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
    declarations: [HomePage, ImageMapComponent, InformationPanelComponent, EmbeddedComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {
}
