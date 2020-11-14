import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-embedded',
  templateUrl: './embedded.component.html',
  styleUrls: ['./embedded.component.scss'],
})
export class EmbeddedComponent implements OnInit {
  environment = environment;

  constructor() { }

  ngOnInit() {}

}
