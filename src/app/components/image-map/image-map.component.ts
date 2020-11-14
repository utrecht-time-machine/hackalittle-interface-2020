import { Component, OnInit, ViewChild } from '@angular/core';
import 'pinch-zoom-element';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-map',
  templateUrl: './image-map.component.html',
  styleUrls: ['./image-map.component.scss'],
})
export class ImageMapComponent implements OnInit {
  @ViewChild('pinchZoom') pinchZoom;
    environment = environment;

  constructor() {}

  ngOnInit() {
    // Add resize listener to place image map in middle of screen
  }
}
