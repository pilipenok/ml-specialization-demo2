import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class DatasetDaoService {

  private itemsCollection: AngularFirestoreCollection<Dataset>;
  private items: Observable<Dataset[]>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.itemsCollection = afs.collection<Dataset>('datasets');
    this.items = this.itemsCollection.valueChanges();
  }
  
  getDatasets() {
    return this.items;
  }
  
  createDataset(id: string, name: string, description: string) {
    let newDataset = {
      id: id,
      user_id: this.auth.getUserId(),
      name: name,
      description: description,
      status: 0,
      creation_timestamp: new Date()
    };
    this.itemsCollection.add(newDataset);
  }
  
  generateId(): string {
    return this.afs.createId();
  }
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  status: number;
  creation_timestamp: Date;
}
