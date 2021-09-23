/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

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
      .then((userCredential) => {
        this.userData = userCredential.user;
        this.router.navigateByUrl("/");
      });
  }
  
  isSignedIn() {
    return this.userData != null;
  }
  
  signOut() {
    this.auth.signOut();
    this.userData = null;
    this.router.navigateByUrl("/login");
  }
  
  getUserId(): string | null {
    return this.userData ? this.userData.uid : null;
  }
}
