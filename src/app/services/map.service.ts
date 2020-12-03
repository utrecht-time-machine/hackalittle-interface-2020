import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { Feature, FeatureCollection } from 'geojson';
import { ModalController } from '@ionic/angular';
import { ContentViewer } from '../components/content-viewer/content-viewer.component';
import { MarkerService } from './marker.service';
import { Marker } from '../models/marker.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: mapboxgl.Map;
  addedMarkers = false;

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
      this.addImageForMarkerId(markerId);
    });

    this.map.on('load', async () => {
      this.map.resize();

      this.markerService.markers.subscribe(async (markers) => {
        console.log('Markers: ', markers);
        await this.addMarkers();
      });
    });
  }

  private async addImageForMarkerId(markerId) {
    const imageUrl = this.markerService.retrieveMarkerImageById(markerId);
    if (!imageUrl) {
      console.log('IMAGE', markerId, imageUrl);
    }

    return await new Promise((resolve, rejects) => {
      this.map.loadImage(imageUrl, (error, image) => {
        if (error) {
          console.warn(error);
          return;
        }

        if (this.map.hasImage(markerId)) {
          return resolve('Image already loaded');
        }
        this.map.addImage(markerId, image);
        resolve(image);
      });
    });
  }

  private async removeMarkers() {
    this.map.removeLayer('icons');
    this.map.removeLayer('cluster-count');
    this.map.removeLayer('clusters');
    this.map.removeSource('points');
  }

  private async addMarkers() {
    if (this.addedMarkers) {
      this.removeMarkers();
    }

    const markers: Marker[] = await this.markerService.markers.getValue();

    const features: Feature[] = markers.map((marker) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [(marker.lngLat as any).lng, (marker.lngLat as any).lat],
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
      clusterMaxZoom: 16,
      clusterRadius: 50,
    });

    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'points',
      filter: ['has', 'point_count'],
      // maxzoom: 16,

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
      maxzoom: 16,
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
        'icon-size': 1,
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-offset': [0, 2],
        'text-size': 12,
        'text-anchor': 'top',
      },
    });

    if (!this.addedMarkers) {
      this.addedMarkers = true;

      this.map.on('click', 'icons', async (e) => {
        console.log(e.features);
        const id = e.features[0].properties.id;
        if (!id) {
          alert('No ID available');
          return;
        }

        const modal = await this.modalController.create({
          component: ContentViewer,
          cssClass: 'full-screen-modal',
          componentProps: {
            id,
            modalController: this.modalController,
          },
        });
        await modal.present();
      });
    }
  }
}
