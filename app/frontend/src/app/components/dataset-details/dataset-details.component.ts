import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.css']
})
export class DatasetDetailsComponent implements OnInit {

  mlDisabled: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
