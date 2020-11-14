import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {Marker, MarkerService} from "./marker.service";

@Injectable({
    providedIn: 'root'
})
export class MapService {
    map: mapboxgl.Map;

    constructor(private markerService: MarkerService) {

    }

    async initializeMap(id: string) {
        (mapboxgl as any).accessToken = environment.mapbox.accessToken;
        this.map = new mapboxgl.Map({
            container: id,
            style: environment.mapbox.styleUrl,
            zoom: environment.mapbox.zoomLevel,
            center: environment.mapbox.center as any,
        });

        this.map.addControl(new mapboxgl.NavigationControl());

        this.map.on('load', () => {
            this.map.resize();

            this.addMarkers();
            // this.markerService.markers.subscribe(async (markers) => {
            //     await this.addMarkers(markers)
            // });
        });


    }

    private async addMarkersAsGeoJSON() {
        const geojsonData = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [
                            -77.03238901390978,
                            38.913188059745586
                        ]
                    },
                    'properties': {
                        'title': 'Mapbox DC'
                    }
                },
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-122.414, 37.776]
                    },
                    'properties': {
                        'title': 'Mapbox SF'
                    }
                }
            ]
        };

        this.map.addSource('points', {
                'type': 'geojson',
                'data': geojsonData
            }
        );

        this.map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
                'icon-image': 'custom-marker',
                'text-field': ['get', 'title'],
                'text-font': [
                    'Open Sans Semibold',
                    'Arial Unicode MS Bold'
                ],
                'text-offset': [0, 1.25],
                'text-anchor': 'top'
            }
        });
    }

    private async addMarkers() {
        const markers = await this.markerService.retrieveMarkers();

        for (const marker of markers) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = `url(https://via.placeholder.com/150)`;

            const popup = new mapboxgl.Popup({offset: 25}).setHTML(
                `<strong>${marker.label}</strong>` + '<br/><a href="/home">Read more</a>'
            );

            new mapboxgl.Marker(el)
                .setLngLat(marker.lngLat)
                .setPopup(popup)
                .addTo(this.map);
        }

    }

}
