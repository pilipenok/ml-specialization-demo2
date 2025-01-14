/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  readonly DATASETS_DIRECTORY_NAME = 'datasets';

  constructor(private storage: AngularFireStorage) { }

  uploadFile(file: string, filename: string): AngularFireUploadTask {
    const filePath = this.DATASETS_DIRECTORY_NAME + '/' + filename;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    return task;
  }
}
