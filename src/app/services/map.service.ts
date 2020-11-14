import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    map: mapboxgl.Map;

    constructor() {

    }

    async initializeMap(id: string) {
        (mapboxgl as any).accessToken = environment.mapbox.accessToken;
        this.map = new mapboxgl.Map({
            container: id,
            style: environment.mapbox.styleUrl,
            zoom: environment.mapbox.zoomLevel,
            center: environment.mapbox.center as any
        });

        this.map.addControl(new mapboxgl.NavigationControl());

        this.map.on('load', () => {
            this.map.resize();
        });

        await this.addMarkers();
    }

    private addMarkers() {
        const markers = [
            {
                html: '<strong>Dom Tower</strong><br/>' +
                    'The Dom Tower of Utrecht is the tallest church tower in the Netherlands, at 112 metres in height.' +
                    '<br/><a href="/home">Read more</a>',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/DomTorenUtrechtNederland.jpg',
                coords: [5.121312, 52.090768]
            }
        ];

        for (const marker of markers) {

            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = `url(${marker.imageUrl})`;

            const popup = new mapboxgl.Popup({offset: 25}).setHTML(
                marker.html
            );

            new mapboxgl.Marker(el)
                .setLngLat(marker.coords as any)
                .setPopup(popup)
                .addTo(this.map);
        }

    }

}