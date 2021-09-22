import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatasetDaoService, Dataset } from '../../services/dataset-dao.service';

@Component({
  selector: 'app-delete-dataset-dialog',
  templateUrl: './delete-dataset-dialog.component.html',
  styleUrls: ['./delete-dataset-dialog.component.css']
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
