/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class DatasetDaoService {

  private userDoc: AngularFirestoreDocument;
  private datasetsCollection: AngularFirestoreCollection<Dataset>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.userDoc = this.afs.doc<Dataset>('users/' + auth.getUserId());
    this.datasetsCollection = this.userDoc.collection<Dataset>('datasets');
  }
  
  getDatasets() {
    return this.userDoc.collection<Dataset>('datasets',
                                            ref => ref.orderBy('creation_timestamp', 'desc')
                       ).valueChanges();
  }
  
  createDataset(id: string, name: string, description: string,
                filename: string, type: string, size: number) {
    let newDataset: Dataset = {
      id: id,
      name: name,
      description: description,
      status: 1,
      creation_timestamp: new Date(),
      file_name: filename,
      file_type: type,
      file_size: size
    };
    this.datasetsCollection.doc(id).set(newDataset);
  }
  
  generateId(): string {
    return this.afs.createId();
  }

  getDataset(id: string): Observable<Dataset | undefined> {
    return this.datasetsCollection.doc(id).valueChanges();
  }

  deleteDataset(id: string) {
    this.datasetsCollection.doc(id).delete();
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
