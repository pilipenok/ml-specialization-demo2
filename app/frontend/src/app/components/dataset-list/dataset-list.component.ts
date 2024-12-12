/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { DatasetDaoService, Dataset, User } from '../../services/dataset-dao.service';
import { Observable } from 'rxjs';
import { DeleteDatasetDialogComponent } from '../delete-dataset-dialog/delete-dataset-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatIcon} from "@angular/material/icon";
import {MatCell, MatTable} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.css'],
  providers: [ DatasetDaoService ],
  standalone: true,
  imports: [
    MatIcon,
    MatCell,
    CommonModule,
    RouterModule,
    MatTable
  ]
})
export class DatasetListComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'description', 'filename', 'type', 'size',
                                'creation_timestamp', 'status', 'actions'];

  datasets!: Observable<Dataset[]>;
  modelStatus: number | undefined = 0;
  modelError: string | undefined;

  constructor(private dao: DatasetDaoService, private dialog: MatDialog) { }

  ngOnInit(): void {
    let userData = this.dao.getUserData();
    userData.subscribe(
          (value:User | undefined) => {
            this.modelStatus = value?.model_state?.status;
            this.modelError = value?.model_state?.error;
          },
          (error) => {
            console.log(error);
          });
    this.datasets = this.dao.getDatasets();
  }

  onDeleteClick(dataset: Dataset): void {
    const dialogRef = this.dialog.open(DeleteDatasetDialogComponent, {
      width: '350px',
      data: dataset
    });
  }
}
