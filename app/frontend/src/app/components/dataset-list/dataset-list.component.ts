import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { DatasetDaoService, Dataset } from '../../services/dataset-dao.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.css']
})
export class DatasetListComponent {

  datasets : Observable<Dataset[]>;

  constructor(private dao : DatasetDaoService) { 
    this.datasets = dao.getDatasets();
  }
  
  displayedColumns: string[] = ['name' , 'description', 'status', 'actions'];
}

