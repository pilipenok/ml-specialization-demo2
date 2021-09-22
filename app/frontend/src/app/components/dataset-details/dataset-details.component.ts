import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { DatasetDaoService, Dataset } from '../../services/dataset-dao.service';
import { ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.css']
})
export class DatasetDetailsComponent implements OnInit {

  datasetIdFromRoute!: string | null;

  item!: Observable<Dataset | undefined>;

  constructor(private route: ActivatedRoute, private dao : DatasetDaoService) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.datasetIdFromRoute = routeParams.get('datasetId');
    if (this.datasetIdFromRoute != null) {
      this.item = this.dao.getDataset(this.datasetIdFromRoute);
    }
  }
}
