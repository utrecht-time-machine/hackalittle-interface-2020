import { Component, OnInit } from '@angular/core';
import { MarkerService } from '../../../services/marker.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-source-selection',
  templateUrl: './source-selection.component.html',
  styleUrls: ['./source-selection.component.scss'],
})
export class SourceSelectionComponent implements OnInit {
  environment = environment;

  constructor(public markers: MarkerService) {}

  ngOnInit() {}
}
