/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component } from '@angular/core';
import {MatCard, MatCardModule} from '@angular/material/card';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {MatError, MatFormField} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    MatError,
    MatInput,
    MatLabel,
    MatFormField,
    MatCard,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    MatError,
    CommonModule
  ]
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
      this.authService.signIn(this.email.value ?? "", this.password.value ?? "");
    }
  }
}
