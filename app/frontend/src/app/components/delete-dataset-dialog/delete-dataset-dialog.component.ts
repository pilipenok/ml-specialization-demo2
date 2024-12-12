/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatasetDaoService, Dataset } from '../../services/dataset-dao.service';

@Component({
  selector: 'app-delete-dataset-dialog',
  templateUrl: './delete-dataset-dialog.component.html',
  styleUrls: ['./delete-dataset-dialog.component.css'],
  providers: [ DatasetDaoService ],
  standalone: true
})
export class DeleteDatasetDialogComponent {

  constructor(
      public dialogRef: MatDialogRef<DeleteDatasetDialogComponent>,
      private dao : DatasetDaoService,
      @Inject(MAT_DIALOG_DATA) public data: Dataset) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick() {
    this.dao.deleteDataset(this.data.id);
    this.dialogRef.close();
  }
}
