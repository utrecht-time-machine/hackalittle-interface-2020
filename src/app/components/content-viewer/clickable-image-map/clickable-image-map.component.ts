import { Component, Input, OnInit, ViewChild } from '@angular/core';
import 'pinch-zoom-element';
import { environment } from 'src/environments/environment';
import { ImageMapService } from '../../../services/image-map.service';

@Component({
  selector: 'app-clickable-image-map',
  templateUrl: './clickable-image-map.component.html',
  styleUrls: ['./clickable-image-map.component.scss'],
})
export class ClickableImageMapComponent implements OnInit {
  @Input() id: string;

  @ViewChild('pinchZoom') pinchZoom;
  environment = environment;

  imageMapItems: {
    coords: string;
    label: string;
    objectNr?: string;
  }[] = [];

  constructor(private imageMapService: ImageMapService) {}

  async ngOnInit() {
    // Add resize listener to place image map in middle of screen
    const imageMapId =
      'http://www.documentatie.org/data/ZoekplaatDb/ZplaatUitzicht/ZplaatUitzicht-HUA.catnr.84347/data/ZplaatUitzicht-1870.catnr.84347-PANDENframe.htm';
    this.imageMapItems = await this.imageMapService.getImageMapItems(
      imageMapId
    );
    // console.log(this.imageMapItems);
  }
}
