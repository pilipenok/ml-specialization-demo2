import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatasetDaoService } from '../../services/dataset-dao.service';
import { StorageService } from '../../services/storage.service';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-dataset',
  templateUrl: './new-dataset.component.html',
  styleUrls: ['./new-dataset.component.css']
})
export class NewDatasetComponent {

  value = "Clear Me";
  
  name = new FormControl('', [Validators.required]);
  description = new FormControl('');
  uploadPercent!: Observable<number | undefined>;
  files!: any[];
  datasetId!: string;

  constructor(private authService : AuthService,
              private dao : DatasetDaoService,
              private storage : StorageService) {
    this.datasetId = dao.generateId();
  }
  
  onSubmit() {
    if (this.name.errors == null && this.description.errors == null) {
      this.dao.createDataset(this.datasetId, this.name.value, this.description.value);
    }
  }

  setFile(event:any) {
    this.files = event.srcElement.files;
  }

  uploadFile() {
    if (this.files.length > 0) {
      let task = this.storage.uploadFile(this.files[0], this.datasetId + '.csv');
      this.uploadPercent = task.percentageChanges();
    }
  }
}

