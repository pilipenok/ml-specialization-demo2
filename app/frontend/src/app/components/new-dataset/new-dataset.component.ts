/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatasetDaoService, User } from '../../services/dataset-dao.service';
import { StorageService } from '../../services/storage.service';
import {FormControl, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';
import {MatProgressBar, MatProgressBarModule} from '@angular/material/progress-bar';
import {MatStep, MatStepperModule} from '@angular/material/stepper';
import { Observable } from 'rxjs';
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {CommonModule} from "@angular/common";
import {MatCard} from "@angular/material/card";
import {MatTab} from "@angular/material/tabs";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";


@Component({
  selector: 'app-new-dataset',
  templateUrl: './new-dataset.component.html',
  styleUrls: ['./new-dataset.component.css'],
  providers: [DatasetDaoService],
  imports: [
    MatStepperModule,
    MatProgressBarModule,
    MatLabel,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatInput,
    MatButton,
    RouterLink
  ]
})
export class NewDatasetComponent implements OnInit {

  private file: any = null;

  @ViewChild('step1') step1!: MatStep;
  @ViewChild('step2') step2!: MatStep;
  @ViewChild('doneStep') doneStep!: MatStep;

  name = new FormControl('', [Validators.required]);
  description = new FormControl('');

  fileUploadResult = new FormControl('', [Validators.required]); // hidden

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  uploadPercent!: Observable<number | undefined>;
  fileLocation: string = '';

  constructor(private auth : AuthService,
              private dao : DatasetDaoService,
              private storage : StorageService) { }

  ngOnInit(): void {
    this.firstFormGroup = new FormGroup({'name': this.name, 'description': this.description});
    this.secondFormGroup = new FormGroup({'fileUploadResult': this.fileUploadResult});
  }

  onFileChanged(event: any): void {
    this.fileLocation = '';

    if (event.srcElement.files.length == 0) return;

    const file = event.srcElement.files[0];
    if (file.size > 1024 * 1024 * 1024) { // 1 Gb
      this.fileLocation = 'File is too large';
      return;
    }
    this.fileLocation = file.name;
    this.file = file;
    this.uploadFile(file, () => {
      const datasetId: string = this.dao.generateId();
      this.dao.createDataset(
                      datasetId,
                      this.name.value ?? "",
                      this.description.value ?? "",
                      this.file.name,
                      this.file.type,
                      this.file.size);
      this.dao.resetModelState();
      this.doneStep.select();
      this.step1.editable = false;
      this.step2.editable = false;
    });
  }

  uploadFile(file: any, onSuccess: () => void): void {
    let uploadComplete: boolean = false;
    if (file && this.auth.isSignedIn()) {
      const task = this.storage.uploadFile(file, this.auth.getUserId() + '/dataset.csv');
      this.uploadPercent = task.percentageChanges();
      this.uploadPercent.subscribe(val => {
        if (val == 100 && !uploadComplete) {
          uploadComplete = true;
          this.fileUploadResult.setValue("done");
          onSuccess();
        }
      });
    }
  }
}
