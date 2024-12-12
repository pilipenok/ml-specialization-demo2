/**
 * Copyright © 2021 EPAM Systems, Inc. All Rights Reserved. All information contained herein is,
 * and remains the property of EPAM Systems, Inc. and/or its suppliers and is protected by
 * international intellectual property law. Dissemination of this information or reproduction
 * of this material is strictly forbidden, unless prior written permission is obtained
 * from EPAM Systems, Inc
 */

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [
    MatIcon,
    CommonModule
  ]
})
export class MenuComponent {

  constructor(public authService: AuthService) { }

}
