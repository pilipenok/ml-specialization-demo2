/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 
  constructor(public authService: AuthService) { }

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  
  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }

    return '';
  }
  
  onSubmit() {
    if (this.email.errors == null && this.password.errors == null) {
      this.authService.signIn(this.email.value, this.password.value);
    }
  }
}
