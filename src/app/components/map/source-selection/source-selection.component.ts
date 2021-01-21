import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MapService } from '../../../services/map.service';

@Component({
  selector: 'app-source-selection',
  templateUrl: './source-selection.component.html',
  styleUrls: ['./source-selection.component.scss'],
})
export class SourceSelectionComponent implements OnInit {
  environment = environment;

  constructor(public map: MapService) {}

  ngOnInit() {}
}
