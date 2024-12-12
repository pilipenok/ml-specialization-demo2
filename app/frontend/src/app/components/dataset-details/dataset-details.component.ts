/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component, OnInit } from '@angular/core';
import {MatTab, MatTabGroup, MatTabsModule} from '@angular/material/tabs';
import {MatCard, MatCardModule} from '@angular/material/card';
import { DatasetDaoService, Dataset } from '../../services/dataset-dao.service';
import { ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.css'],
  providers: [ DatasetDaoService ],
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatTab,
    MatTabGroup
  ]
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
