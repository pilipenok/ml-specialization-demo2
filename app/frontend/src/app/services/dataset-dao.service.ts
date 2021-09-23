/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class DatasetDaoService {

  constructor(private afs: AngularFirestore, private auth: AuthService) { }
  
  getDatasets() {
    return this.afs.collection<Dataset>('datasets').valueChanges();
  }
  
  createDataset(id: string, name: string, description: string,
                filename: string, type: string, size: number) {
    let newDataset = {
      id: id,
      user_id: this.auth.getUserId(),
      name: name,
      description: description,
      status: 1,
      creation_timestamp: new Date(),
      file_name: filename,
      file_type: type,
      file_size: size
    };
    this.afs.collection<Dataset>('datasets').doc(id).set(newDataset);
  }
  
  generateId(): string {
    return this.afs.createId();
  }

  getDataset(id: string): Observable<Dataset | undefined> {
    return this.afs.doc<Dataset>('datasets/' + id).valueChanges();
  }

  deleteDataset(id: string) {
    this.afs.doc<Dataset>('datasets/' + id).delete();
  }
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  status: number;
  creation_timestamp: Date;
  file_name: string;
  file_type: string;
  file_size: number;
}
