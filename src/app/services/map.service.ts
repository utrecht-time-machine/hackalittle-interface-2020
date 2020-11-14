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
            },
            {
                html: '<strong>Jacobikerk</strong><br/>' +
                    'De Jacobikerk was oorspronkelijk een van de vier middeleeuwse parochiekerken van de stad.' +
                    '<br/><a href="/embedded">Read more</a>',
                imageUrl: 'http://histomap.eu/wp-content/uploads/2017/03/266px-Jacobikerk_Utrecht.jpg',
                coords: [5.115240, 52.095120]
            },
            {
                html: '<strong>Oudegracht</strong><br/>' +
                    'The Oudegracht, or "old canal", runs through the center of Utrecht, the Netherlands.' +
                    '<br/><a href="/home">Read more</a>',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Oudegracht_%28Utrecht%29.jpg/640px-Oudegracht_%28Utrecht%29.jpg',
                coords: [5.1196157, 52.0891439]
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
