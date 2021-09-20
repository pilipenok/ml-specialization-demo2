import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage, private auth: AuthService) { }

  uploadFile(file: string, filename: string): AngularFireUploadTask {
    const filePath = this.auth.getUserId() +  '/' + filename;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    return task;
  }
}
