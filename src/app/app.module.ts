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
import { ClickableImageMapComponent } from './components/content-viewer/clickable-image-map/clickable-image-map.component';
import { EmbeddedComponent } from './components/embedded/embedded.component';
import { MapModule } from './components/map/map.module';
import { SourceSelectionModule } from './components/map/source-selection/source-selection.module';
import { ContentViewerModule } from './components/content-viewer/content-viewer.module';

@NgModule({
  declarations: [AppComponent, EmbeddedComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    MapModule,
    SourceSelectionModule,
    ContentViewerModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
