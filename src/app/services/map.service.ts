import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { Feature, FeatureCollection } from 'geojson';
import { ModalController } from '@ionic/angular';
import { EntityService } from './entity.service';
import { Entity } from '../models/entity.model';
import { EventData, MapboxGeoJSONFeature, MapMouseEvent } from 'mapbox-gl';
import { ContentViewerComponent } from '../components/content-viewer/content-viewer.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: mapboxgl.Map;
  markersAddedToMap = false;

  private shownMarkerSourceIds: BehaviorSubject<string[]>;

  constructor(
    private entities: EntityService,
    private modalController: ModalController
  ) {}

  async initializeMap(id: string) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    this.shownMarkerSourceIds = new BehaviorSubject<string[]>(
      this.entities.getSourceIds()
    );
    this.map = new mapboxgl.Map({
      container: id,
      style: environment.mapbox.styleUrl,
      zoom: environment.mapbox.zoomLevel,
      center: environment.mapbox.center as any,
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('styleimagemissing', async (e) => {
      const markerId = e.id;
      await this.addImageForMarkerId(markerId);
    });

    this.map.on('load', async () => {
      this.map.resize();

      this.entities.all.subscribe(async (_) => {
        await this.showMarkers();
      });
      this.shownMarkerSourceIds.subscribe(async (_) => {
        await this.showMarkers();
      });
    });
  }

  private async addImageForMarkerId(markerId) {
    const imageUrl = this.entities.retrieveMarkerImageById(markerId);
    if (!imageUrl) {
      console.log('No image found for marker:', markerId, imageUrl);
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
    this.map.removeLayer('markers');
    this.map.removeLayer('cluster-count');
    this.map.removeLayer('clusters');
    this.map.removeSource('points');
  }

  private async showMarkers() {
    const entities: Entity[] = await this.getShownMarkers();

    const features: Feature[] = entities.map((entity) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [(entity.lngLat as any).lng, (entity.lngLat as any).lat],
        },
        properties: {
          title: entity.label,
          id: entity.id,
          entity: entity,
        },
      };
    });

    const geojsonData: FeatureCollection = {
      type: 'FeatureCollection',
      features: features,
    };

    if (this.map.getSource('points')) {
      await this.removeMarkers();
    }

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
      id: 'markers',
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

    if (!this.markersAddedToMap) {
      this.markersAddedToMap = true;

      this.map.on('click', 'markers', async (e) => {
        await this.onMapMarkerClicked(e);
      });
    }
  }

  public getShownMarkers(): Entity[] {
    return this.entities
      .getAll()
      .filter((entity) =>
        this.shownMarkerSourceIds.getValue().includes(entity.source)
      );
  }

  public toggleMarkerSourceById(sourceId: string) {
    let shownMarkerSourceIds = this.shownMarkerSourceIds.getValue();

    const markerSourceIsShown = shownMarkerSourceIds.includes(sourceId);
    if (markerSourceIsShown) {
      shownMarkerSourceIds = shownMarkerSourceIds.filter(
        (shownSourceId) => shownSourceId !== sourceId
      );
    } else {
      shownMarkerSourceIds.push(sourceId);
    }
    this.shownMarkerSourceIds.next(shownMarkerSourceIds);
    console.log('Currently shown sources:', shownMarkerSourceIds);
  }

  private async onMapMarkerClicked(
    e: MapMouseEvent & { features?: MapboxGeoJSONFeature[] } & EventData
  ) {
    // console.log(e.features);
    const entityStr: string = e.features[0]?.properties?.entity;
    if (!entityStr) {
      console.warn('Clicked entity was not found.');
      return;
    }
    const entity: Entity = JSON.parse(entityStr) as Entity;

    const modal = await this.modalController.create({
      component: ContentViewerComponent,
      cssClass: 'full-screen-modal',
      componentProps: {
        entity,
        modalController: this.modalController,
      },
    });
    await modal.present();
  }
}
