import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { DatasetDaoService, Dataset } from '../../services/dataset-dao.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.css']
})
export class DatasetListComponent implements OnInit {

  displayedColumns: string[] = ['name' , 'description', 'filename', 'type', 'size',
                                'creation_timestamp', 'status', 'actions'];

  datasets!: Observable<Dataset[]>;

  constructor(private dao : DatasetDaoService) {  }

  ngOnInit(): void {
    this.datasets = this.dao.getDatasets();
  }
}
