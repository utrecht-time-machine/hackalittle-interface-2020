import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentViewer } from './components/content-viewer/content-viewer.component';
import { ImageMapComponent } from './components/image-map/image-map.component';
import { InformationPanelComponent } from './components/information-panel/information-panel.component';
import { EmbeddedComponent } from './components/embedded/embedded.component';
import { MapModule } from './components/map/map.module';
import { SourceSelectionModule } from './components/map/source-selection/source-selection.module';

@NgModule({
  declarations: [
    AppComponent,
    ContentViewer,
    ImageMapComponent,
    InformationPanelComponent,
    EmbeddedComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    MapModule,
    SourceSelectionModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
