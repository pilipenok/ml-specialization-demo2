/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatasetDaoService } from '../../services/dataset-dao.service';
import { StorageService } from '../../services/storage.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStep } from '@angular/material/stepper';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-new-dataset',
  templateUrl: './new-dataset.component.html',
  styleUrls: ['./new-dataset.component.css'],
  providers: [ DatasetDaoService ]
})
export class NewDatasetComponent implements OnInit {

  private datasetId!: string;
  private file: any = null;

  @ViewChild('step1') step1!: MatStep;
  @ViewChild('step2') step2!: MatStep;
  @ViewChild('step3') step3!: MatStep;
  @ViewChild('doneStep') doneStep!: MatStep;

  name = new FormControl('', [Validators.required]);
  description = new FormControl('');
  fileUrl = new FormControl('', [Validators.required]); // hidden
  startModelResult = new FormControl('', [Validators.required]); // hidden

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;

  uploadPercent!: Observable<number | undefined>;
  generateMlAvailable: boolean = true;
  next2Disabled: boolean = true;

  constructor(private authService : AuthService,
              private dao : DatasetDaoService,
              private storage : StorageService) { }

  ngOnInit(): void {
    this.datasetId = this.dao.generateId();
    this.firstFormGroup = new FormGroup({'name': this.name, 'description': this.description});
    this.secondFormGroup = new FormGroup({'fileUrl': this.fileUrl});
    this.thirdFormGroup = new FormGroup({'startModelResult': this.startModelResult});
  }

  onFileChanged(event: any): void {
    if (event.srcElement.files.length > 0) {
      this.file = event.srcElement.files[0];
      this.uploadFile(this.file);
    }
  }
  
  onSubmit(): void {
    if (this.firstFormGroup.errors == null
        && this.secondFormGroup.errors == null
        && this.thirdFormGroup.errors == null) {
      this.dao.createDataset(
                  this.datasetId,
                  this.name.value,
                  this.description.value,
                  this.file.name,
                  this.file.type,
                  this.file.size);
      this.generateMlAvailable = false;
      this.startModelResult.setValue(true);
      this.doneStep.select();
      this.step1.editable = false;
      this.step2.editable = false;
      this.step3.editable = false;
    }
  }

  uploadFile(file: any): void {
    if (file != null) {
      const task = this.storage.uploadFile(
                                  file,
                                  this.makeFilePath(),
                                  url => { this.fileUrl.setValue(url); } );
      this.uploadPercent = task.percentageChanges();
    }
  }

  makeFilePath(): string {
    return this.authService.getUserId() + '/' + this.datasetId + '.csv';
  }

  isFirstStepCompleted(): boolean {
    return true;
  }
}
