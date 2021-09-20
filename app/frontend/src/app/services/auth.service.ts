import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: firebase.User | null = null;

  constructor(public auth: AngularFireAuth, private router: Router) {
    auth.authState.subscribe(user => {
      this.userData = user;
    });
   }
  
  signIn(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.router.navigateByUrl("/");
      });
  }
  
  isSignedIn() {
    console.log(this.userData != null);
    return this.userData != null;
  }
  
  signOut() {
    this.auth.signOut();
    this.router.navigateByUrl("/login");
  }
  
  getUserId(): string | null {
    return this.userData ? this.userData.uid : null;
  }
}
