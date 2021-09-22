import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class DatasetDaoService {

  private itemsCollection: AngularFirestoreCollection<Dataset>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.itemsCollection = afs.collection<Dataset>('datasets');
  }
  
  getDatasets() {
    return this.itemsCollection.valueChanges();
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
    this.itemsCollection.doc(id).set(newDataset);
  }
  
  generateId(): string {
    return this.afs.createId();
  }

  getDataset(datasetId: string): Observable<Dataset | undefined> {
    return this.itemsCollection.doc(datasetId).valueChanges();
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
