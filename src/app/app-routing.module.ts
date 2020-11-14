import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { EmbeddedComponent } from './components/embedded/embedded.component';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
  },
  {
    path: 'embedded',
    component: EmbeddedComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
