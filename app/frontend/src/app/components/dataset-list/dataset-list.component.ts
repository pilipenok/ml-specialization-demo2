import { Component, OnInit } from '@angular/core';
import {MatListModule} from '@angular/material/list';

import {datasets} from '../../datasets';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.css']
})
export class DatasetListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  datasets = datasets;

  displayedColumns: string[] = ['name', 'description', 'size', 'status', 'createdDate', 'createdUser', 'actions'];

}
