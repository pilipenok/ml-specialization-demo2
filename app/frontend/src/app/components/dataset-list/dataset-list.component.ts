/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { DatasetDaoService, Dataset } from '../../services/dataset-dao.service';
import { Observable } from 'rxjs';
import { DeleteDatasetDialogComponent } from '../delete-dataset-dialog/delete-dataset-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.css'],
  providers: [ DatasetDaoService ]
})
export class DatasetListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description', 'filename', 'type', 'size',
                                'creation_timestamp', 'status', 'actions'];

  datasets!: Observable<Dataset[]>;

  constructor(private dao: DatasetDaoService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.datasets = this.dao.getDatasets();
  }

  onDeleteClick(dataset: Dataset): void {
    const dialogRef = this.dialog.open(DeleteDatasetDialogComponent, {
      width: '350px',
      data: dataset
    });
  }
}
