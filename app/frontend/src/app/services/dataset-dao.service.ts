import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DatasetDaoService {

  private itemsCollection: AngularFirestoreCollection<Dataset>;
  items: Observable<Dataset[]>;

  constructor(afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Dataset>('datasets');
    this.items = this.itemsCollection.valueChanges();
  }
  
  getDatasets() {
    return this.items;
  }
}

export interface Dataset {
  id: number;
  name: string;
  description: string;
  status: number;
  creation_timestamp: Date;
}

