import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { Marker, MarkerService } from './marker.service';
import { Feature, FeatureCollection } from 'geojson';
import { ModalController } from '@ionic/angular';
import { HomePage } from '../home/home.page';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: mapboxgl.Map;

  constructor(
    private markerService: MarkerService,
    private modalController: ModalController
  ) {}

  async initializeMap(id: string) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: id,
      style: environment.mapbox.styleUrl,
      zoom: environment.mapbox.zoomLevel,
      center: environment.mapbox.center as any,
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('styleimagemissing', async (e) => {
      const markerId = e.id;

      let imageUrl = this.markerService.retrieveMarkerImageById(markerId);
      if (!imageUrl) {
        imageUrl = 'https://via.placeholder.com/300';
      }

      await new Promise((resolve, rejects) => {
        this.map.loadImage(environment.proxyUrl + imageUrl, (error, image) => {
          if (this.map.hasImage(markerId)) {
            return resolve('Image already loaded');
          }
          this.map.addImage(markerId, image);
          resolve(image);
        });
      });
    });

    this.map.on('load', async () => {
      this.map.resize();

      this.addMarkersAsGeoJSON();

      // this.addMarkers();
      // this.markerService.markers.subscribe(async (markers) => {
      //     await this.addMarkers(markers)
      // });
    });
  }

  private async addMarkersAsGeoJSON() {
    let markers: Marker[] = await this.markerService.retrieveMarkers();
    markers = markers.splice(0, 50);

    const features: Feature[] = markers.map((marker) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [marker.lngLat.lng, marker.lngLat.lat],
        },
        properties: {
          title: marker.label,
          id: marker.id,
        },
      };
    });

    const geojsonData: FeatureCollection = {
      type: 'FeatureCollection',
      features: features,
    };

    this.map.addSource('points', {
      type: 'geojson',
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 15,
      clusterRadius: 50,
    });

    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'points',
      filter: ['has', 'point_count'],
      // maxzoom: 15,

      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          500,
          '#f28cb1',
        ],
        // 'circle-color': '#11b4da',
        // 'circle-radius': 4,
        'circle-radius': ['step', ['get', 'point_count'], 20, 50, 30, 750, 40],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    });

    this.map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'points',
      maxzoom: 15,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    });

    this.map.addLayer({
      id: 'icons',
      type: 'symbol',
      source: 'points',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': '{id}',
        'icon-size': 0.15,
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 1.25],
        'text-anchor': 'top',
      },
    });

    this.map.on('click', 'icons', async (e) => {
      console.log(e.features);

      const modal = await this.modalController.create({
        component: HomePage,
        cssClass: 'full-screen-modal',
        componentProps: {
          id: 'unknown',
        },
      });
      await modal.present();
    });
  }
}
