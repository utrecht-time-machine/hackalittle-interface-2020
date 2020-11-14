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
            zoom: 3,
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
                html: '<strong>Creation of The Starry Night</strong><br/>Van Gogh created The Starry Night in the Saint-Paul-de-Mausole asylum in Saint-Rémy.',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/303px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
                coords: [4.832241, 43.788854]
            },
            {
                html: '<strong>Les XX (1889)</strong><br/>The first important display of Paul Gauguin\'s works.',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Paul_Gauguin_032.jpg/613px-Paul_Gauguin_032.jpg',
                coords: [4.357900, 50.841987]
            },
            {
                html: '<strong>Exposition Universelle of 1889</strong><br/>The world\'s fair in Paris for which the Eiffel tower was created.',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Paris_1889_plakat.jpg/541px-Paris_1889_plakat.jpg',
                coords: [2.294699, 48.859274]
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
